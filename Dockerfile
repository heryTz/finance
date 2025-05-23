FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# Remove when this issue is resolved: https://github.com/nodejs/corepack/issues/616#issuecomment-2622079955
RUN npm install -g corepack@latest

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i

FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD [ "sh", "entrypoint-dev.sh" ]

FROM base AS builder
ARG BUILD_ID=unknow
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN BUILD_ID=$BUILD_ID pnpm build

FROM base AS prod
RUN apk add --no-cache openssl
WORKDIR /app
COPY prisma ./
COPY --from=builder /app/entrypoint-prod.sh ./entrypoint-prod.sh
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD [ "sh", "entrypoint-prod.sh" ]
