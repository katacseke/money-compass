DROP VIEW "public"."balances";--> statement-breakpoint
DROP INDEX "transactions_started_date_idx";--> statement-breakpoint
CREATE INDEX "transactions_started_date_idx" ON "transactions" USING btree ("subaccount_id","started_date" DESC NULLS LAST,"sequence" DESC NULLS LAST);--> statement-breakpoint
CREATE VIEW "public"."balances" WITH (security_invoker = true) AS (select distinct on ("transactions"."subaccount_id") "subaccount_id" as "subaccount_id", "balance", "started_date" as "started_date" from "transactions" order by "transactions"."subaccount_id", "transactions"."started_date" desc, "transactions"."sequence" desc);