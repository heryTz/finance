/*
  Warnings:

  - A unique constraint covering the columns `[ref,ownerId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,onwerId]` on the table `PaymentMode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Client_ref_key";

-- DropIndex
DROP INDEX "PaymentMode_name_key";

-- DropIndex
DROP INDEX "Tag_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Client_ref_ownerId_key" ON "Client"("ref", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMode_name_onwerId_key" ON "PaymentMode"("name", "onwerId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_userId_key" ON "Tag"("name", "userId");
