# Auto-Review

Repo này gồm **2 phần độc lập** có thể dùng riêng:

### A. Auto code-review trên Pull Request

| Workflow | Mục đích | Trigger |
|---|---|---|
| `ai-review.yml` | AI (OpenAI / Claude / Gemini) đọc diff và post inline comment | PR opened/synchronize/reopened/labeled |
| `codeql.yml` | GitHub CodeQL — phân tích bảo mật & chất lượng | PR + push branch chính + lịch hàng tuần |
| `semgrep.yml` | Semgrep — quét OWASP Top 10, secrets, security-audit | PR + push branch chính |

### B. CI/CD pipeline cho Node.js + TypeScript API

| Workflow | Mục đích | Trigger |
|---|---|---|
| `ci.yml` | Lint / Format / Typecheck / Test+coverage / Build | PR + push main |
| `docker-publish.yml` | Build Docker image multi-arch (amd64+arm64) & push lên **GHCR** | push main, tag `v*.*.*` |
| `deploy.yml` | `flyctl deploy` image GHCR lên **Fly.io** | sau khi `docker-publish` thành công, hoặc manual |
| `pages.yml` | Deploy `docs/` lên **GitHub Pages** | thay đổi trong `docs/` |

## 1. Cài đặt nhanh

```bash
# Đẩy thư mục này thành 1 repo trên GitHub
git init
git add .
git commit -m "chore: add auto-review workflows"
git branch -M main
git remote add origin https://github.com/<USER>/<REPO>.git
git push -u origin main
```

Mở **Settings → Actions → General**, bật:
- Allow GitHub Actions to create and approve pull requests (nếu muốn)
- Workflow permissions: **Read and write permissions**

Mở **Settings → Code security** → bật **Code scanning** (cần cho CodeQL/Semgrep upload SARIF).

## 2. Cấu hình AI provider

Chọn **một** provider và thêm secret tương ứng ở **Settings → Secrets and variables → Actions → New repository secret**:

| Provider | Secret | Default model |
|---|---|---|
| OpenAI (mặc định) | `OPENAI_API_KEY` | `gpt-4o-mini` |
| Anthropic Claude | `ANTHROPIC_API_KEY` | `claude-3-5-haiku-latest` |
| Google Gemini | `GEMINI_API_KEY` | `gemini-1.5-flash` |

Đổi provider bằng cách thêm **Variable** (không phải secret):

| Variable | Giá trị | Ý nghĩa |
|---|---|---|
| `AI_PROVIDER` | `openai` / `anthropic` / `gemini` | Provider sử dụng |
| `AI_MODEL` | vd: `gpt-4o`, `claude-sonnet-4-20250514`, `gemini-2.0-flash` | Override model mặc định |
| `AI_REVIEW_MAX_FILES` | `25` | Số file tối đa review mỗi PR |
| `AI_REVIEW_MAX_PATCH_CHARS` | `12000` | Patch lớn hơn ngưỡng này sẽ bị skip |
| `AI_REVIEW_LANGUAGE` | `English` / `Vietnamese` / ... | Ngôn ngữ comment |
| `AI_REVIEW_PROJECT_RULES` | Free text | Rules ngắn bổ sung vào prompt (xem bên dưới cho file dài) |
| `AI_REVIEW_CONCURRENCY` | `4` | Số file review song song (1–10) |
| `AI_REVIEW_SKIP_LABELS` | `skip-ai-review,no-ai-review` | Tên label để opt-out, phân cách bằng dấu phẩy |

### Project-specific rules

Có 2 cách đưa quy ước dự án vào AI reviewer:

1. **File** (ưu tiên) `—` tạo [.github/ai-review-rules.md](.github/ai-review-rules.md) trong repo. Script sẽ đọc file này từ PR head và append vào system prompt.
2. **Variable** `—` set `AI_REVIEW_PROJECT_RULES` cho các rule ngắn (vd: "Use Signals in Angular, no `any`"). Nếu cả hai đều tồn tại, file thắng.

File mẫu có sẵn trong repo là phần Angular 19+/TypeScript. Xoá hoặc sửa tùy ngôn ngữ / framework của bạn.

### Severity scale

AI trả về 4 mức, mỗi comment có **Issue / Why it matters / Suggested fix / Code example**:

