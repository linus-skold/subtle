import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from "zod/v4";


export const tasks = sqliteTable('tasks', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  estimate: integer().default(0),
  progress: integer().default(0),
  completed: text().default('false'), // Using text to represent boolean in SQLite
  description: text().default(''),
  archived: text().default('false'),
  created_at: text().default(new Date().toISOString()),
  updated_at: text().default(new Date().toISOString()),
  task_list_id: integer().default(0),
  tags: text().default('[]'),
  priority: text().default('none'),
  additionalData: text().default('{}'),
});


export const TaskInsertSchema = createInsertSchema(tasks).extend({
  title: z.string(),
  completed: z.boolean().transform((val) => (val ? 'true' : 'false')).optional(),
  archived: z.boolean().transform((val) => (val ? 'true' : 'false')).optional(),
})
export type TaskInsert = z.infer<typeof TaskInsertSchema>;

export const TaskUpdateSchema = createUpdateSchema(tasks);
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;


export const TaskSelectSchema = createSelectSchema(tasks, {
  completed: z.stringbool(),
  archived: z.stringbool(),
}).extend({
  active: z.boolean().default(false),
  overtime: z.boolean().default(false),
});

export type Task = z.infer<typeof TaskSelectSchema>;
