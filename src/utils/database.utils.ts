import Database from '@tauri-apps/plugin-sql';
import { z } from 'zod';
import { PartialTask, Task, TaskInsert, TaskSchema } from '@/types/task.types';

let database: Database;

export const setDatabase = async () => {
  const db = await Database.load('sqlite:subtle-todo.db');
  database = db;
};

export const getDatabase = () => {
  return database;
};

export const createTable = async () => {
  await database.execute(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_name TEXT NOT NULL,
    estimate INTEGER DEFAULT 0,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN
  )`);
};

export const addTask = async (task: TaskInsert) => {
  await createTable();
  return await database.execute(
    `INSERT INTO tasks (task_name, estimate, progress, completed) VALUES (?, ?, ?, ? )`,
    [task.task_name, task.estimate, task.progress, task.completed],
  );
};


export const PartialDatabaseTaskSchema = TaskSchema.omit({active: true}).partial();
export type PartialDatabaseTask = z.infer<typeof PartialDatabaseTaskSchema>;

export const updateTask = async (task: PartialDatabaseTask) => {
  await database.execute(
    `UPDATE tasks SET task_name = ?, estimate = ?, progress = ?, completed = ? WHERE id = ?`,
    [task.task_name, task.estimate, task.progress, task.completed, task.id],
  );

};

export const getTaskById = async (id: number): Promise<Task> => {
  const result = await database.select(`SELECT * FROM tasks WHERE id = ?`, [
    id,
  ]);
  return TaskSchema.parse(result);
};

export const deleteTask = async (id: number) => {
  await database.execute(`DELETE FROM tasks WHERE id = ?`, [id]);
};

export const TaskDatabaseSchema = TaskSchema.omit({completed: true}).extend({
  completed: z.string().default('false')
})
export type TaskDatabaseType = z.infer<typeof TaskDatabaseSchema>; 

export const loadTasks = async (): Promise<Task[]> => {
  const result: TaskDatabaseType[] = await database.select('SELECT * FROM tasks');
  const parsed = z.array(TaskSchema).parse(
    result.map((task) => ({
      ...task,
      completed: task.completed === 'true' ? true : false,
    })),
  );
  return parsed;
};

export const deleteAllTasks = async () => {
  await database.execute(`DELETE * FROM tasks`);
};

export const getLatestTask = async () => {
return await database.execute(
  `SELECT * FROM tasks ORDER BY id DESC LIMIT 1`
);
}