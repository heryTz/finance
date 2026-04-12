CREATE TYPE "public"."transaction_type_v2" AS ENUM('income', 'expense');
ALTER TABLE "transactions_v2" ALTER COLUMN "type" SET DATA TYPE "public"."transaction_type_v2" USING "type"::"public"."transaction_type_v2";
