/*
  Warnings:

  - You are about to alter the column `amount` on the `Finance` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Finance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Finance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Finance" ("amount", "createdAt", "id", "label", "type", "updatedAt", "userId") SELECT "amount", "createdAt", "id", "label", "type", "updatedAt", "userId" FROM "Finance";
DROP TABLE "Finance";
ALTER TABLE "new_Finance" RENAME TO "Finance";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
