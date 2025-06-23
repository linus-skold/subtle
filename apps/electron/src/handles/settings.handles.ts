import { ipcMain } from "electron";

import {
  settingsUpdateSchema,
  settingsSelectSchema,
} from "@db/schema/settings.schema";

import { getSettings, updateSetting } from "@db/settings.query";

const setup = () => {
  ipcMain.handle("settings:getAll", async () => {
    try {
      const settings = await getSettings();
      return settingsSelectSchema.array().parse(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }
  });

  ipcMain.handle("settings:update", async (event, setting) => {
    try {
      const parsedSetting = settingsUpdateSchema.parse(setting);
      const updatedSetting = await updateSetting(parsedSetting);
      return settingsSelectSchema.parse(updatedSetting);
    } catch (error) {
      console.error("Error updating setting:", error);
      throw error;
    }
  });
};

export default { setup };
