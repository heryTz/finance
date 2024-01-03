/*
  Warnings:

  - You are about to drop the column `label` on the `InvoiceConfig` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InvoiceConfig" (
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
    "userId" TEXT NOT NULL,
    CONSTRAINT "InvoiceConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InvoiceConfig" ("address", "ape", "createdAt", "email", "id", "name", "nif", "phone", "siren", "updatedAt", "userId") SELECT "address", "ape", "createdAt", "email", "id", "name", "nif", "phone", "siren", "updatedAt", "userId" FROM "InvoiceConfig";
DROP TABLE "InvoiceConfig";
ALTER TABLE "new_InvoiceConfig" RENAME TO "InvoiceConfig";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
