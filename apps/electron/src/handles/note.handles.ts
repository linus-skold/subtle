import { ipcMain } from "electron";


import { createNote, deleteNote, getNotes } from "@db/note.query";

const setup = () => {
  ipcMain.handle("save-note", async (event, note) => {
    try {
      const createdNote = await createNote(note);
      return createdNote;
    } catch (error: unknown) {
      console.error("Error saving note:", error);
      throw error; // Re-throw to handle in renderer
    }
  });
  ipcMain.handle("get-notes", async () => {
    try {
      const notes = await getNotes();
      return notes;
    } catch (error: unknown) {
      console.error("Error fetching notes:", error);
      throw error; // Re-throw to handle in renderer
    }
  });
  ipcMain.handle("delete-note", async (event, noteId) => {
    try {
      const deletedNote = await deleteNote(noteId);
      return deletedNote;
    } catch (error: unknown) {
      console.error("Error deleting note:", error);
      throw error; // Re-throw to handle in renderer
    }
  });
};

export default { setup };