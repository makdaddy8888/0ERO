CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`institution` text,
	`account_type` text DEFAULT 'transaction' NOT NULL,
	`currency` text DEFAULT 'AUD' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cgt_disposals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`asset_label` text NOT NULL,
	`disposed_at` text NOT NULL,
	`units` real NOT NULL,
	`proceeds_cents` integer NOT NULL,
	`cost_base_cents` integer NOT NULL,
	`acquisition_at` text,
	`discount_eligible` integer DEFAULT true NOT NULL,
	`financial_year` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employer_allowances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`financial_year` text NOT NULL,
	`reported_on_payment_summary` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `household_profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`financial_year` text NOT NULL,
	`has_private_health` integer,
	`spouse_taxable_income_cents` integer,
	`received_government_allowances` integer,
	`wfh_method_preference` text,
	`car_method_preference` text,
	`setup_confirmed_at` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `household_profile_financial_year_unique` ON `household_profile` (`financial_year`);--> statement-breakpoint
CREATE TABLE `tax_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`transaction_id` integer NOT NULL,
	`ato_category_code` text NOT NULL,
	`deductible_percent` real DEFAULT 100 NOT NULL,
	`notes` text,
	`financial_year` text NOT NULL,
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` integer NOT NULL,
	`posted_at` text NOT NULL,
	`description` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`balance_cents` integer,
	`external_id` text,
	`raw_category` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_institutions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`financial_year` text NOT NULL,
	`kind` text NOT NULL,
	`entity_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_institutions_fy_kind_entity_unique` ON `user_institutions` (`financial_year`,`kind`,`entity_id`);--> statement-breakpoint
CREATE TABLE `wfh_hours_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`week_starting` text NOT NULL,
	`hours` real NOT NULL,
	`financial_year` text NOT NULL,
	`notes` text
);
