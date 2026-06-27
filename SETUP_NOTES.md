# Fly.io Setup Notes

Ghi lại toàn bộ quá trình setup Fly.io làm deploy target cho repo này, các issue đã gặp và cách fix. Dùng làm runbook khi cần làm lại / debug / onboard người mới.

---

## Mục tiêu

Deploy Node.js + TypeScript API lên Fly.io qua GitHub Actions, với image build sẵn trên GHCR (`ghcr.io/<owner>/<repo>:<tag>`).

```
Push main
  → CI (lint/test/build)
  → Docker Publish (multi-arch amd64+arm64, push GHCR)
  → Deploy (Fly.io)   ← flyctl deploy --image ghcr.io/...
```

## Issue gặp phải & cách fix

### 1. URL install flyctl trả 404

```bash
$ curl -L https://fly.io/install.sh | sh
# In ra HTML 404 page rồi sh fail
```

**Nguyên nhân**: endpoint `fly.io/install.sh` của Fly bị lỗi (tạm thời hoặc đã đổi).

**Fix**: tải trực tiếp từ GitHub release. Nhưng KHÔNG dùng URL `/latest/download/<file>` được vì filename có version trong tên:

```bash
# ❌ Cái này 404 vì filename thực sự là `flyctl_<version>_Windows_x86_64.zip`
curl -fL https://github.com/superfly/flyctl/releases/latest/download/flyctl_Windows_x86_64.zip

# ✅ Resolve URL động qua GitHub API
URL=$(curl -s https://api.github.com/repos/superfly/flyctl/releases/latest \
  | grep "browser_download_url.*Windows_x86_64.zip" \
  | head -1 \
  | cut -d '"' -f 4)
mkdir -p ~/bin
curl -fL -o /tmp/flyctl.zip "$URL"
unzip -o /tmp/flyctl.zip -d ~/bin/
chmod +x ~/bin/flyctl.exe
```

Thêm vào PATH cho persistent:

```bash
grep -q 'HOME/bin' ~/.bashrc 2>/dev/null \
  || echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
export PATH="$HOME/bin:$PATH"
```

Verify:

```bash
flyctl version
# flyctl.exe v0.4.61 windows/amd64 ...
```

> Đổi `Windows_x86_64` thành `Linux_x86_64.tar.gz` hoặc `macOS_x86_64.tar.gz` nếu OS khác.

### 2. Fly dashboard chỉ show "Deploy from GitHub repository"

UI mới của Fly ép launch app qua GitHub integration (sẽ tạo workflow `.github/workflows/fly-deploy.yml` xung đột với workflow của repo).

**Fix**: bỏ qua dashboard, dùng CLI:

```bash
flyctl apps create <unique-name>
```

### 3. Account bị flag "high risk"

```
Error: Your account has been marked as high risk.
Please go to https://fly.io/high-risk-unlock to verify your account.
```

Phổ biến với account mới từ VN. **Fix**:

1. Vào https://fly.io/high-risk-unlock
2. Thêm/verify credit card (thường auto-unlock trong vài phút sau khi card được verify)
3. Nếu chưa unlock: submit form (giải thích use case ngắn gọn, có thể bị bắt upload ID) → đợi reply 24–48h

Verify unlocked:

```bash
flyctl apps list
# Nếu return được list (empty hoặc có app) → đã unlock
# Nếu return high-risk error → chưa unlock
```

### 4. `flyctl tokens create` báo "Could not find App"

```
Error: failed retrieving app CHANGE-ME-auto-review-api:
Could not find App "CHANGE-ME-auto-review-api"
```

**Nguyên nhân**: `flyctl tokens create deploy` đọc tên app từ `fly.toml` để scope token. Tên `CHANGE-ME-auto-review-api` là placeholder mặc định, chưa đổi.

**Fix**: tạo app **trước**, rồi sửa `fly.toml` cho khớp, rồi mới tạo token:

```bash
flyctl apps create my-cool-api-xyz123       # tên unique toàn cầu
# Sửa dòng `app = "..."` trong fly.toml -> "my-cool-api-xyz123"
flyctl tokens create deploy --expiry 87600h  # ~10 năm
```

### 5. GHCR image private → Fly không pull được

Lần đầu push code, GHCR tạo package mặc định **private**. Fly sẽ fail deploy với:

```
pull access denied for ghcr.io/<owner>/<repo>
```

**Fix**: vào repo GitHub → **Packages** (sidebar) → click package → **Package settings** → Danger Zone → **Change visibility → Public** → re-run failed deploy workflow.

> Nếu cần giữ image private, phải config Fly registry auth — phức tạp hơn, không khuyến nghị cho personal project.

## Final working steps (no errors)

Sau khi qua hết các issue trên, đây là quy trình clean từ đầu:

