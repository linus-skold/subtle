import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path from "path";

import { taskHandles, noteHandles } from "./handles";
import subtaskHandles from "./handles/subtask.handles";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

console.log("Starting Electron app...");

async function waitForServer(url: string, retries = 20, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      console.error("Error fetching server");
    }
    await new Promise((r) => setTimeout(r, delay));
  }
  throw new Error(`Server at ${url} not available after ${retries} attempts`);
}

const createWindow = async () => {
  console.log("Creating main window...");
  await waitForServer("http://localhost:3000");

  const preloadPath = path.join(__dirname, "preload.js");
  console.log("Using preload path:", preloadPath);

  const mainWindow = new BrowserWindow({
    width: 400,
    height: 900,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true, // For simplicity, not recommended for production
    },
  });
  mainWindow.setMenu(null);

  if (app.isPackaged) {
    // Load the index.html file from the packaged app
    // mainWindow.loadFile("index.html");
  } else {
    // Load the index.html file from the development environment
    mainWindow
      .loadURL("http://localhost:3000")
      .catch((err: unknown) => console.error(err)); // Adjust the URL as needed for your dev server
  }
  mainWindow.webContents.openDevTools({ mode: "detach" });

  noteHandles.setup();
  taskHandles.setup();
  subtaskHandles.setup();

  ipcMain.on("close-window", () => {
    mainWindow.close();
    app.quit();
  });

  ipcMain.handle(
    "change-window-size",
    (event, size) => {
      mainWindow.setSize(size.width, size.height);
    },
  );

  ipcMain.handle("get-window-size", () => {
    const [width, height] = mainWindow.getSize();
    return { width, height };
  });

};

app
  .whenReady()
  .then(createWindow)
  .catch((err: unknown) => {
    console.error("Failed to create window:", err);
  });
