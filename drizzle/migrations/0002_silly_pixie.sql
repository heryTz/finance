ALTER TABLE "tags_v2" DROP CONSTRAINT "tags_v2_name_unique";--> statement-breakpoint
ALTER TABLE "pots_v2" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tags_v2" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions_v2" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
CREATE INDEX "pots_v2_user_id_idx" ON "pots_v2" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_v2_name_user_id_unique" ON "tags_v2" USING btree ("name","user_id");--> statement-breakpoint
CREATE INDEX "tags_v2_user_id_idx" ON "tags_v2" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transactions_v2_user_id_idx" ON "transactions_v2" USING btree ("user_id");