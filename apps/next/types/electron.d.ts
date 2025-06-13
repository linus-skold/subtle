// src/types/electron.d.ts
export {};

declare global {
  interface Window {
    electronAPI: {
      invoke: (channel: string, data?: unknown) => Promise<unknown>;
    };
  }
}
