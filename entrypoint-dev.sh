#!/bin/sh

set -ex

npx prisma generate
npx prisma db push
yarn dev
