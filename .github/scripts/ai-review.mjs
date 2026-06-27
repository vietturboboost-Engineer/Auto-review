#!/usr/bin/env node
/**
 * AI-powered Pull Request reviewer.
 *
 * Workflow per run:
 *   1. Skip if PR is draft or has a skip label / `[skip ai-review]` keyword.
 *   2. Fetch the unified PR diff and the PR metadata (title/body) for context.
 *   3. Filter out lock files, binaries, generated paths, oversized patches.
 *   4. Build a Senior-Engineer-style system prompt (with PR context + project rules).
 *   5. Review remaining files in parallel (bounded concurrency, retry on 429/5xx).
 *   6. Upsert a single sticky summary comment on the PR (updated in place across runs).
 *   7. Post NEW inline review comments only (dedup by path:line:body against previous runs).
 *   8. Mirror the summary into GitHub Actions step summary for visibility.
 *
 * Supported providers (set AI_PROVIDER env var):
 *   - openai     -> uses OPENAI_API_KEY (default model: gpt-4o-mini, structured outputs)
 *   - anthropic  -> uses ANTHROPIC_API_KEY (default model: claude-3-5-haiku-latest)
 *   - gemini     -> uses GEMINI_API_KEY (default model: gemini-2.5-flash)
 */

import { Octokit } from "@octokit/rest";
import parseDiff from "parse-diff";
import fs from "node:fs/promises";
import path from "node:path";

const {
  GITHUB_TOKEN,
  GITHUB_REPOSITORY,
  GITHUB_WORKSPACE,
  GITHUB_STEP_SUMMARY,
  PR_NUMBER,
  PR_HEAD_SHA,
  AI_PROVIDER = "openai",
  AI_MODEL,
  OPENAI_API_KEY,
  ANTHROPIC_API_KEY,
  GEMINI_API_KEY,
  MAX_FILES = "25",
  MAX_PATCH_CHARS = "12000",
  REVIEW_LANGUAGE = "English",
  AI_REVIEW_PROJECT_RULES = "",
  AI_REVIEW_CONCURRENCY = "4",
  AI_REVIEW_SKIP_LABELS = "skip-ai-review,no-ai-review",
} = process.env;

const MAX_FILES_NUM = Math.max(1, parseInt(MAX_FILES, 10) || 25);
const MAX_PATCH_NUM = Math.max(500, parseInt(MAX_PATCH_CHARS, 10) || 12000);
const CONCURRENCY = Math.max(1, Math.min(10, parseInt(AI_REVIEW_CONCURRENCY, 10) || 4));

// Hidden marker embedded in every comment we post so we can find / dedup our own.
const BOT_MARKER = "<!-- ai-review-bot:v1 -->";
const SKIP_LABEL_NAMES = AI_REVIEW_SKIP_LABELS
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
const SKIP_KEYWORD_RE = /\[\s*(skip|no)[\s-]ai[\s-]?review\s*\]/i;

// JSON schema for OpenAI structured outputs (strict mode).
const OPENAI_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["comments"],
  properties: {
    comments: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["line", "severity", "issue", "reason", "suggested_fix", "code_example"],
        properties: {
          line: { type: "integer", minimum: 1 },
          severity: { type: "string", enum: ["critical", "major", "minor", "suggestion"] },
          issue: { type: "string" },
          reason: { type: "string" },
          suggested_fix: { type: "string" },
          code_example: { type: "string" },
        },
      },
    },
  },
};

if (!GITHUB_TOKEN) fail("Missing GITHUB_TOKEN");
if (!GITHUB_REPOSITORY) fail("Missing GITHUB_REPOSITORY");
if (!PR_NUMBER) fail("Missing PR_NUMBER");

const [owner, repo] = GITHUB_REPOSITORY.split("/");
const prNumber = parseInt(PR_NUMBER, 10);

const SKIP_PATTERNS = [
  /(^|\/)node_modules\//,
  /(^|\/)vendor\//,
  /(^|\/)dist\//,
  /(^|\/)build\//,
  /(^|\/)out\//,
  /(^|\/)coverage\//,
  /(^|\/)\.next\//,
  /(^|\/)\.nuxt\//,
  /(^|\/)\.turbo\//,
  /\.lock$/,
  /(^|\/)(package|pnpm|yarn|composer)-lock\.(json|yaml)$/,
  /(^|\/)(poetry|Gemfile|Cargo)\.lock$/,
  /(^|\/)go\.sum$/,
  /\.min\.(js|css)$/,
  /\.map$/,
  /\.snap$/,
  /\.(png|jpg|jpeg|gif|webp|ico|svg|pdf|zip|tar|gz|bz2|7z|woff2?|ttf|eot|otf|mp3|mp4|mov|webm|wasm)$/i,
];

