// src/electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';
console.log("✅ Preload script loaded");
contextBridge.exposeInMainWorld('electronAPI', {
  closeWindow: () => ipcRenderer.send('close-window'),
});
