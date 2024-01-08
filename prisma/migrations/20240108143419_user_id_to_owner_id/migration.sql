/*
  Warnings:

  - You are about to drop the column `userId` on the `PaymentMode` table. All the data in the column will be lost.
  - Added the required column `onwerId` to the `PaymentMode` table without a default value. This is not possible if the table is not empty.

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
    "onwerId" TEXT NOT NULL,
    CONSTRAINT "PaymentMode_onwerId_fkey" FOREIGN KEY ("onwerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PaymentMode" ("accountName", "createdAt", "iban", "id", "name", "updatedAt") SELECT "accountName", "createdAt", "iban", "id", "name", "updatedAt" FROM "PaymentMode";
DROP TABLE "PaymentMode";
ALTER TABLE "new_PaymentMode" RENAME TO "PaymentMode";
CREATE UNIQUE INDEX "PaymentMode_name_key" ON "PaymentMode"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
