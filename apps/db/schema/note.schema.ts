import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { z } from "zod/v4";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';


export const notes = sqliteTable('notes', {
  id: integer().primaryKey({ autoIncrement: true }),
  note: text().default(''),
  created_at: text().default(new Date().toISOString()),
  updated_at: text().default(new Date().toISOString()),
});

export const NoteInsertSchema = createInsertSchema(notes);
export type NoteInsert = z.infer<typeof NoteInsertSchema>;

export const NoteUpdateSchema = createUpdateSchema(notes);
export type NoteUpdate = z.infer<typeof NoteUpdateSchema>;

export const NoteSelectSchema = createSelectSchema(notes);
export type Note = z.infer<typeof NoteSelectSchema>;