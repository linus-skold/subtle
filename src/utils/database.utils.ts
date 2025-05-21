import Database from '@tauri-apps/plugin-sql';
import { z } from 'zod';
import { Task, TaskInsert, TaskSchema } from '@/types/task.types';
import { PartialSubtask, Subtask, SubtaskInsert, SubtaskSchema } from '@/types/subtask.types';

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

export const createSubtaskTable = async () => {
  await database.execute(`CREATE TABLE IF NOT EXISTS subtasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subtask_name TEXT NOT NULL,
    completed BOOLEAN,
    parent_task_id INTEGER,
    FOREIGN KEY (parent_task_id) REFERENCES tasks (id) ON DELETE CASCADE
  )`);
};

export const addTask = async (task: TaskInsert) => {
  await createTable();
  return await database.execute(
    `INSERT INTO tasks (task_name, estimate, progress, completed) VALUES (?, ?, ?, ? )`,
    [task.task_name, task.estimate, task.progress, task.completed],
  );
};

export const PartialDatabaseTaskSchema = TaskSchema.omit({
  active: true,
}).partial();
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

export const TaskDatabaseSchema = TaskSchema.omit({ completed: true }).extend({
  completed: z.string().default('false'),
});
export type TaskDatabaseType = z.infer<typeof TaskDatabaseSchema>;

export const loadTasks = async (): Promise<Task[]> => {
  const result: TaskDatabaseType[] = await database.select(
    'SELECT * FROM tasks',
  );
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
  return await database.execute(`SELECT * FROM tasks ORDER BY id DESC LIMIT 1`);
};

export const addSubtask = async (subtask: SubtaskInsert) => {
  await createSubtaskTable();
  return await database.execute(
    `INSERT INTO subtasks (parent_task_id, subtask_name, completed) VALUES (?, ?, ? )`,
    [subtask.parent_task_id, subtask.subtask_name, subtask.completed],
  );
};

export const updateSubtask = async (subtask: PartialSubtask) => {
  await database.execute(
    `UPDATE subtasks SET subtask_name = ?, completed = ? WHERE id = ?`,
    [subtask.subtask_name, subtask.completed, subtask.id],
  );
};
export const deleteSubtask = async (id: number) => {
  await database.execute(`DELETE FROM subtasks WHERE id = ?`, [id]);
};


export const SubtaskDatabaseSchema = SubtaskSchema.omit({ completed: true }).extend({
  completed: z.string().default('false'),
});
export type SubtaskDatabaseType = z.infer<typeof SubtaskDatabaseSchema>;

export const getSubtasksByParentId = async (parent_task_id: number) => {
  const result: SubtaskDatabaseType[] = await database.select(
    `SELECT * FROM subtasks WHERE parent_task_id = ?`,
    [parent_task_id],
  );
  return z.array(SubtaskSchema).parse(
    result.map((subtask) => ({
      ...subtask,
      completed: subtask.completed === 'true' ? true : false,
    })),
  );
};
