#!/bin/bash

set -ex

docker compose up -d

echo '🟡 - Waiting for database to be ready...'
./wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Database is ready!'

pnpm test
