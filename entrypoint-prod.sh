#!/bin/sh

set -ex

pnpm install
npx prisma generate
npx prisma migrate deploy
node server.js
