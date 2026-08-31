# ---------- Build ----------
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/_notes_gateway/package.json services/_notes_gateway/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @olyafilatova.github.io/notes-api-gateway build

RUN pnpm deploy \
    --filter @olyafilatova.github.io/notes-api-gateway \
    --prod \
    /out


# ---------- Runtime ----------
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /out ./

EXPOSE 3000

CMD ["node", "dist/main.js"]