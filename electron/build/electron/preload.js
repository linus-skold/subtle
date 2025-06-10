// src/electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (msg) => ipcRenderer.send('message-from-ui', msg),
    onMessage: (callback) => ipcRenderer.on('message-from-main', (_, msg) => callback(msg)),
});
//# sourceMappingURL=preload.js.map