const PROVIDERS = {
  openai: {
    defaultModel: "gpt-4o-mini",
    keyEnv: "OPENAI_API_KEY",
    key: OPENAI_API_KEY,
    call: callOpenAI,
  },
  anthropic: {
    defaultModel: "claude-3-5-haiku-latest",
    keyEnv: "ANTHROPIC_API_KEY",
    key: ANTHROPIC_API_KEY,
    call: callAnthropic,
  },
  gemini: {
    defaultModel: "gemini-2.5-flash",
    keyEnv: "GEMINI_API_KEY",
    key: GEMINI_API_KEY,
    call: callGemini,
  },
};

const provider = PROVIDERS[AI_PROVIDER];
if (!provider) fail(`Unknown AI_PROVIDER "${AI_PROVIDER}". Use openai | anthropic | gemini.`);
if (!provider.key) fail(`Missing ${provider.keyEnv} for provider "${AI_PROVIDER}".`);

const model = AI_MODEL || provider.defaultModel;

const octokit = new Octokit({ auth: GITHUB_TOKEN });

const projectRules = await loadProjectRules();

await main();

async function loadProjectRules() {
  const inline = AI_REVIEW_PROJECT_RULES.trim();
  const repoRoot = GITHUB_WORKSPACE || path.resolve("../..");
  const candidates = [
    path.join(repoRoot, ".github", "ai-review-rules.md"),
    path.join(repoRoot, ".github", "AI_REVIEW_RULES.md"),
  ];
  for (const p of candidates) {
    try {
      const text = await fs.readFile(p, "utf8");
      if (text.trim()) {
        log(`Loaded project rules from ${path.relative(repoRoot, p)}`);
        return text.trim();
      }
    } catch {
      /* ignore missing */
    }
  }
  if (inline) log("Loaded project rules from AI_REVIEW_PROJECT_RULES env var");
  return inline;
}

