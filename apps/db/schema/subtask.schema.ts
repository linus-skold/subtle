import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { tasks } from "./task.schema";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from "zod/v4";

export const subtasks = sqliteTable('subtasks', {
  id: integer().primaryKey({ autoIncrement: true }),
  parentId: integer().notNull().references(() => tasks.id, {onDelete: 'cascade'}),
  title: text().default(''),
  completed: text().default('false'), // Using text to represent boolean in SQLite
});

export const SubtaskInsertSchema = createInsertSchema(subtasks, {
  completed: z.string().optional().default('false'),
}).extend({
  parentId: z.number(),
  title: z.string().optional(),
});
export type SubtaskInsert = z.infer<typeof SubtaskInsertSchema>;

export const SubtaskUpdateSchema = createUpdateSchema(subtasks, {
  completed: z.string().optional(),
}).extend({
  id: z.number(),
  title: z.string().optional(),
});
export type SubtaskUpdate = z.infer<typeof SubtaskUpdateSchema>;

export const SubtaskSelectSchema = createSelectSchema(subtasks, {
  completed: z.string().transform((val) => val === 'true'),
});
export type Subtask = z.infer<typeof SubtaskSelectSchema>;