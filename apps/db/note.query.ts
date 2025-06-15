import { getClient } from "./database.client";
import {
  notes,
  type Note,
  type NoteInsert,
  type NoteUpdate,
  NoteSelectSchema,
  NoteInsertSchema,
} from "./schema/note.schema";
import { eq } from "drizzle-orm";

const client = getClient();

export const getNotes = async () => {
  const result = await client.select().from(notes);
  const notesList: Note[] = NoteSelectSchema.array().parse(result);
  return notesList;
}

export const getNoteById = async (id: number) => {
  const result = await client.select().from(notes).where(eq(notes.id, id));
  const note: Note = NoteSelectSchema.parse(result[0]);
  return note;
}

export const createNote = async (note: NoteInsert) => {
  const parsed = NoteInsertSchema.safeParse(note);
  try {
    const result = await client.insert(notes).values(parsed.data).returning();
    const createdNote: Note = NoteSelectSchema.parse(result[0]);
    return createdNote;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
}

export const updateNote = async (note: NoteUpdate) => {
  console.log("Updating note:", note);
  const parsed = NoteInsertSchema.safeParse(note);
  const result = await client
    .update(notes)
    .set(parsed.data)
    .where(eq(notes.id, note.id))
    .returning();
  const updatedNote: Note = NoteSelectSchema.parse(result[0]);
  return updatedNote;
}

export const deleteNote = async (id: number) => {
  const result = await client.delete(notes).where(eq(notes.id, id)).returning();
  const deletedNote: Note = NoteSelectSchema.parse(result[0]);
  return deletedNote;
}
