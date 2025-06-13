import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { createSelectSchema } from 'drizzle-zod';
import { z } from "zod/v4";


export const tasks = sqliteTable('tasks', {
  id: integer(),
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


export const TaskSelectSchema = createSelectSchema(tasks);

export type TaskSchema = z.infer<typeof TaskSelectSchema & {active: boolean, overtime: boolean}>;
