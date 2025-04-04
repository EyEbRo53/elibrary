import {
  timestamp,
  pgTable,
  text,
  integer,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email"),
  image: text("image"),
  password: text("password"),
  role: text("role").$type<"admin" | "publisher" | "user">().default("user"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const accounts = pgTable("account", {
  userId: text("userId")
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

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const publisher = pgTable("publisher", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .references(() => users.id)
    .notNull(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const STATUS_ENUM = pgEnum("status", ["free", "pro"]);

export const books = pgTable("books", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .references(() => users.id)
    .notNull(),
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
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .references(() => users.id)
    .notNull(),
  bookId: text("bookId")
    .references(() => books.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
