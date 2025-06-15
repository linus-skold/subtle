import { ipcMain } from "electron";


import { createSubtask, getSubtasks, deleteSubtask, updateSubtask } from "@db/subtask.query";
import { SubtaskInsert, SubtaskUpdate } from "@db/schema/subtask.schema";

const setup = () => {
  ipcMain.handle("get-subtasks", async (event, taskId: number) => {
    try {
      const tasks = await getSubtasks(taskId);
      return tasks;
    } catch (error: unknown) {
      console.error("Error fetching tasks:", error);
      throw error; // Re-throw to handle in renderer
    }
  });

  ipcMain.handle("create-subtask", async (event, subtask: SubtaskInsert) => {
    try {
      const createdSubtask = await createSubtask(subtask);
      return createdSubtask;
    } catch (error: unknown) {
      console.error("Error creating subtask:", error);
      throw error; // Re-throw to handle in renderer
    }
  });

  ipcMain.handle("delete-subtask", async (event, subtaskId: number) => {
    try {
      const deletedSubtask = await deleteSubtask(subtaskId);
      return deletedSubtask;
    } catch (error: unknown) {
      console.error("Error deleting subtask:", error);
      throw error; // Re-throw to handle in renderer
    }
  });

  ipcMain.handle("update-subtask", async (event, subtask: SubtaskUpdate) => {
    try {
      const updatedSubtask = await updateSubtask(subtask);
      return updatedSubtask;
    } catch (error: unknown) {
      console.error("Error updating subtask:", error);
      throw error; // Re-throw to handle in renderer
    }
  });

};




export default { setup };