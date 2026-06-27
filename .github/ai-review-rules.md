# AI Review — Project-Specific Rules

These rules are appended to the system prompt on every Pull Request. The general
checks (bugs, security, performance, …) always run; this file layers the
project's stack and conventions on top.

Edit freely — read fresh from the PR head on every run. Empty the file to disable.

**Stack:** Node.js 20 (ESM) · Express 4 · TypeScript 5 (strict) · Vitest · Docker · GitHub Actions.

---

## How to apply these rules

- Inspect **every added / changed line** against the categories below — look harder before concluding a file is clean.
- Still obey the global rules: **only report REAL, concrete problems**. An empty list is correct when the diff genuinely has no issues. Do **not** invent findings just to fill a category.
- Prefer one precise comment over several vague ones. Always explain **why** it matters.

## Required check categories

### 1. Security (OWASP Top 10)
- Untrusted input reaching shell/exec, file paths (path traversal), or HTML output (XSS) without validation/encoding.
- Hardcoded secrets, tokens, or credentials; secrets logged to console.
- Missing input validation at trust boundaries (HTTP body/query/params, env vars, external API responses).
- Sending HTML built from user input via `res.send` without escaping.

### 2. Express
- Async route handlers that can throw but don't forward errors (missing `next(err)` or a wrapper) → unhandled rejection.
- Response sent twice / writing after headers already sent.
- Missing centralized error-handling middleware, or middleware ordering bugs.
- Sensitive routes without input size limits / rate limiting.
- Reading `req.body` without `express.json()` size limits (DoS via large payloads).

### 3. Type safety (TypeScript strict)
- Use of `any` / unsafe `as` casts where a real type or generic is feasible.
- Accessing possibly-`undefined`/`null` properties without a guard (`?.`, narrowing).
- Non-null assertions (`!`) hiding a real nullability bug.
- Public function signatures without explicit return types when the inferred type is unclear.

### 4. Async / await
- Floating promises (a promise not awaited and not `.catch()`-ed).
- Missing `await` before using an async result.
- `await` inside a loop where `Promise.all` is correct (and safe) — flag only when it materially matters.
- Mixing callbacks and promises in a way that swallows errors.

### 5. Error handling
- `try/catch` that swallows the error (empty catch, or catch that only logs and continues into a bad state).
- Throwing non-`Error` values; losing the original stack/cause.
- No cleanup of resources (timers, listeners, file/stream handles) on the error path.

### 6. Code quality
- Dead code, unused imports/vars, leftover `console.log`/debug statements.
- Magic numbers / strings that should be named constants.
- Duplicated logic that should be extracted; overly complex conditionals.
- Functions doing too much (mixed responsibilities) — flag when it hurts readability/testing.

### 7. Tests (`*.test.ts`)
- New behavior without a corresponding test, or tests with weak/trivially-passing assertions.
- Missing edge cases (empty input, error path, boundary values).
- Order- or timing-dependent (flaky) tests; unawaited async assertions.

### 8. Config / CI / Docker (`*.yml`, `Dockerfile`, `.github/workflows/**`)
- Shell injection via `${{ github.* }}` interpolated directly into `run:` — require passing through `env:` vars.
- Over-broad workflow `permissions`; unpinned third-party actions; `:latest` or unpinned base images.
- Secrets echoed to logs; build steps that break reproducibility.

## Project conventions

- ESM only (`import`/`export`, `.js` extension in relative imports). Flag CommonJS (`require`) in `src/`.
- Server must bind `HOST = '0.0.0.0'` and `PORT` from env for containers — flag hardcoded `localhost`.
- Keep route handlers thin; push logic into separate functions/modules so it's unit-testable.
- Prefer small, pure functions; avoid hidden global state.

## Tips for maintaining this file

- Keep it concrete: phrase rules as **what to flag**, not abstract philosophy.
- Bad: "Write clean code." Good: "Flag functions longer than 50 lines or with cyclomatic complexity > 10."
- When the bot repeatedly misses a class of bug, add a bullet here — this is how *you* teach it (the model does not learn on its own between runs).