async function main() {
  log(`Reviewing ${owner}/${repo}#${prNumber} with ${AI_PROVIDER}/${model}`);

  const { data: pr } = await octokit.pulls.get({ owner, repo, pull_number: prNumber });
  const headSha = PR_HEAD_SHA || pr.head.sha;

  // Honor opt-out via label or `[skip ai-review]` keyword in PR title/body.
  const skipReason = shouldSkipPR(pr);
  if (skipReason) {
    log(`Skipping AI review (${skipReason}).`);
    await writeStepSummary(`### AI Code Review skipped\n\nReason: ${skipReason}`);
    return;
  }

  // Get raw unified diff (more reliable than the JSON files endpoint for parsing hunks).
  const diffRes = await octokit.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
    mediaType: { format: "diff" },
  });
  const rawDiff = typeof diffRes.data === "string" ? diffRes.data : "";
  if (!rawDiff) {
    log("Empty diff, nothing to review.");
    return;
  }

  const files = parseDiff(rawDiff);
  const reviewable = files
    .filter((f) => f.to && f.to !== "/dev/null")
    .filter((f) => !SKIP_PATTERNS.some((re) => re.test(f.to)))
    .filter((f) => (f.chunks?.length ?? 0) > 0);

  if (reviewable.length === 0) {
    log("No reviewable files after filtering.");
    const note =
      `## AI Code Review Summary\n\n` +
      `Reviewer: ${AI_PROVIDER}/${model}\n\n` +
      `No reviewable files in this PR (only docs/lock/binary changes).`;
    await upsertStickySummary(note);
    await writeStepSummary(note);
    return;
  }

  log(`Reviewing ${Math.min(reviewable.length, MAX_FILES_NUM)} of ${reviewable.length} changed files (concurrency=${CONCURRENCY}).`);

  // Build the system prompt ONCE with PR context; reused for every file review.
  const prContext = buildPRContext(pr, reviewable);
  const systemPrompt = buildSystemPrompt(prContext);

  // Pre-filter files that are too large to send to the model.
  const toReview = [];
  let skippedTooLarge = 0;
  for (const file of reviewable.slice(0, MAX_FILES_NUM)) {
    const validLines = collectValidLines(file);
    if (validLines.size === 0) continue;
    const patchText = renderPatch(file);
    if (!patchText) continue;
    if (patchText.length > MAX_PATCH_NUM) {
      skippedTooLarge++;
      log(`Skipping ${file.to} (patch ${patchText.length} chars > ${MAX_PATCH_NUM})`);
      continue;
    }
    toReview.push({ file, patchText, validLines });
  }

  // Run AI reviews in parallel with bounded concurrency.
  const results = await pMap(toReview, CONCURRENCY, async ({ file, patchText, validLines }) => {
    try {
      const aiComments = await reviewFile(file.to, patchText, systemPrompt);
      return { file, aiComments, validLines };
    } catch (err) {
      log(`AI error on ${file.to}: ${err.message}`);
      return { file, error: err };
    }
  });

  const allComments = [];
  const severityCounts = { critical: 0, major: 0, minor: 0, suggestion: 0 };
  let aiErrors = 0;
  for (const r of results) {
    if (r.error) {
      aiErrors++;
      continue;
    }
    for (const c of r.aiComments) {
      const line = nearestValidLine(c.line, r.validLines);
      if (line == null) continue;
      severityCounts[c.severity] = (severityCounts[c.severity] || 0) + 1;
      allComments.push({
        path: r.file.to,
        line,
        side: "RIGHT",
        body: `${BOT_MARKER}\n${formatComment(c)}`,
      });
    }
  }

  const summary = buildSummary({
    totalFiles: reviewable.length,
    reviewedFiles: Math.min(reviewable.length, MAX_FILES_NUM),
    skippedTooLarge,
    aiErrors,
    severityCounts,
  });

  // Always update the sticky summary comment + workflow step summary.
  await upsertStickySummary(summary);
  await writeStepSummary(summary);

  if (allComments.length === 0) {
    log("No inline comments to post (sticky summary updated).");
    return;
  }

  // Skip inline comments that already exist verbatim (avoid spam on repeated runs).
  const { newComments, dedupedCount } = await dedupInlineComments(allComments);
  if (dedupedCount > 0) log(`Skipped ${dedupedCount} duplicate inline comments already posted.`);
  if (newComments.length === 0) {
    log("All inline comments were duplicates; nothing new to post.");
    return;
  }

  // Chunk to stay under GitHub's review payload limits.
  const CHUNK_SIZE = 30;
  for (let i = 0; i < newComments.length; i += CHUNK_SIZE) {
    const chunk = newComments.slice(i, i + CHUNK_SIZE);
    await octokit.pulls.createReview({
      owner,
      repo,
      pull_number: prNumber,
      commit_id: headSha,
      event: "COMMENT",
      body:
        i === 0
          ? `${BOT_MARKER}\nAI inline review — see the sticky summary above for the overall verdict.`
          : `${BOT_MARKER}\nAI inline review (continued: ${i + 1}–${i + chunk.length}).`,
      comments: chunk,
    });
  }
  log(`Posted ${newComments.length} new inline comments.`);
}

function collectValidLines(file) {
  const set = new Set();
  for (const chunk of file.chunks ?? []) {
    for (const change of chunk.changes ?? []) {
      // Only "add" or "normal" lines exist on the RIGHT side and are commentable.
      if (change.type === "add" || change.type === "normal") {
        if (typeof change.ln === "number") set.add(change.ln);
        else if (typeof change.ln2 === "number") set.add(change.ln2);
      }
    }
  }
  return set;
}

function renderPatch(file) {
  const lines = [];
  for (const chunk of file.chunks ?? []) {
    lines.push(chunk.content); // e.g. @@ -1,5 +1,7 @@
    for (const change of chunk.changes ?? []) {
      const ln = change.ln ?? change.ln2 ?? "";
      const prefix = change.type === "add" ? "+" : change.type === "del" ? "-" : " ";
      lines.push(`${String(ln).padStart(5)} ${prefix}${change.content?.slice(1) ?? ""}`);
    }
  }
  return lines.join("\n");
}

function nearestValidLine(line, validLines) {
  if (typeof line !== "number" || !Number.isFinite(line)) return null;
  if (validLines.has(line)) return line;
  let best = null;
  let bestDist = Infinity;
  for (const v of validLines) {
    const d = Math.abs(v - line);
    if (d < bestDist) {
      bestDist = d;
      best = v;
    }
  }
  // Only snap if reasonably close, otherwise drop the comment.
  return bestDist <= 3 ? best : null;
}

