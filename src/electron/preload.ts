// src/electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (msg: string) => ipcRenderer.send('message-from-ui', msg),
  onMessage: (callback: (msg: string) => void) =>
    ipcRenderer.on('message-from-main', (_, msg) => callback(msg)),
});
