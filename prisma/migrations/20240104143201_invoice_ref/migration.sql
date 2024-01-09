/*
  Warnings:

  - Added the required column `ref` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
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
    CONSTRAINT "Invoice_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("clientId", "createdAt", "id", "ownerId", "tva", "updatedAt") SELECT "clientId", "createdAt", "id", "ownerId", "tva", "updatedAt" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
CREATE UNIQUE INDEX "Invoice_ref_key" ON "Invoice"("ref");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
