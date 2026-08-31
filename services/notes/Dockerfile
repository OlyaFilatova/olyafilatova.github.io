# ---------- Build ----------
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/notes/package.json services/notes/package.json
COPY packages/db packages/db

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @olyafilatova.github.io/notes build

RUN pnpm deploy \
    --filter @olyafilatova.github.io/notes \
    --prod \
    /out


# ---------- Runtime ----------
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /out ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
