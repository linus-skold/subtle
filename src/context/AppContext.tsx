import { createContext, useContext, useState } from 'react';

import { z } from 'zod';


export const AppSettingsSchema = z.object({
  alwaysOnTop: z.boolean().default(false),
  autoStart: z.boolean().default(false),
  autoStartOnLogin: z.boolean().default(false)
});

export const AppStateSchema = z.object({
  isFocusMode: z.boolean().default(false),
  isCompactMode: z.boolean().default(false),
  isSettingsModalOpen: z.boolean().default(false),
});


export type AppState = z.infer<typeof AppStateSchema>;
export const PartialAppStateSchema = AppStateSchema.partial();
export type PartialAppState = z.infer<typeof PartialAppStateSchema>;

const AppStateDefault: AppState = {
  isFocusMode: false,
  isCompactMode: false,
  isSettingsModalOpen: false,
};


export interface AppContextType {
  state: AppState;
  updateState: (newState: PartialAppState) => void;
};

const AppContext = createContext<AppContextType>({
  state: AppStateDefault,
  updateState: () => {
    throw new Error('updateState function not implemented');
  },
});



export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>(AppStateDefault);

  const updateState = (newState: PartialAppState) => {
    const parsedState = PartialAppStateSchema.parse(newState);
    setState((prevState) => ({
      ...prevState,
      ...parsedState,
    }));
  };

  return (
    <AppContext.Provider value={{ state, updateState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
