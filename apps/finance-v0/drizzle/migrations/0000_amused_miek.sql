CREATE TABLE "expense_allocations_v2" (
	"id" text PRIMARY KEY NOT NULL,
	"transaction_id" text NOT NULL,
	"pot_id" text NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pot_allocations_v2" (
	"id" text PRIMARY KEY NOT NULL,
	"transaction_id" text NOT NULL,
	"pot_id" text NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pots_v2" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"percentage" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags_v2" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_v2_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "transaction_tags_v2" (
	"transaction_id" text NOT NULL,
	"tag_id" text NOT NULL,
	CONSTRAINT "transaction_tags_v2_transaction_id_tag_id_pk" PRIMARY KEY("transaction_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "transactions_v2" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"amount" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expense_allocations_v2" ADD CONSTRAINT "expense_allocations_v2_transaction_id_transactions_v2_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions_v2"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_allocations_v2" ADD CONSTRAINT "expense_allocations_v2_pot_id_pots_v2_id_fk" FOREIGN KEY ("pot_id") REFERENCES "public"."pots_v2"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pot_allocations_v2" ADD CONSTRAINT "pot_allocations_v2_transaction_id_transactions_v2_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions_v2"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pot_allocations_v2" ADD CONSTRAINT "pot_allocations_v2_pot_id_pots_v2_id_fk" FOREIGN KEY ("pot_id") REFERENCES "public"."pots_v2"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_tags_v2" ADD CONSTRAINT "transaction_tags_v2_transaction_id_transactions_v2_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions_v2"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_tags_v2" ADD CONSTRAINT "transaction_tags_v2_tag_id_tags_v2_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags_v2"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "expense_allocations_v2_transaction_id_pot_id_idx" ON "expense_allocations_v2" USING btree ("transaction_id","pot_id");--> statement-breakpoint
CREATE INDEX "expense_allocations_v2_pot_id_idx" ON "expense_allocations_v2" USING btree ("pot_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pot_allocations_v2_transaction_id_pot_id_idx" ON "pot_allocations_v2" USING btree ("transaction_id","pot_id");--> statement-breakpoint
CREATE INDEX "pot_allocations_v2_pot_id_idx" ON "pot_allocations_v2" USING btree ("pot_id");--> statement-breakpoint
CREATE INDEX "transaction_tags_v2_tag_id_idx" ON "transaction_tags_v2" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "transactions_v2_type_created_at_idx" ON "transactions_v2" USING btree ("type","created_at");--> statement-breakpoint
CREATE INDEX "transactions_v2_created_at_idx" ON "transactions_v2" USING btree ("created_at");