import { getClient } from './database.client.js';
import { tasks } from './schema/task.schema.js';
import { eq } from 'drizzle-orm';


const client = getClient();

export const getTasks = () => client.select().from(tasks);

export const getTaskById = (id: number) => client.select().from(tasks).where(eq(tasks.id, id));