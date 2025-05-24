import { z } from 'zod';
import { PartialSubtask, SubtaskInsert, SubtaskSchema } from '@/types/subtask.types';
import { getDatabase } from './sqlite.utils';


export const SubtaskDatabaseSchema = SubtaskSchema.omit({ completed: true }).extend({
  completed: z.string().default('false'),
});
export type SubtaskDatabaseType = z.infer<typeof SubtaskDatabaseSchema>;


export const createSubtaskTable = async () => {
  const database = getDatabase();
  await database.execute(`CREATE TABLE IF NOT EXISTS subtasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subtask_name TEXT NOT NULL,
    completed BOOLEAN,
    parent_task_id INTEGER,
    FOREIGN KEY (parent_task_id) REFERENCES tasks (id) ON DELETE CASCADE
  )`);
};

export const addSubtask = async (subtask: SubtaskInsert) => {
  const database = getDatabase();
  await createSubtaskTable();
  return await database.execute(
    `INSERT INTO subtasks (parent_task_id, subtask_name, completed) VALUES (?, ?, ? )`,
    [subtask.parent_task_id, subtask.subtask_name, subtask.completed],
  );
};

export const updateSubtask = async (subtask: PartialSubtask) => {
  const database = getDatabase();
  await database.execute(
    `UPDATE subtasks SET subtask_name = ?, completed = ? WHERE id = ?`,
    [subtask.subtask_name, subtask.completed, subtask.id],
  );
};
export const deleteSubtask = async (id: number) => {
  const database = getDatabase();
  await database.execute(`DELETE FROM subtasks WHERE id = ?`, [id]);
};

export const getSubtasksByParentId = async (parent_task_id: number) => {
  const database = getDatabase();
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
