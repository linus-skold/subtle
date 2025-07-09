// src/types/electron.d.ts
export {};

declare global {
  interface Window {
    electronAPI: {
      invoke: <T = unknown>(channel: string, data?: unknown) => Promise<T>;
    };
  }
}
