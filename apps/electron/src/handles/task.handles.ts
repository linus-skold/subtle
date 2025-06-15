import { ipcMain } from "electron";


import { createTask, updateTask, getTasks } from "@db/task.query";

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

  ipcMain.handle("create-task", async (event, task) => {
    try {
      const createdTask = await createTask(task);
      return createdTask;
    } catch (error: unknown) {
      console.error("Error creating task:", error);
      throw error; // Re-throw to handle in renderer
    }
  });

  ipcMain.handle("update-task", async (event, task) => {
    try {
      const updatedTask = await updateTask(task);
      return updatedTask;
    } catch (error: unknown) {
      console.error("Error updating task:", error);
      throw error; // Re-throw to handle in renderer
    }
  });
};

export default { setup };