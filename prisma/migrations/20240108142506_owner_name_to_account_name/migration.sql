/*
  Warnings:

  - You are about to drop the column `ownerName` on the `PaymentMode` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PaymentMode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "accountName" TEXT,
    "iban" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "PaymentMode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PaymentMode" ("createdAt", "iban", "id", "name", "updatedAt", "userId") SELECT "createdAt", "iban", "id", "name", "updatedAt", "userId" FROM "PaymentMode";
DROP TABLE "PaymentMode";
ALTER TABLE "new_PaymentMode" RENAME TO "PaymentMode";
CREATE UNIQUE INDEX "PaymentMode_name_key" ON "PaymentMode"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
