import {
  timestamp,
  pgTable,
  text,
  integer,
  pgEnum,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  name: text("name"),
  email: text("email"),
  image: text("image"),
  role: text("role").$type<"admin" | "publisher" | "user">().default("user"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const accounts = pgTable("account", {
  userId: uuid("userId")
    .references(() => users.id)
    .notNull(),
  type: text("type").$type<AdapterAccountType>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const publisher = pgTable("publisher", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("userId")
    .references(() => users.id)
    .notNull(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const STATUS_ENUM = pgEnum("status", ["free", "pro"]);

export const books = pgTable("books", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  // userId: uuid("userId")
  //   .references(() => users.id)
  //   .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  genre: text("genre").notNull(),
  coverUrl: text("cover_url").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  description: text("description").notNull(),
  summary: varchar("summary").notNull(),
  status: STATUS_ENUM("status").default("pro"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const rating = pgTable("rating", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("userId")
    .references(() => users.id)
    .notNull(),
  bookId: uuid("bookId")
    .references(() => books.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
