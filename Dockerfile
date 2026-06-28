# syntax=docker/dockerfile:1.7

# ---- deps stage: install all deps (including dev) for building -----
# Pinned to the native build platform: tsc output is arch-independent,
# so compiling under QEMU emulation (arm64) is wasteful and can OOM/crash.
FROM --platform=$BUILDPLATFORM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ---- build stage: compile TypeScript -----------------------------
# Runs natively on the build host (no QEMU) so tsc never runs under emulation.
FROM --platform=$BUILDPLATFORM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# package.json is required so `npm run build` can resolve the "build" script;
# without it npm exits with ENOENT (exit code 254).
COPY package.json package-lock.json* ./
COPY tsconfig*.json ./
COPY src ./src
RUN npm run build

# ---- prod-deps stage: install only production deps ---------------
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# ---- runner stage: minimal runtime image -------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# wget is used by HEALTHCHECK; alpine has it built-in via busybox.
RUN addgroup -S app && adduser -S app -G app

COPY --from=prod-deps --chown=app:app /app/node_modules ./node_modules
COPY --from=build     --chown=app:app /app/dist          ./dist
COPY --chown=app:app  public                             ./public
COPY --chown=app:app  package.json                       ./

USER app
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/health" >/dev/null || exit 1

CMD ["node", "dist/index.js"]
