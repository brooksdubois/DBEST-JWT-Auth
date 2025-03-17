import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { t } from 'elysia';
import { createSelectSchema } from 'drizzle-typebox';

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),  // Store hashed password
});

export const userSelectSchema = createSelectSchema(users, {
  username: t.String({ minLength: 1, default: '' }),
  password: t.String({ minLength: 1, default: '' }),
});

export const userInsertSchema = t.Omit(userSelectSchema, ['id']);