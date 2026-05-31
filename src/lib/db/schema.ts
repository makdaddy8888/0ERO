import {
  sqliteTable,
  text,
  integer,
  real,
} from "drizzle-orm/sqlite-core";

export const accounts = sqliteTable("accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  institution: text("institution"),
  accountType: text("account_type").notNull().default("transaction"),
  currency: text("currency").notNull().default("AUD"),
  createdAt: text("created_at").notNull(),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  accountId: integer("account_id")
    .notNull()
    .references(() => accounts.id),
  postedAt: text("posted_at").notNull(),
  description: text("description").notNull(),
  amountCents: integer("amount_cents").notNull(),
  balanceCents: integer("balance_cents"),
  externalId: text("external_id"),
  rawCategory: text("raw_category"),
  createdAt: text("created_at").notNull(),
});

export const taxTags = sqliteTable("tax_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  transactionId: integer("transaction_id")
    .notNull()
    .references(() => transactions.id),
  atoCategoryCode: text("ato_category_code").notNull(),
  deductiblePercent: real("deductible_percent").notNull().default(100),
  notes: text("notes"),
  financialYear: text("financial_year").notNull(),
});

export const cgtDisposals = sqliteTable("cgt_disposals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  assetLabel: text("asset_label").notNull(),
  disposedAt: text("disposed_at").notNull(),
  units: real("units").notNull(),
  proceedsCents: integer("proceeds_cents").notNull(),
  costBaseCents: integer("cost_base_cents").notNull(),
  acquisitionAt: text("acquisition_at"),
  discountEligible: integer("discount_eligible", { mode: "boolean" })
    .notNull()
    .default(true),
  financialYear: text("financial_year").notNull(),
});

export const wfhHoursLog = sqliteTable("wfh_hours_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weekStarting: text("week_starting").notNull(),
  hours: real("hours").notNull(),
  financialYear: text("financial_year").notNull(),
  notes: text("notes"),
});

export const householdProfile = sqliteTable("household_profile", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  financialYear: text("financial_year").notNull().unique(),
  hasPrivateHealth: integer("has_private_health", { mode: "boolean" }),
  spouseTaxableIncomeCents: integer("spouse_taxable_income_cents"),
  receivedGovernmentAllowances: integer("received_government_allowances", {
    mode: "boolean",
  }),
  wfhMethodPreference: text("wfh_method_preference"),
  carMethodPreference: text("car_method_preference"),
  updatedAt: text("updated_at").notNull(),
});

export const employerAllowances = sqliteTable("employer_allowances", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  amountCents: integer("amount_cents").notNull(),
  financialYear: text("financial_year").notNull(),
  reportedOnPaymentSummary: integer("reported_on_payment_summary", {
    mode: "boolean",
  })
    .notNull()
    .default(true),
});
