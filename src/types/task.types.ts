import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  estimate: z.number().default(0),
  progress: z.number().default(0),
  completed: z.boolean().default(false),
  active: z.boolean().default(false),
  overtime: z.boolean().default(false),
  created_at: z.string().default(new Date().toISOString()),
  updated_at: z.string().default(new Date().toISOString()),
  description: z.string().default(''),
  archived: z.boolean().default(false),
  task_list_id: z.number().default(0),
  tags: z.array(z.string()).default([]),
  priority: z.enum(['none', 'low', 'medium', 'high']).default('none'),
});

export const PartialTaskSchema = TaskSchema.partial();
export const TaskInsertSchema = TaskSchema.omit({ active: true, id: true, overtime: true });
export const TaskLoadSchema = TaskSchema.omit({ active: true, overtime: true });

export type Task = z.infer<typeof TaskSchema>;
export type PartialTask = z.infer<typeof PartialTaskSchema>;
export type TaskInsert = z.infer<typeof TaskInsertSchema>;
