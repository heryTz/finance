#!/bin/sh

set -ex

npx prisma@5 migrate deploy
node server.js
