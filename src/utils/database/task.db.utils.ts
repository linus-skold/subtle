import { z } from 'zod';
import { Task, TaskInsert, TaskSchema } from '@/types/task.types';
import { getDatabase } from './sqlite.utils';


export const PartialDatabaseTaskSchema = TaskSchema.omit({
  active: true,
}).partial();

export type PartialDatabaseTask = z.infer<typeof PartialDatabaseTaskSchema>;

export const TaskDatabaseSchema = TaskSchema.omit({ completed: true }).extend({
  completed: z.string().default('false'),
  archived: z.string().default('false'),
});
export type TaskDatabaseType = z.infer<typeof TaskDatabaseSchema>;

const tableName = 'tasks';


export const createTable = async () => {
  const database = getDatabase();
  try {
    await database.execute(`CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      estimate INTEGER DEFAULT 0,
      progress INTEGER DEFAULT 0,
      completed BOOLEAN,
      description TEXT,
      archived BOOLEAN DEFAULT 0,
      completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT DEFAULT (datetime('now', 'localtime') ),
      task_list_id INTEGER,
      tags TEXT DEFAULT '[]',
      priority TEXT DEFAULT 'none'
      )`);
    } catch (error) {
      console.error('Error creating tasks table:', error);
  }
};


export const addTask = async (task: TaskInsert) => {
  const database = getDatabase();
  await createTable();
  return await database.execute(
    `INSERT INTO ${tableName} (title, estimate, progress, completed, description, archived, created_at, updated_at, task_list_id, tags, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [task.title, task.estimate, task.progress, task.completed, task.description, task.archived, task.created_at, task.updated_at, task.task_list_id, JSON.stringify(task.tags), task.priority],
  );
};
export const updateTask = async (task: PartialDatabaseTask) => {
  const database = getDatabase();
  await database.execute(
    `UPDATE ${tableName} SET title = ?, estimate = ?, progress = ?, completed = ?, description = ?, archived = ?, task_list_id = ?, tags = ?, priority = ? WHERE id = ?`,
    [task.title, task.estimate, task.progress, task.completed, task.description, task.archived, task.task_list_id, JSON.stringify(task.tags), task.priority, task.id],
  );
};

export const getTaskById = async (id: number): Promise<Task> => {
  const database = getDatabase();
  const result = await database.select(`SELECT * FROM ${tableName} WHERE id = ?`, [
    id,
  ]);
  return TaskSchema.parse(result);
};

export const deleteTask = async (id: number) => {
  const database = getDatabase();
  await database.execute(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
};

export const loadTasks = async (): Promise<Task[]> => {
  const database = getDatabase();
  const result: TaskDatabaseType[] = await database.select(
    `SELECT * FROM ${tableName}`,
  );
  const parsed = z.array(TaskSchema).parse(
    result.map((task) => ({
      ...task,
      tags: task.tags ? JSON.parse(task.tags) : [],
      priority: task.priority || 'none',
      completed: task.completed === 'true' ? true : false,
      archived: task.archived === 'true' ? true : false,
    })),
  );
  return parsed;
};

export const deleteAllTasks = async () => {
  const database = getDatabase();
  await database.execute(`DELETE * FROM ${tableName}`);
};
