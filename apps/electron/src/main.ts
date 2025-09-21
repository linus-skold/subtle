import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import { taskHandles, noteHandles } from "./handles";
import subtaskHandles from "./handles/subtask.handles";
import settingsHandles from "./handles/settings.handles";

import { getClient } from '@db/database.client';
import { getSettings, createSetting } from '@db/settings.query';
import { settingsInsertSchema } from '@db/schema/settings.schema';



/*
  Create all settings in the database if they don't exist yet.
  This is a one-time setup script that should be run when the app is first launched.
  It will create default settings for the app.
*/

const defaultSettings = [
  { setting: 'alwaysOnTop', state: 'false' },
  { setting: 'autoStart', state: 'false' },
  { setting: 'idleDetectionTime', state: '300' }, // 5 minutes
  { setting: 'resumeOnActivity', state: 'true' },
  { setting: 'showIdleNotification', state: 'true' },
  { setting: 'idleNotificationTime', state: '60' }, // 1 minute
  { setting: 'superCompactMode', state: 'false' }, 
];

const setupDefaultSettings = async () => {
  try {
    const client = getClient();
    
    // Check if we should skip migrations (production mode or packaged)
    const skipMigrations = app.isPackaged || process.env.NODE_ENV === 'production';
    
    // Only run migrations in development
    if (!skipMigrations) {
      // Run database migrations in development
      console.log("Running database migrations...");
      const migrationsPath = path.resolve(process.cwd(), "drizzle/migrations");
      console.log("Using migrations path:", migrationsPath);
      await migrate(client, { migrationsFolder: migrationsPath });
      console.log("Database migrations completed");
    } else {
      console.log("Skipping migrations in production - using pre-built database");
    }

    // Now set up default settings
    const existingSettings = await getSettings();
    const existingSettingNames = new Set(existingSettings.map(s => s.setting));

    for (const defaultSetting of defaultSettings) {
      if (!existingSettingNames.has(defaultSetting.setting)) {
        try {
          const parsedSetting = settingsInsertSchema.parse(defaultSetting);
          await createSetting(parsedSetting);
          console.log(`Created setting: ${defaultSetting.setting}`);
        } catch (error) {
          console.error(`Error creating setting ${defaultSetting.setting}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error during database setup:", error);
  }
};


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
  
  // Check if we should use local files instead of dev server
  // You can set NODE_ENV=production to test local file loading in development
  const useLocalFiles = app.isPackaged || process.env.NODE_ENV === 'production';
  
  // Only wait for server if we're in development mode and using dev server
  if (!useLocalFiles) {
    await waitForServer("http://localhost:3000");
  }

  const preloadPath = path.join(__dirname, "preload.js");
  console.log("Using preload path:", preloadPath);


  await setupDefaultSettings();


  const mainWindow = new BrowserWindow({
    width: 400,
    height: 900,
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: false,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true, // For simplicity, not recommended for production
      webSecurity: false, // Allow custom drag regions
    },
  });
  mainWindow.setMenu(null);

  let dragStartPosition: number[] | null = null;

  if (useLocalFiles) {
    // Load the index.html file from the built Next.js app
    const indexPath = app.isPackaged 
      ? path.join(__dirname, "../app/index.html")
      : path.join(process.cwd(), "apps/next/out/index.html");
    console.log("Loading local file:", indexPath);
    
    // Set up protocol handler for loading Next.js assets
    mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
      event.preventDefault();
    });
    
    // Intercept requests to serve static files correctly
    mainWindow.webContents.session.protocol.interceptFileProtocol('file', (request, callback) => {
      const url = request.url.substr(7); // Remove 'file://' prefix
      
      // Handle Next.js static assets
      if (url.includes('_next/static')) {
        const relativePath = url.split('_next/static')[1];
        const staticPath = app.isPackaged 
          ? path.join(__dirname, "../app/_next/static", relativePath)
          : path.join(process.cwd(), "apps/next/out/_next/static", relativePath);
        callback({ path: staticPath });
      } else {
        callback({ path: url });
      }
    });
    
    mainWindow.loadFile(indexPath).catch((err: unknown) => {
      console.error("Failed to load index.html:", err);
    });
    // Temporarily enable dev tools to debug the loading issue
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    // Load the index.html file from the development environment
    mainWindow
      .loadURL("http://localhost:3000")
      .catch((err: unknown) => console.error(err));
    // Only open dev tools in development mode
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  noteHandles.setup();
  taskHandles.setup();
  subtaskHandles.setup();
  settingsHandles.setup();

  ipcMain.handle("close-window", () => {
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

  ipcMain.handle("set-always-on-top", (event, alwaysOnTop: boolean) => {
    mainWindow.setAlwaysOnTop(alwaysOnTop);
    return alwaysOnTop;
  });

  ipcMain.handle("enable-drag", (event, enable: boolean) => {
    if (enable) {
      mainWindow.setMovable(true);
    }
    return enable;
  });

  ipcMain.handle("move-window", (event, { deltaX, deltaY }) => {
    // Get the window position when drag started
    if (!dragStartPosition) {
      dragStartPosition = mainWindow.getPosition();
    }
    
    // Set absolute position based on start position + total delta
    const [startX, startY] = dragStartPosition;
    mainWindow.setPosition(startX + deltaX, startY + deltaY);
  });

  ipcMain.handle("start-drag", () => {
    // Store the current window position as drag start
    dragStartPosition = mainWindow.getPosition();
  });

  ipcMain.handle("end-drag", () => {
    // Clear the drag start position
    dragStartPosition = null;
  });

  ipcMain.handle("get-window-position", () => {
    const [x, y] = mainWindow.getPosition();
    return { x, y };
  });

  ipcMain.handle("set-window-position", (event, { x, y }) => {
    mainWindow.setPosition(x, y);
  });

};

app
  .whenReady()
  .then(createWindow)
  .catch((err: unknown) => {
    console.error("Failed to create window:", err);
  });
