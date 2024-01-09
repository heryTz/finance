/*
  Warnings:

  - Added the required column `paymentModeId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "PaymentMode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "ownerName" TEXT,
    "iban" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "PaymentMode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "clientId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "tva" INTEGER,
    "ref" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "paymentModeId" TEXT NOT NULL,
    CONSTRAINT "Invoice_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_paymentModeId_fkey" FOREIGN KEY ("paymentModeId") REFERENCES "PaymentMode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("clientId", "createdAt", "currency", "id", "ownerId", "ref", "tva", "updatedAt") SELECT "clientId", "createdAt", "currency", "id", "ownerId", "ref", "tva", "updatedAt" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE UNIQUE INDEX "Invoice_ref_clientId_key" ON "Invoice"("ref", "clientId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMode_name_key" ON "PaymentMode"("name");