| Severity | Dùng cho |
|---|---|
| 🔴 Critical | Bug, security flaw, data loss, crash |
| 🟠 Major | Logic issue, performance, maintainability red flag |
| 🟡 Minor | Naming, readability, refactor nhỏ có giá trị |
| 🔵 Suggestion | Best practice, alternative, improvement tương lai |

Cuối review sẽ có một **summary** gồm bảng đếm theo severity, đánh giá chất lượng tổng thể (Excellent / Good / Needs Improvement) và verdict (Approve / Request changes — advisory cho human reviewer).

### Hành vi (behavior chuẩn professional)

- **Sticky summary** — chỉ có **một** PR comment chứa summary, update tại chỗ mỗi lần push. Không spam timeline.
- **Inline dedup** — mỗi lần run chỉ post inline comment **mới**; comment cũ có cùng `path:line:body` sẽ bị skip.
- **Skip mechanism** — 3 cách opt-out:
  - Thêm label `skip-ai-review` hoặc `no-ai-review` (cấu hình qua `AI_REVIEW_SKIP_LABELS`).
  - Thêm `[skip ai-review]` hoặc `[no ai-review]` vào PR title hoặc body.
  - PR ở trạng thái **draft** (tự động skip).
- **PR context** — AI nhận được PR title + description + danh sách file để hiểu **intent**, không chỉ review từng file rời rạc.
- **Parallel + retry** — review nhiều file song song (default 4); retry exponential backoff cho 429/5xx từ AI provider.
- **GitHub Step Summary** — summary hiện luôn trong tab **Actions** → workflow run, không cần mở PR.
- **OpenAI Structured Outputs** — dùng JSON schema strict với OpenAI để gần như loại bỏ lỗi parse.

## 3. Tùy chỉnh CodeQL

File [codeql.yml](.github/workflows/codeql.yml) đang scan `javascript-typescript`. Thêm ngôn ngữ khác trong `matrix.language`:

```yaml
language: ['javascript-typescript', 'python', 'go', 'java-kotlin']
```

Danh sách hỗ trợ: `c-cpp`, `csharp`, `go`, `java-kotlin`, `javascript-typescript`, `python`, `ruby`, `swift`.

## 4. Tùy chỉnh Semgrep

Tập rule mặc định: `p/default`, `p/security-audit`, `p/secrets`, `p/owasp-top-ten`. Sửa trong [semgrep.yml](.github/workflows/semgrep.yml) → biến `SEMGREP_RULES`.

Connect với Semgrep AppSec Platform (optional): thêm secret `SEMGREP_APP_TOKEN`.

## 5. Cấu trúc

```
.github/
├── ai-review-rules.md      # Project-specific rules (optional, edit/delete tự do)
├── scripts/
│   ├── ai-review.mjs       # Logic AI review (Node.js 20, ESM)
│   └── package.json        # Deps: @octokit/rest, parse-diff
└── workflows/
    ├── ai-review.yml       # Trigger AI review trên PR
    ├── codeql.yml          # CodeQL analysis
    └── semgrep.yml         # Semgrep scan
```

## 6. Cách hoạt động (AI review)

1. PR mở/cập nhật → workflow chạy. Skip luôn nếu PR là draft, có skip label, hoặc có `[skip ai-review]` trong title/body.
2. Script kéo **unified diff** + **PR metadata** (title, body, file list) qua GitHub API.
3. Lọc file rác (lock files, `node_modules`, binary, sourcemap, snapshot, ...).
4. Đọc project rules từ [.github/ai-review-rules.md](.github/ai-review-rules.md) (nếu có) và build system prompt **một lần** (không lặp lại token).
5. Review các file song song (concurrency limit, default 4) với retry/backoff cho lỗi 429/5xx.
6. Mỗi file → gửi patch + line numbers tới AI. OpenAI dùng JSON schema strict, Anthropic/Gemini dùng JSON mode.
7. Map line về đúng vị trí trong diff hunk.
8. **Upsert sticky summary comment** trên PR (1 comment duy nhất, update tại chỗ).
9. **Dedup inline comments** — chỉ post những comment chưa từng xuất hiện ở lần run trước.
10. Ghi summary vào `$GITHUB_STEP_SUMMARY` để hiển thị trong tab Actions.

## 7. Chạy thử local (optional)

```bash
cd .github/scripts
npm install
GITHUB_TOKEN=ghp_xxx \
GITHUB_REPOSITORY=owner/repo \
PR_NUMBER=1 \
AI_PROVIDER=openai \
OPENAI_API_KEY=sk-xxx \
node ai-review.mjs
```

