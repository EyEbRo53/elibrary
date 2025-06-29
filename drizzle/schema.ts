import { relations } from "drizzle-orm";
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
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow(),
});

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
  status: text("status").$type<"free" | "pro">().default("pro"), // ✅ fixed here
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const booksRelations = relations(books, ({ one }) => ({
  user: one(users, {
    fields: [books.userId],
    references: [users.id],
  }),
  publisher: one(publisher, {
    fields: [books.userId],
    references: [publisher.userId],
  }),
}));

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

export const ratingRelations = relations(rating, ({ one }) => ({
  user: one(users, {
    fields: [rating.userId],
    references: [users.id],
  }),
  book: one(books, {
    fields: [rating.userId],
    references: [books.id],
  }),
}));

export const jobs = pgTable("jobs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .references(() => users.id)
    .notNull(),
  topic: text("topic").notNull(),
  status: text("status")
    .$type<"processing" | "completed">()
    .default("processing"),
  pdfUrl: text("pdf_url"),
  html: text("pdf_html"),
  customCss: text("pdf_customCss"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
