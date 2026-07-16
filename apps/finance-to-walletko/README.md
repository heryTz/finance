# finance-to-walletko

Idempotent one-shot migration of legacy **finance** data into **walletko**.

Finance no longer lives in this repository — it is hosted at
<https://github.com/heryTz/finance>. This app talks to the finance database
directly over a connection string, so it needs no finance source code; only a
reachable finance database.

Maps finance users, tags, and operations into walletko users, tags,
transactions, and pot/expense allocations. Each user gets one default pot
(100%) that receives every operation:

- `revenue` operation → `income` transaction + `pot_allocations` row
- `depense` operation → `expense` transaction + `expense_allocations` row

Finance IDs are preserved for users, tags, and transactions; default pots and
allocations are given fresh cuid2 IDs (walletko's `Id` value object rejects
non-cuid ids). Re-running is safe and never duplicates data — idempotency comes
from preserved IDs plus the unique indexes on the default pot and on
`(transaction_id, pot_id)`.

## Run with Docker

Build the image from the repository root (the build context must be the repo
root so the pnpm workspace lockfile is available to `pnpm install`):

    docker build -f apps/finance-to-walletko/Dockerfile -t finance-to-walletko .

Run it against the two databases:

    docker run --rm finance-to-walletko \
      --finance=postgres://user:pass@host:5432/finance \
      --walletko=postgres://user:pass@host:5432/walletko

## Run locally

    pnpm --filter finance-to-walletko start -- \
      --finance=postgres://... --walletko=postgres://...

## Test

End-to-end verification against ephemeral Postgres containers (requires Docker):

    pnpm --filter finance-to-walletko test
