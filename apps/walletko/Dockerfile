# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter walletko...
RUN pnpm --filter walletko build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ARG APP_VERSION
ARG APP_RELEASE_DATE
ENV APP_VERSION=$APP_VERSION
ENV APP_RELEASE_DATE=$APP_RELEASE_DATE
COPY --from=build /app/apps/walletko/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
