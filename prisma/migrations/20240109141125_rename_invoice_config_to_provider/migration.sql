/*
  Warnings:

  - You are about to drop the `InvoiceConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "InvoiceConfig";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "siren" TEXT,
    "ape" TEXT,
    "nif" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Provider_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "clientId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "tva" INTEGER NOT NULL DEFAULT 0,
    "ref" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "paymentModeId" TEXT NOT NULL,
    CONSTRAINT "Invoice_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_paymentModeId_fkey" FOREIGN KEY ("paymentModeId") REFERENCES "PaymentMode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("clientId", "createdAt", "currency", "id", "ownerId", "paymentModeId", "ref", "tva", "updatedAt") SELECT "clientId", "createdAt", "currency", "id", "ownerId", "paymentModeId", "ref", coalesce("tva", 0) AS "tva", "updatedAt" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE UNIQUE INDEX "Invoice_ref_clientId_key" ON "Invoice"("ref", "clientId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
