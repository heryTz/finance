-- This is an empty migration.
ALTER TABLE IF EXISTS "Finance" RENAME TO "Operation";
ALTER TABLE IF EXISTS "_FinanceToTag" RENAME TO "_OperationToTag";