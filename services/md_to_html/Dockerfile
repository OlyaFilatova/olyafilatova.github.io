# ---------- Build ----------
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/md_to_html/package.json services/md_to_html/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @olyafilatova.github.io/markdown-to-html build

RUN pnpm deploy \
    --filter @olyafilatova.github.io/markdown-to-html \
    --prod \
    /out


# ---------- Runtime ----------
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /out ./

EXPOSE 3000

CMD ["node", "dist/main.js"]