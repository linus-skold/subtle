import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.number(),
  task_name: z.string(),
  estimate: z.number().default(0),
  progress: z.number().default(0),
  completed: z.boolean().default(false),
  active: z.boolean().default(false),
  overtime: z.boolean().default(false),
});

export const PartialTaskSchema = TaskSchema.partial();
export const TaskInsertSchema = TaskSchema.omit({ active: true, id: true, overtime: true });
export const TaskLoadSchema = TaskSchema.omit({ active: true, overtime: true });

export type Task = z.infer<typeof TaskSchema>;
export type PartialTask = z.infer<typeof PartialTaskSchema>;
export type TaskInsert = z.infer<typeof TaskInsertSchema>;