### 0. Prerequisites
- Node.js 20+, npm
- Git, GitHub account
- Repo đã push lên GitHub với CI/CD workflows
- Account Fly.io đã unlock high-risk (xem issue #3)

### 1. Install flyctl

```bash
mkdir -p ~/bin
URL=$(curl -s https://api.github.com/repos/superfly/flyctl/releases/latest \
  | grep "browser_download_url.*Windows_x86_64.zip" \
  | head -1 | cut -d '"' -f 4)
curl -fL -o /tmp/flyctl.zip "$URL"
unzip -o /tmp/flyctl.zip -d ~/bin/
grep -q 'HOME/bin' ~/.bashrc 2>/dev/null \
  || echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
export PATH="$HOME/bin:$PATH"
flyctl version
```

### 2. Sign in

```bash
flyctl auth signup   # account mới, browser tự mở
# hoặc
flyctl auth login    # account đã có
```

### 3. Tạo app + token

```bash
flyctl apps create my-cool-api-xyz123
# Sửa fly.toml: app = "my-cool-api-xyz123"
flyctl tokens create deploy --expiry 87600h
# Copy toàn bộ chuỗi "FlyV1 fm2_..." (gồm cả phần thứ 2 sau dấu phẩy)
```

### 4. GitHub Secrets / Variables

Repo → **Settings → Secrets and variables → Actions**:

| Type | Name | Value |
|---|---|---|
| Secret | `FLY_API_TOKEN` | Chuỗi token bước 3 |
| Variable | `PRODUCTION_URL` | `https://my-cool-api-xyz123.fly.dev` |

### 5. Push code

```bash
git add fly.toml
git commit -m "feat: configure Fly.io deploy target"
git push origin main
```

### 6. Public hóa GHCR package

Đợi `Docker Publish` workflow chạy xong lần đầu, rồi:

Repo → Packages (sidebar) → click package → Package settings → **Change visibility → Public**.

### 7. Re-run deploy & verify

Actions → click run `Deploy (Fly.io)` bị fail (nếu có) → **Re-run all jobs**.

```bash
curl https://my-cool-api-xyz123.fly.dev/health
# {"status":"ok","uptime":..,"timestamp":".."}
```

## Lệnh flyctl hữu ích sau khi deploy

```bash
# Quan sát app
flyctl status                        # trạng thái app + machines
flyctl logs                          # stream log realtime
flyctl logs --no-tail                # log không follow
flyctl machine list                  # list machines + region
flyctl apps open                     # mở app URL trong browser

# Scale & config
flyctl scale show                    # xem scale hiện tại
flyctl scale memory 512              # đổi RAM (>256 sẽ vượt free tier)
flyctl scale count 2                 # tăng số machines
flyctl regions list                  # region đang chạy
flyctl regions add nrt sjc           # thêm region

# Secrets (env vars runtime, không commit fly.toml)
flyctl secrets list
flyctl secrets set DATABASE_URL="postgres://..."
flyctl secrets unset DATABASE_URL

# Tokens & security
flyctl tokens list                   # xem token đang dùng
flyctl tokens revoke <id>            # revoke khi cần
flyctl tokens create deploy --expiry 87600h   # tạo token mới

# Deploy / rollback thủ công
flyctl deploy --image ghcr.io/<owner>/<repo>:sha-abc1234   # deploy 1 tag cụ thể
flyctl releases                      # list các release
flyctl releases rollback             # quay về release trước
```

## Troubleshooting cheat sheet

| Triệu chứng | Nguyên nhân thường gặp | Fix |
|---|---|---|
| `pull access denied for ghcr.io/...` | Package GHCR đang private | Public hóa package (issue #5) |
| `Could not find App "..."` | `fly.toml` tên app sai hoặc app chưa được tạo | `flyctl apps list` → sửa `fly.toml` |
| `high risk` | Account mới chưa verify | Visit https://fly.io/high-risk-unlock |
| Workflow `Deploy (Fly.io)` không chạy | `Docker Publish` chưa xanh trên main | Đợi/rerun docker-publish trước |
| App ngủ sau 15 min, request đầu chậm | `auto_stop_machines = "stop"` để save free tier | Đổi sang `"off"` + `min_machines_running = 1` trong fly.toml (tốn free hours nhanh hơn) |
| Memory không đủ | Free tier 256MB | `flyctl scale memory 512` (sẽ tính phí phần vượt) |
| Deploy thành công nhưng `/health` timeout | App không listen trên port `3000` hoặc `0.0.0.0` | Check `src/index.ts` dùng `HOST = '0.0.0.0'` chứ không phải `localhost` |

## Links

- Fly.io dashboard: https://fly.io/dashboard
- Fly tokens: https://fly.io/user/personal_access_tokens
- flyctl releases: https://github.com/superfly/flyctl/releases
- Fly docs: https://fly.io/docs/
- High-risk unlock: https://fly.io/high-risk-unlock
- GHCR packages của repo: `https://github.com/<owner>/<repo>/packages`