## 8. Chi phí ước tính (AI review)

| Model | ~Chi phí mỗi PR nhỏ (5 file) |
|---|---|
| `gpt-4o-mini` | < $0.01 |
| `claude-3-5-haiku` | < $0.01 |
| `gemini-1.5-flash` | gần như miễn phí (có free tier) |
| `gpt-4o` / `claude-sonnet-4` | $0.05–$0.20 |

Đặt `AI_REVIEW_MAX_FILES` thấp để giới hạn chi phí trên PR lớn.

## 9. Troubleshooting

- **Workflow không tạo được comment**: kiểm tra Settings → Actions → Workflow permissions = Read and write.
- **AI trả về rỗng**: tăng `AI_REVIEW_MAX_PATCH_CHARS`, hoặc dùng model mạnh hơn qua `AI_MODEL`.
- **CodeQL fail ở Autobuild**: nếu project không build được tự động, đổi sang `build-mode: none` (chỉ áp dụng JS/TS/Python/Ruby).
- **Semgrep báo lỗi SARIF upload**: cần bật Code scanning trong Settings → Code security.

---

# CI/CD Pipeline (Phần B)

Mục này dành cho phần B — pipeline cho Node.js + TypeScript API. Có thể bỏ qua nếu chỉ dùng auto-review.

## 10. Cấu trúc project

```
.
├── src/
│   ├── app.ts                  # Express app factory
│   ├── index.ts                # Entry point (listen + graceful shutdown)
│   └── routes/
│       ├── health.ts           # GET /health
│       └── health.test.ts      # Vitest sample
├── docs/
│   └── index.html              # Landing page deploy lên GitHub Pages
├── Dockerfile                  # Multi-stage build (deps → build → prod-deps → runner)
├── .dockerignore
├── fly.toml                    # Fly.io app config
├── eslint.config.js            # ESLint 9 flat config
├── .prettierrc.json
├── .prettierignore
├── tsconfig.json               # Dev/typecheck
├── tsconfig.build.json         # Build (exclude tests)
├── vitest.config.ts            # 70% coverage threshold mặc định
└── package.json
```

## 11. Setup local

```bash
npm install        # tạo package-lock.json (commit lock này)
npm run dev        # tsx watch -> auto-reload trên file change
npm test           # vitest run
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
npm run format     # prettier --write .
npm run build      # tsc -> dist/
npm start          # node dist/index.js
```

API mẫu: `GET http://localhost:3000/health` → `{ status: "ok", uptime, timestamp }`.

## 12. Workflows chi tiết

### `ci.yml` — Continuous Integration

Chạy trên mọi PR + push `main`. Steps theo thứ tự: install → lint → format-check → typecheck → test+coverage → build. Coverage và build artifact được upload (giữ 14 / 7 ngày).

Nếu fail bất kỳ step nào → PR bị block (kết hợp branch protection).

### `docker-publish.yml` — Build & push image

Trigger: push `main` hoặc tag `v*.*.*`. Build multi-stage Dockerfile **multi-arch (amd64 + arm64)**, push lên **GHCR** (`ghcr.io/<owner>/<repo>`). Tags tự động:

- `main` (theo branch)
- `latest` (chỉ branch main)
- `v1.2.3`, `1.2`, `1` (theo semver tag)
- `sha-abc1234` (short SHA — dùng để rollback chính xác)

Có SBOM + provenance để supply-chain security (SLSA L2).

### `deploy.yml` — Fly.io deploy

Trigger:
- Tự động sau khi `docker-publish` thành công trên `main`.
- Manual qua **Actions → Deploy (Fly.io) → Run workflow** (có thể chọn image tag để **rollback**).

Workflow chạy `flyctl deploy --image ghcr.io/<owner>/<repo>:<tag>` — Fly pull image đã build sẵn từ GHCR, không rebuild. Strategy `rolling` — zero-downtime deploy. Health check `/health` tự chạy theo cấu hình trong [fly.toml](fly.toml).

Dùng GitHub **Environment** `production` — có thể bật **required reviewers** ở Settings → Environments để phải approve mới deploy.

### `pages.yml` — GitHub Pages

Trigger khi `docs/**` thay đổi. Deploy nguyên thư mục `docs/` (static HTML, không Jekyll). Bật Pages tại **Settings → Pages → Source: GitHub Actions**.

