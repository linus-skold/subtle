import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from 'node:url';
console.log("Starting Electron app...");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function waitForServer(url, retries = 20, delay = 500) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url);
            if (res.ok)
                return;
        }
        catch {
            console.error("Error fetching server");
        }
        await new Promise(r => setTimeout(r, delay));
    }
    throw new Error(`Server at ${url} not available after ${retries} attempts`);
}
const createWindow = async () => {
    console.log("Creating main window...");
    await waitForServer("http://localhost:3000");
    const mainWindow = new BrowserWindow({
        width: 400,
        height: 900,
        frame: false,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.resolve(__dirname, "preload.js"), // Adjust the path to your preload script
            nodeIntegration: false,
            contextIsolation: true, // For simplicity, not recommended for production
        },
    });
    mainWindow.setMenu(null);
    if (app.isPackaged) {
        // Load the index.html file from the packaged app
        // mainWindow.loadFile("index.html");
    }
    else {
        // Load the index.html file from the development environment
        mainWindow
            .loadURL("http://localhost:3000")
            .catch((err) => console.error(err)); // Adjust the URL as needed for your dev server
    }
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    ipcMain.on("message-from-ui", (event, msg) => {
        console.log("Message from UI:", msg);
        // You can handle messages from the UI here
        event.reply("message-from-main", `Received: ${msg}`);
    });
    // mainWindow.loadFile("index.html"); // Load your HTML file
};
app
    .whenReady()
    .then(createWindow)
    .catch((err) => {
    console.error("Failed to create window:", err);
});
//# sourceMappingURL=main.js.map