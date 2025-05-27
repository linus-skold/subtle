import { z } from "zod";

export const SubtaskSchema = z.object({
  id: z.number(),
  parent_task_id: z.number(),
  subtask_name: z.string(),
  completed: z.boolean().default(false),
});

export const PartialSubtaskSchema = SubtaskSchema.partial();
export const SubtaskInsertSchema = SubtaskSchema.omit({ id: true });

export type Subtask = z.infer<typeof SubtaskSchema>;
export type PartialSubtask = z.infer<typeof PartialSubtaskSchema>;
export type SubtaskInsert = z.infer<typeof SubtaskInsertSchema>;
