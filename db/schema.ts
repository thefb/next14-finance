import { integer, pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Categories Table
export const categories = pgTable("categories", {
  category_id: text("category_id").primaryKey(),
  name: text("name").notNull(),
  user_id: text("user_id").notNull(),
});

export const categories_relations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
  subcategories: many(subcategories), // Relationship to subcategories table
}));

export const insert_category_schema = createInsertSchema(categories);

// Subcategories Table
export const subcategories = pgTable("subcategories", {
  subcategory_id: text("subcategory_id").primaryKey(),
  name: text("name").notNull(),
  category_id: text("category_id")
    .references(() => categories.category_id, { onDelete: "cascade" })
    .notNull(),
});

export const subcategories_relations = relations(subcategories, ({ one }) => ({
  category: one(categories, {
    fields: [subcategories.category_id],
    references: [categories.category_id],
  }),
}));

export const insert_subcategory_schema = createInsertSchema(subcategories);

// Accounts Table
export const accounts = pgTable("accounts", {
  account_id: text("account_id").primaryKey(),
  name: text("name").notNull(),
  user_id: text("user_id").notNull(),
});

export const accounts_relations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

export const insert_account_schema = createInsertSchema(accounts);

// Installment Plans Table
export const installment_plans = pgTable("installment_plans", {
  installment_plan_id: text("installment_plan_id").primaryKey(),
  total_amount: integer("total_amount").notNull(),
  number_of_installments: integer("number_of_installments").notNull(),
  description: text("description"),
  start_date: timestamp("start_date", { mode: "date" }).notNull(),
  end_date: timestamp("end_date", { mode: "date" }),
  user_id: text("user_id").notNull(),
});

export const installment_plans_relations = relations(installment_plans, ({ many }) => ({
  transactions: many(transactions),
}));

export const insert_installment_plan_schema = createInsertSchema(installment_plans, {
  start_date: z.coerce.date(),
  end_date: z.coerce.date().optional(),
});

// Transactions Table
export const transactions = pgTable("transactions", {
  transaction_id: text("transaction_id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  account_id: text("account_id")
    .references(() => accounts.account_id, {
      onDelete: "cascade",
    })
    .notNull(),
  category_id: text("category_id").references(() => categories.category_id, {
    onDelete: "set null",
  }),
  installment_plan_id: text("installment_plan_id").references(() => installment_plans.installment_plan_id),
  installment_number: integer("installment_number"),
});

export const transactions_relations = relations(transactions, ({ one, many }) => ({
  account: one(accounts, {
    fields: [transactions.account_id],
    references: [accounts.account_id],
  }),
  category: one(categories, {
    fields: [transactions.category_id],
    references: [categories.category_id],
  }),
  installment_plan: one(installment_plans, {
    fields: [transactions.installment_plan_id],
    references: [installment_plans.installment_plan_id],
  }),
  transaction_users: many(transaction_users),
}));

export const insert_transaction_schema = createInsertSchema(transactions, {
  date: z.coerce.date(),
  installment_number: z.number().int().positive().optional(),
});

// Transaction Users Table
export const transaction_users = pgTable("transaction_users", {
  transaction_user_id: serial("transaction_user_id").primaryKey(),
  transaction_id: text("transaction_id")
    .references(() => transactions.transaction_id, { onDelete: "cascade" })
    .notNull(),
  user_id: text("user_id").notNull(),
  amount: integer("amount").notNull(),
});

export const transaction_users_relations = relations(transaction_users, ({ one }) => ({
  transaction: one(transactions, {
    fields: [transaction_users.transaction_id],
    references: [transactions.transaction_id],
  }),
}));

export const insert_transaction_user_schema = createInsertSchema(transaction_users);
