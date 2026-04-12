#!/bin/sh

set -ex

npx prisma@5 generate
npx prisma@5 migrate deploy
yarn dev
