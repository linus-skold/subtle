import { getClient } from './database.client';
import { tasks, Task, TaskSelectSchema } from './schema/task.schema';
import { eq } from 'drizzle-orm';


const client = getClient();

export const getTasks = async () => {
  const result = await client.select().from(tasks);
  const tasksList: Task[] = TaskSelectSchema.array().parse(result);
  return tasksList;
} 

export const getTaskById = async (id: number) => {
  const result = await client.select().from(tasks).where(eq(tasks.id, id));
  const task: Task = TaskSelectSchema.parse(result);
  return task;
}