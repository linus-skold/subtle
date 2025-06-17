import { ipcMain } from "electron";

import type { TaskInsert, TaskUpdate } from "@db/schema/task.schema";

import { createTask, updateTask, getTasks, deleteTask } from "@db/task.query";

const setup = () => {
  ipcMain.handle("get-tasks", async () => {
    try {
      const tasks = await getTasks();
      return tasks;
    } catch (error: unknown) {
      console.error("Error fetching tasks:", error);
      throw error; // Re-throw to handle in renderer
    }
  });

  ipcMain.handle("create-task", async (event, task: TaskInsert) => {
    try {
      const createdTask = await createTask(task);
      return createdTask;
    } catch (error: unknown) {
      console.error("Error creating task:", error);
      throw error; // Re-throw to handle in renderer
    }
  });

  ipcMain.handle("update-task", async (event, task: TaskUpdate) => {
    try {
      const updatedTask = await updateTask(task);
      return updatedTask;
    } catch (error: unknown) {
      console.error("Error updating task:", error);
      throw error; // Re-throw to handle in renderer
    }
  });

  ipcMain.handle("delete-task", async (event, taskId: number) => {
    try {
      // Assuming you have a deleteTask function in your task.query module
      const deletedTask = await deleteTask(taskId);
      return deletedTask;
    } catch (error: unknown) {
      console.error("Error deleting task:", error);
      throw error; // Re-throw to handle in renderer
    }
  });

};

export default { setup };