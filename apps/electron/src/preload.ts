// src/electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';
console.log("✅ Preload script loaded");
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel: string, data: unknown) => ipcRenderer.send(channel, data),
  receive: (channel: string, func: (...args: unknown[]) => void) =>
    ipcRenderer.on(channel, (event, ...args: unknown[]) => func(...args)),
  invoke: (channel: string, data?: unknown) => ipcRenderer.invoke(channel, data)
});
