# syntax=docker/dockerfile:1.7

# Multi-stage build optimized for production:
#   1. `build`     — installs ALL deps (incl. dev) and compiles TS → JS.
#   2. `prod-deps` — installs ONLY production deps in a separate stage so we
#                    can copy a minimal node_modules into the runtime image.
#   3. `runtime`   — slim Alpine image with only what's needed to run.

ARG NODE_VERSION=20-alpine
ARG PNPM_VERSION=9

# ---------- 1. build ----------
FROM node:${NODE_VERSION} AS build
ARG PNPM_VERSION
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

# Copy lockfile first to maximise cache reuse on source-only changes.
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

# ---------- 2. prod-deps ----------
FROM node:${NODE_VERSION} AS prod-deps
ARG PNPM_VERSION
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod

# ---------- 3. runtime ----------
FROM node:${NODE_VERSION} AS runtime
ENV NODE_ENV=production \
    PORT=2222 \
    HOST=0.0.0.0 \
    HOST_KEY_PATH=/data/keys/host_ed25519 \
    MAX_CONNECTIONS=50 \
    IDLE_TIMEOUT_MS=900000

# tini gives us a proper PID 1 that forwards signals (SIGTERM) for graceful
# shutdown when docker stops the container.
RUN apk add --no-cache tini \
    && addgroup -S app \
    && adduser -S app -G app \
    && mkdir -p /data/keys \
    && chown -R app:app /data

WORKDIR /app
COPY --from=prod-deps --chown=app:app /app/node_modules ./node_modules
COPY --from=build     --chown=app:app /app/dist          ./dist
COPY                  --chown=app:app package.json       ./

USER app
EXPOSE 2222
VOLUME ["/data/keys"]

# Cheap healthcheck: just open a TCP connection to the SSH port. SSH servers
# answer the banner immediately, so a successful connect is enough.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('net').connect(process.env.PORT||2222,'127.0.0.1').on('connect',s=>{s.end();process.exit(0)}).on('error',()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/server.js"]
