#!/bin/sh

set -ex

npx prisma migrate deploy
node server.js
