import { getClient } from "./database.client";
import { eq } from "drizzle-orm";
import { settings } from "./schema/settings.schema";


const client = getClient();


export const getSettings = async () => {
  const result = await client.select().from(settings);
  return result;
};

export const getSettingsById = async (id: number) => {
  const result = await client.select().from(settings).where(eq(settings.id, id));
  return result[0];
}

export const createSetting = async (setting: { setting: string; state: string }) => {
  try {
    const result = await client.insert(settings).values(setting).returning();
    return result[0];
  } catch (error) {
    console.error("Error creating setting:", error);
    throw error;
  }
};

export const updateSetting = async (setting: { id: number; setting: string; state: string }) => {
  try {
    const result = await client
      .update(settings)
      .set({ setting: setting.setting, state: setting.state })
      .where(eq(settings.id, setting.id))
      .returning();
    return result[0];
  } catch (error) {
    console.error("Error updating setting:", error);
    throw error;
  }
};

