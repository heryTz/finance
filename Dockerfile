FROM node:20-alpine AS base

FROM base as deps
WORKDIR /app
RUN npm i -g pnpm   
COPY package.json pnpm-lock.yaml ./
RUN pnpm i

FROM base as dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD [ "sh", "entrypoint-dev.sh" ]

FROM base as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env.production.local .env.local
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build

FROM base as prod
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env.local ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENV HOSTNAME "0.0.0.0"
CMD [ "node", "server.js" ]
