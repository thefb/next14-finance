CREATE TABLE IF NOT EXISTS "accounts" (
	"account_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"category_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "installment_plans" (
	"installment_plan_id" text PRIMARY KEY NOT NULL,
	"total_amount" integer NOT NULL,
	"number_of_installments" integer NOT NULL,
	"description" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"transaction_id" text PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"payee" text NOT NULL,
	"notes" text,
	"date" timestamp NOT NULL,
	"account_id" text NOT NULL,
	"category_id" text,
	"installment_plan_id" text,
	"installment_number" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("account_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_installment_plan_id_installment_plans_installment_plan_id_fk" FOREIGN KEY ("installment_plan_id") REFERENCES "public"."installment_plans"("installment_plan_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