## 13. Setup Fly.io & Secrets

### 13.1. Setup Fly.io (làm 1 lần)

```bash
# 1. Cài flyctl trên máy local
curl -L https://fly.io/install.sh | sh
# Windows: iwr https://fly.io/install.ps1 -useb | iex

# 2. Đăng ký / đăng nhập Fly.io (browser mở tự động)
flyctl auth signup     # hoặc: flyctl auth login

# 3. Tạo app (tên phải unique toàn cầu)
flyctl apps create my-cool-api-xyz123

# 4. Sửa dòng `app = "..."` trong fly.toml cho khớp tên vừa tạo

# 5. Tạo deploy token để CI dùng (không hết hạn)
flyctl tokens create deploy --expiry 999999h
# Copy chuỗi token (bắt đầu bằng `FlyV1 fm2_...`)
```

### 13.2. Public GHCR image (bắt buộc cho Fly pull)

Lần đầu push code lên main → `docker-publish` tạo package mới trên GHCR. Mặc định package là **private**, Fly sẽ không pull được.

Lên GitHub → **trang repo → Packages** (sidebar) → click vào package → **Package settings** → cuối trang **Change visibility** → **Public**.

_(Nếu muốn giữ image private, cần setup Fly registry auth phurc tạp hơn — ping mình nếu cần)_.

### 13.3. Secrets & Variables trên GitHub

**Settings → Secrets and variables → Actions:**

#### Secrets
| Tên | Giá trị |
|---|---|
| `FLY_API_TOKEN` | Deploy token vừa tạo bằng `flyctl tokens create deploy` |

#### Variables
| Tên | Giá trị |
|---|---|
| `PRODUCTION_URL` | `https://<app-name>.fly.dev` |

### 13.4. Fly.io environment variables (nếu app cần)

Không để trong `fly.toml [env]` vì sẽ bị commit vào repo. Dùng:

```bash
flyctl secrets set DATABASE_URL="postgres://..." JWT_SECRET="xxx"
```

## 14. Quy trình release điển hình

```bash
# 1. Feature branch -> PR -> CI xanh -> merge main
git switch -c feat/new-thing
# ... code ...
git push origin feat/new-thing
# Open PR, đợi CI + AI review xanh, merge.

# 2. Tự động: docker-publish chạy, push image latest + sha-xxx -> deploy.yml gọi flyctl deploy

# 3. Release semver
git tag v1.0.0
git push origin v1.0.0
# docker-publish tag image v1.0.0, 1.0, 1, latest. deploy chạy.

# 4. Rollback nếu cần
# Actions -> Deploy (Fly.io) -> Run workflow -> image_tag = sha-abc1234 (commit cũ)
```

## 15. Bật branch protection (recommended)

**Settings → Branches → Add rule cho `main`:**
- ✅ Require a pull request before merging
- ✅ Require status checks to pass: chọn `CI / Lint / Typecheck / Test / Build` (và `CodeQL`, `Semgrep` nếu muốn)
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging

## 16. Troubleshooting CI/CD

- **`npm ci` fail "lock file out of sync"**: chạy `npm install` local rồi commit `package-lock.json` mới.
- **Format check fail**: chạy `npm run format` local trước khi push.
- **Docker push 403/denied**: vào **Settings → Actions → General → Workflow permissions = Read and write**. Lần đầu push xong, vào **Packages → repo package → Package settings → Manage Actions access** để link package với repo.
- **Fly deploy: `pull access denied`**: GHCR package đang **private**. Vào package settings → Change visibility → Public.
- **Fly deploy: `app not found`**: tên `app` trong [fly.toml](fly.toml) chưa được `flyctl apps create`, hoặc thuộc account khác.
- **Fly deploy: `Could not find App`**: `FLY_API_TOKEN` thảy không đúng account / app. Tạo lại token bằng `flyctl tokens create deploy` từ account chủ app.
- **Pages 404**: vào **Settings → Pages → Source = GitHub Actions** (không phải branch).
- **App ngủ sau idle (cold start)**: `auto_stop_machines = "stop"` trong `fly.toml` đang on để tiết kiệm free tier. Đổi sang `"off"` và set `min_machines_running = 1` nếu không muốn cold start (sẽ tốn free hours nhanh hơn).
- **Cần thay region / scale up**: `flyctl regions set sin nrt` / `flyctl scale memory 512`.
