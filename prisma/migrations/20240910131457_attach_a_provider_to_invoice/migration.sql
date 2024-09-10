-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "providerId" TEXT;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Update data --
UPDATE "Invoice" 
SET "providerId" = (
  SELECT "Provider"."id"
  FROM "Provider"
  WHERE "Provider"."ownerId" = "Invoice"."ownerId"
)
