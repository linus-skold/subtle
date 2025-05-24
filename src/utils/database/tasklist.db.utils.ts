import { getDatabase } from "./sqlite.utils";
import { z } from "zod";


export const createListTable = async () => {
  const database = getDatabase();
  try {
    await database.execute(`CREATE TABLE IF NOT EXISTS task_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      task_list_order TEXT DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime')),
      archived BOOLEAN DEFAULT 0
    )`);
  } catch (error) {
    console.error('Error creating task_lists table:', error);
  }
};

export const insertList = async (name: string) => {
  const database = getDatabase();
  
  await createListTable();
  return await database.execute(
    `INSERT INTO task_lists (name, created_at, updated_at) VALUES (?, datetime('now', 'localtime'), datetime('now', 'localtime'))`,
    [name],
  );
};

export const getLists = async () => {
  const database = getDatabase();
  
  const result = await database.select(`SELECT * FROM task_lists`);
  return z.array(z.object({
    id: z.number(),
    name: z.string(),
    task_list_order: z.string().default('{}'),
    created_at: z.string().default(new Date().toISOString()),
    updated_at: z.string().default(new Date().toISOString()),
    archived: z.boolean().default(false),
  })).parse(result);
};
