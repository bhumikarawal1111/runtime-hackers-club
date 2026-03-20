import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const achievementsTable = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  year: integer("year").notNull(),
  awardedTo: text("awarded_to").notNull(),
  category: text("category").notNull(),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAchievementSchema = createInsertSchema(achievementsTable).omit({ id: true, createdAt: true });
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievementsTable.$inferSelect;
