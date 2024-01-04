/*
  Warnings:

  - A unique constraint covering the columns `[ref,clientId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Invoice_ref_key";

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_ref_clientId_key" ON "Invoice"("ref", "clientId");
