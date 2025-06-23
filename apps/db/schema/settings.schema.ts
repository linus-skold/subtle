import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from "zod/v4";

export const settings = sqliteTable('settings', {
  id: integer().primaryKey({ autoIncrement: true }),
  setting: text().default(''),
  state: text().default(''),
});


export const settingsInsertSchema = createInsertSchema(settings).extend({
  setting: z.string(),
  state: z.string(),
});

export type SettingsInsertSchema = z.infer<typeof settingsInsertSchema>;

export const settingsSelectSchema = createSelectSchema(settings);
export type SettingsSelectSchema = z.infer<typeof settingsSelectSchema>;

export const settingsUpdateSchema = createUpdateSchema(settings).extend({
  id: z.number(),
  setting: z.string(),
  state: z.string(),
});
export type SettingsUpdateSchema = z.infer<typeof settingsUpdateSchema>;