function formatComment({ severity, issue, reason, suggested_fix, code_example }) {
  const label =
    severity === "critical" ? "🔴 **Critical**"
    : severity === "major" ? "🟠 **Major**"
    : severity === "minor" ? "🟡 **Minor**"
    : "🔵 **Suggestion**";

  const parts = [label, "", `**Issue:** ${issue}`];
  if (reason) parts.push("", `**Why it matters:** ${reason}`);
  if (suggested_fix) parts.push("", `**Suggested fix:** ${suggested_fix}`);
  if (code_example) {
    parts.push("", "```", code_example, "```");
  }
  parts.push("", `_via AI review (${AI_PROVIDER}/${model})_`);
  return parts.join("\n");
}

function buildSummary({ totalFiles, reviewedFiles, skippedTooLarge, aiErrors, severityCounts }) {
  const { critical = 0, major = 0, minor = 0, suggestion = 0 } = severityCounts;
  const total = critical + major + minor + suggestion;
  const hasBlockers = critical > 0 || major > 0;
  const quality = total === 0 ? "Excellent" : hasBlockers ? "Needs Improvement" : "Good";
  const verdict = total === 0
    ? "✅ Approve — no issues found"
    : hasBlockers
    ? "❌ Request changes — critical or major issues present"
    : "✅ Approve with suggestions";

  return [
    `## AI Code Review Summary`,
    "",
    `**Reviewer:** ${AI_PROVIDER}/${model}`,
    `**Overall quality:** ${quality}`,
    `**Verdict:** ${verdict}`,
    "",
    `| Severity | Count |`,
    `|---|---:|`,
    `| 🔴 Critical | ${critical} |`,
    `| 🟠 Major | ${major} |`,
    `| 🟡 Minor | ${minor} |`,
    `| 🔵 Suggestion | ${suggestion} |`,
    "",
    `- Files reviewed: **${reviewedFiles}** of ${totalFiles}`,
    skippedTooLarge ? `- Files skipped (patch too large): ${skippedTooLarge}` : null,
    aiErrors ? `- AI errors: ${aiErrors}` : null,
    "",
    "_Automated review — treat suggestions as hints, not gospel. The verdict above is advisory; the human reviewer makes the final call._",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildSystemPrompt(prContextBlock) {
  const projectRulesBlock = projectRules
    ? `\n\nProject-specific rules (apply these in addition to the general checks):\n${projectRules}`
    : "";
  const prBlock = prContextBlock ? `\n\n${prContextBlock}` : "";

  return (
    `You are a Senior Software Engineer and Code Reviewer. ` +
    `You review one file at a time from a unified diff and post structured inline comments.\n\n` +
    `Your responsibilities — flag only REAL problems in these categories:\n` +
    `1. Code quality: clean code, readability, naming consistency, duplicate logic, dead code, ` +
    `unused imports, unnecessary complexity, magic numbers/strings, SOLID, DRY, KISS.\n` +
    `2. Bugs: logic errors, edge cases, null/undefined handling, race conditions, async issues, ` +
    `missing error handling, state management problems, incorrect conditions, missing validations, ` +
    `potential runtime exceptions.\n` +
    `3. Performance: expensive loops, repeated API calls, inefficient algorithms, memory leaks, ` +
    `missing memoization, large object cloning, unoptimized database queries.\n` +
    `4. Security: injection vulnerabilities (SQL/command/etc), XSS, sensitive data exposure, ` +
    `authentication/authorization issues, unsafe API usage, hardcoded secrets.\n` +
    `5. Framework best practices, testing gaps, and missing documentation when clearly visible ` +
    `in the diff.\n\n` +
    `Severity scale (use EXACTLY these strings):\n` +
    `- "critical" — bugs, security flaws, data loss, crash risks\n` +
    `- "major"    — logic issues, real performance concerns, maintainability red flags\n` +
    `- "minor"    — naming, readability, small refactoring that materially helps\n` +
    `- "suggestion" — best-practice / alternative implementation / future improvement\n\n` +
    `STRICT RULES:\n` +
    `- Be objective. Do NOT invent issues. If the file looks fine, return an empty list.\n` +
    `- Only comment when there is a real, concrete problem.\n` +
    `- Do NOT comment on personal style, formatting handled by linters, or subjective preferences.\n` +
    `- Each comment must explain WHY it matters, not only WHAT is wrong.\n` +
    `- Prefer actionable suggestions; include a short corrected code snippet when useful.\n` +
    `- Avoid duplicate comments.\n` +
    `- Focus on correctness over style.\n` +
    `- Only target lines that were ADDED or are clearly visible in the patch.\n` +
    `- Write all comment text (issue, reason, suggested_fix) in ${REVIEW_LANGUAGE}. Keep code examples in their original language.` +
    prBlock +
    projectRulesBlock
  );
}

function buildPRContext(pr, reviewableFiles) {
  const title = (pr.title || "").trim();
  const bodyRaw = (pr.body || "").trim();
  // Truncate PR description so the prompt stays bounded.
  const body =
    bodyRaw.length > 1500 ? bodyRaw.slice(0, 1500) + "…(truncated)" : bodyRaw;
  const shown = reviewableFiles.slice(0, 30).map((f) => `- ${f.to}`).join("\n");
  const extra =
    reviewableFiles.length > 30 ? `\n…and ${reviewableFiles.length - 30} more` : "";
  return [
    "Pull Request context (use to understand the INTENT of these changes):",
    title ? `Title: ${title}` : null,
    body ? `Description:\n${body}` : null,
    `Files in this PR:\n${shown}${extra}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

async function reviewFile(filePath, patchText, systemPrompt) {
  const user =
    `Review this patch for file: ${filePath}\n\n` +
    "Each diff line is prefixed with its line number in the new file followed by `+` (added), `-` (removed), or ` ` (context).\n\n" +
    "Respond with STRICT JSON, no markdown fences, no prose, exactly this shape:\n" +
    `{\n` +
    `  "comments": [\n` +
    `    {\n` +
    `      "line": <int line number in new file>,\n` +
    `      "severity": "critical" | "major" | "minor" | "suggestion",\n` +
    `      "issue": "<one-sentence summary of the problem>",\n` +
    `      "reason": "<why this matters in this context>",\n` +
    `      "suggested_fix": "<concrete fix instruction>",\n` +
    `      "code_example": "<optional short corrected snippet, or empty string>"\n` +
    `    }\n` +
    `  ]\n` +
    `}\n\n` +
    `If there are no real issues, respond with: {"comments":[]}\n\n` +
    "Patch:\n```\n" +
    patchText +
    "\n```";

  const text = await provider.call({ system: systemPrompt, user });
  return parseAIComments(text);
}

const SEVERITY_ALIASES = {
  info: "suggestion",
  warning: "major",
  high: "critical",
  medium: "major",
  low: "minor",
  blocker: "critical",
  nit: "suggestion",
};

function normalizeSeverity(raw) {
  const v = String(raw ?? "").toLowerCase().trim();
  if (["critical", "major", "minor", "suggestion"].includes(v)) return v;
  return SEVERITY_ALIASES[v] || "suggestion";
}

function parseAIComments(text) {
  if (!text) return [];
  // Strip code fences if the model added them despite instructions.
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  let json;
  try {
    json = JSON.parse(cleaned);
  } catch {
    // Try to extract the first JSON object.
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return [];
    try {
      json = JSON.parse(match[0]);
    } catch {
      return [];
    }
  }
  const list = Array.isArray(json?.comments) ? json.comments : [];
  return list
    .map((c) => ({
      line: Number(c?.line),
      severity: normalizeSeverity(c?.severity),
      // Accept both new schema and legacy `body` field for resilience.
      issue: String(c?.issue ?? c?.title ?? c?.body ?? "").trim(),
      reason: String(c?.reason ?? c?.why ?? "").trim(),
      suggested_fix: String(c?.suggested_fix ?? c?.fix ?? c?.suggestion ?? "").trim(),
      code_example: String(c?.code_example ?? c?.example ?? c?.code ?? "").trim(),
    }))
    .filter((c) => c.issue && Number.isFinite(c.line));
}

async function callOpenAI({ system, user }) {
  const requestBody = {
    model,
    temperature: 0.2,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "code_review", strict: true, schema: OPENAI_JSON_SCHEMA },
    },
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${provider.key}`,
  };

  let res = await fetchWithRetry("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  // Older models reject json_schema; fall back to json_object mode once.
  if (res.status === 400 || res.status === 422) {
    log("OpenAI structured outputs not supported by this model; falling back to json_object.");
    requestBody.response_format = { type: "json_object" };
    res = await fetchWithRetry("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });
  }

  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function callAnthropic({ system, user }) {
  const res = await fetchWithRetry("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": provider.key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1500,
      temperature: 0.2,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const parts = data.content ?? [];
  return parts.map((p) => p.text ?? "").join("");
}

async function callGemini({ system, user }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(provider.key)}`;
  const res = await fetchWithRetry(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
}

// ---------------------------------------------------------------------------
// Helpers: retry, concurrency, skip-check, dedup, sticky comment, step summary
// ---------------------------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url, init, { retries = 3, baseDelayMs = 1000 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
        if (attempt === retries) return res;
        const retryAfter = parseInt(res.headers.get("retry-after") || "", 10);
        const delay =
          Number.isFinite(retryAfter) && retryAfter > 0
            ? retryAfter * 1000
            : Math.min(baseDelayMs * Math.pow(2, attempt), 30000);
        log(`HTTP ${res.status} on ${shortUrl(url)}; retrying in ${delay}ms (${attempt + 1}/${retries})`);
        await sleep(delay);
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt === retries) throw err;
      const delay = Math.min(baseDelayMs * Math.pow(2, attempt), 30000);
      log(`Network error on ${shortUrl(url)}: ${err.message}; retrying in ${delay}ms (${attempt + 1}/${retries})`);
      await sleep(delay);
    }
  }
  throw lastErr ?? new Error("fetchWithRetry exhausted retries");
}

