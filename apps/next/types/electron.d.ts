// src/types/electron.d.ts
export {};

declare global {
  interface Window {
    electronAPI: {
      send: (channel: string, data: unknown) => void;
      receive: (channel: string, func: (...args: unknown[]) => void) => void;
      invoke: <T = unknown>(channel: string, data?: unknown) => Promise<T>;
    };
  }
}
