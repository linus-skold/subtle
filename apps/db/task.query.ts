import { getClient } from "./database.client";
import {
  tasks,
  type Task,
  type TaskInsert,
  type TaskUpdate,
  TaskSelectSchema,
  TaskInsertSchema,
} from "./schema/task.schema";
import { eq } from "drizzle-orm";

const client = getClient();

export const getTasks = async () => {
  const result = await client.select().from(tasks);
  const tasksList: Task[] = TaskSelectSchema.array().parse(result);
  return tasksList;
};

export const getTaskById = async (id: number) => {
  const result = await client.select().from(tasks).where(eq(tasks.id, id));
  const task: Task = TaskSelectSchema.parse(result);
  return task;
};

export const createTask = async (task: TaskInsert) => {
  const parsed = TaskInsertSchema.safeParse(task);
  try {
    const result = await client.insert(tasks).values(parsed.data).returning();
    const createdTask: Task = TaskSelectSchema.parse(result[0]);
    return createdTask;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (task: TaskUpdate) => {
  console.log("Updating task:", task);
  const parsed = TaskInsertSchema.safeParse(task);
  const result = await client
    .update(tasks)
    .set(parsed.data)
    .where(eq(tasks.id, task.id))
    .returning();
  const updatedTask: Task = TaskSelectSchema.parse(result[0]);
  return updatedTask;
};

export const deleteTask = async (id: number) => {
  const result = await client.delete(tasks).where(eq(tasks.id, id)).returning();
  const deletedTask: Task = TaskSelectSchema.parse(result[0]);
  return deletedTask;
};
