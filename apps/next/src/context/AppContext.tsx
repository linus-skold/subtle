/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useState } from "react";

import { z } from "zod";

export const appService = {
  getSettings: () => window.electronAPI.invoke("settings:getAll"),
  updateSettings: (setting: { id: number, setting: string; state: string }) =>
    window.electronAPI.invoke("settings:update", setting),
}

export const settingSchema = z.object({
  id: z.number(),
  setting: z.string(),
  state: z.string(),
});

export type Setting = z.infer<typeof settingSchema>;



export type AppService = typeof appService;

export interface AppContextType {
  appService?: AppService;
  settings: Setting[];
  setSettings: React.Dispatch<React.SetStateAction<Setting[] | undefined>>;
  getSetting: (key: string) => Setting | undefined;
}

const AppContext = createContext<AppContextType>({
  appService,
  settings: [],
  setSettings: () => {},
  getSetting: () => undefined
});



export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Setting[]>([]);

  
const getSetting = (key: string): Setting | undefined => {
  return settings.find((setting) => setting.setting === key);
}



  return (
    <AppContext.Provider value={{ appService, settings, setSettings, getSetting }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
