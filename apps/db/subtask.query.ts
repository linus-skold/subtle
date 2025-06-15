import { getClient } from "./database.client";
import {
  subtasks,
  type Subtask,
  type SubtaskInsert,
  type SubtaskUpdate,
  SubtaskSelectSchema,
  SubtaskInsertSchema,
  SubtaskUpdateSchema,
} from "./schema/subtask.schema";
import { eq } from "drizzle-orm";

const client = getClient();

export const getSubtasks = async (parentId: number) => {
  const result = await client
    .select()
    .from(subtasks)
    .where(eq(subtasks.parentId, parentId));
  const subtasksList: Subtask[] = SubtaskSelectSchema.array().parse(result);
  return subtasksList;
};

export const createSubtask = async (subtask: SubtaskInsert) => {
  const parsed = SubtaskInsertSchema.safeParse(subtask);
  if (!parsed.success) {
    throw new Error("Invalid subtask data");
  }
  try {
    const result = await client
      .insert(subtasks)
      .values(parsed.data)
      .returning();
    const createdSubtask: Subtask = SubtaskSelectSchema.parse(result[0]);
    return createdSubtask;
  } catch (error) {
    console.error("Error creating subtask:", error);
    throw error;
  }
};

export const deleteSubtask = async (id: number) => {
  const result = await client
    .delete(subtasks)
    .where(eq(subtasks.id, id))
    .returning();
  if (result.length === 0) {
    throw new Error(`Subtask with id ${id} not found`);
  }
  const deletedSubtask: Subtask = SubtaskSelectSchema.parse(result[0]);
  return deletedSubtask;
};

export const updateSubtask = async (subtask: SubtaskUpdate) => {
  const parsed = SubtaskUpdateSchema.safeParse(subtask);
  if (!parsed.success) {
    throw new Error("Invalid subtask data");
  }
  try {
    const result = await client
      .update(subtasks)
      .set(parsed.data)
      .where(eq(subtasks.id, subtask.id))
      .returning();
    if (result.length === 0) {
      throw new Error(`Subtask with id ${subtask.id} not found`);
    }
    const updatedSubtask: Subtask = SubtaskSelectSchema.parse(result[0]);
    return updatedSubtask;
  } catch (error) {
    console.error("Error updating subtask:", error);
    throw error;
  }
};
