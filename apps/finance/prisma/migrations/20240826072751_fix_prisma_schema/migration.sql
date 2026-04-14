-- AlterTable
ALTER TABLE "Operation" RENAME CONSTRAINT "Finance_pkey" TO "Operation_pkey";

-- RenameForeignKey
ALTER TABLE "Operation" RENAME CONSTRAINT "Finance_userId_fkey" TO "Operation_userId_fkey";

-- RenameIndex
ALTER INDEX "_FinanceToTag_AB_unique" RENAME TO "_OperationToTag_AB_unique";

-- RenameIndex
ALTER INDEX "_FinanceToTag_B_index" RENAME TO "_OperationToTag_B_index";
