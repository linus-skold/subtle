import { z } from "zod";
import Database from "@tauri-apps/plugin-sql";

export const TaskSchema = z.object({
  task_name: z.string(),
  id: z.number(),
  tags: z.string().optional().nullable(),
  completed: z
    .boolean()
    .or(z.string())
    .optional()
    .transform((v) => {
      if (typeof v === "string") {
        return v === "true";
      }
      return v;
    }),
  project: z.string().optional().nullable(),
  meta: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
  parent_id: z.number().optional().nullable(),
  sort_order: z.number().optional().nullable(),
});

export const TaskSubSchema = TaskSchema.extend({
  subtasks: TaskSchema.array().optional(),
});

export const TaskSelectSchema = z.array(TaskSubSchema);

export type Task = z.infer<typeof TaskSubSchema>;

export const TaskInsertSchema = TaskSubSchema.omit({ id: true });

export type TaskInsert = z.infer<typeof TaskInsertSchema>;

let database: Database;

export const setDatabase = async () => {
  const db = await Database.load("sqlite:subtle-todo.db");
  database = db;
};

export const getDatabase = () => {
  return database;
};

export const createTable = async () => {
  await database.execute(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_name TEXT NOT NULL,
    tags TEXT,
    completed BOOLEAN,
    project TEXT,
    meta TEXT,
    due_date TEXT,
    parent_id INTEGER,
    sort_order INTEGER,
    FOREIGN KEY (parent_id) REFERENCES tasks(id) ON DELETE CASCADE
  )`);
};

export const changeParent = async (
  db: Database,
  id: number,
  parentId: number
) => {
  await db.execute(`UPDATE tasks SET parent_id = ? WHERE id = ?`, [
    parentId,
    id,
  ]);
};

export const editTask = async (task: Task) => {
  return await database.execute(
    `UPDATE tasks SET task_name = ?, tags = ?, completed = ?, project = ?, meta = ?, due_date = ? WHERE id = ?`,
    [
      task.task_name,
      task.tags,
      task.completed ? "true" : "false",
      task.project,
      task.meta,
      task.due_date,
      task.id,
    ]
  );
};

export const addTask = async (task: TaskInsert) => {
  await createTable();
  return await database.execute(
    `INSERT INTO tasks (task_name, tags, completed, project, meta, due_date, sort_order) VALUES (?, ?, ?, ?, ?, ?, ? )`,
    [task.task_name, "", false, "", "", "", task.sort_order]
  );
};

export const addSubtask = async (task: TaskInsert) => {
  return await database.execute(
    `INSERT INTO tasks (task_name, tags, completed, project, meta, due_date, parent_id, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [task.task_name, "", false, "", "", "", task.parent_id, task.sort_order]
  );
};

export const getTaskById = async (id: number): Promise<Task> => {
  const result = await database.select(`SELECT * FROM tasks WHERE id = ?`, [id]);
  return TaskSchema.parse(result);
};

export const deleteTask = async (id: number) => {
  await database.execute(`DELETE FROM tasks WHERE id = ?`, [id]);
};

export const dropTable = async () => {
  await database.execute(`DROP TABLE tasks`);
};

export const loadTasks = async (): Promise<Task[]> => {
  const result = await database.select("SELECT * FROM tasks");
  return TaskSelectSchema.parse(result);
};

export const deleteAllTasks = async () => {
  await database.execute(`DELETE FROM tasks`);
}