function shortUrl(url) {
  try {
    const u = new URL(url);
    return `${u.host}${u.pathname}`;
  } catch {
    return String(url).slice(0, 80);
  }
}

async function pMap(items, concurrency, mapper) {
  const results = new Array(items.length);
  if (items.length === 0) return results;
  let idx = 0;
  const workerCount = Math.max(1, Math.min(concurrency, items.length));
  async function worker() {
    while (true) {
      const i = idx++;
      if (i >= items.length) return;
      results[i] = await mapper(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

function shouldSkipPR(pr) {
  const labels = (pr.labels || []).map((l) => String(l?.name || "").toLowerCase());
  const labelHit = SKIP_LABEL_NAMES.find((name) => labels.includes(name));
  if (labelHit) return `label "${labelHit}" present`;
  const haystack = `${pr.title || ""}\n${pr.body || ""}`;
  if (SKIP_KEYWORD_RE.test(haystack)) return "[skip ai-review] keyword in PR title/body";
  if (pr.draft) return "PR is a draft";
  return null;
}

async function upsertStickySummary(body) {
  const fullBody = `${BOT_MARKER}\n${body}`;
  try {
    const comments = await octokit.paginate(octokit.issues.listComments, {
      owner,
      repo,
      issue_number: prNumber,
      per_page: 100,
    });
    const existing = comments.find(
      (c) => c.user?.type === "Bot" && (c.body || "").includes(BOT_MARKER)
    );
    if (existing) {
      await octokit.issues.updateComment({
        owner,
        repo,
        comment_id: existing.id,
        body: fullBody,
      });
      log(`Updated sticky summary comment #${existing.id}`);
    } else {
      await octokit.issues.createComment({
        owner,
        repo,
        issue_number: prNumber,
        body: fullBody,
      });
      log("Created sticky summary comment");
    }
  } catch (err) {
    log(`Failed to upsert sticky summary: ${err.message}`);
  }
}

function normalizeBodyForKey(body) {
  return String(body || "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/_via AI review[^_]*_/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 240);
}

async function dedupInlineComments(newComments) {
  let existing = [];
  try {
    existing = await octokit.paginate(octokit.pulls.listReviewComments, {
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100,
    });
  } catch (err) {
    log(`Could not list existing review comments (${err.message}); skipping dedup.`);
    return { newComments, dedupedCount: 0 };
  }
  const existingKeys = new Set();
  for (const c of existing) {
    if (c.user?.type === "Bot" && (c.body || "").includes(BOT_MARKER)) {
      const line = c.line ?? c.original_line;
      existingKeys.add(`${c.path}:${line}:${normalizeBodyForKey(c.body)}`);
    }
  }
  const filtered = [];
  let deduped = 0;
  for (const c of newComments) {
    const key = `${c.path}:${c.line}:${normalizeBodyForKey(c.body)}`;
    if (existingKeys.has(key)) deduped++;
    else filtered.push(c);
  }
  return { newComments: filtered, dedupedCount: deduped };
}

async function writeStepSummary(body) {
  if (!GITHUB_STEP_SUMMARY) return;
  try {
    await fs.appendFile(GITHUB_STEP_SUMMARY, body + "\n");
  } catch (err) {
    log(`Failed to write GITHUB_STEP_SUMMARY: ${err.message}`);
  }
}

function log(msg) {
  console.log(`[ai-review] ${msg}`);
}

function fail(msg) {
  console.error(`[ai-review] ERROR: ${msg}`);
  process.exit(1);
}
