const { fork } = require("child_process");
const path = require("path");
const fs = require("fs/promises");
const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
const {
  readConfig,
  saveConfig,
  addFolder,
  removeFolder,
} = require("../shared/config");

let server_process;
let scan_process;
let status = {
  server: "",
  scanner: "",
};

function startServer(win) {
  server_process = fork(path.join(__dirname, "../scripts/serve.js"));
  server_process.on("message", (value) => {
    status.server = value;
    win.webContents.send("status:change", status);
  });
}

function restartServer(win) {
  server_process.kill("SIGINT");
  startServer(win);
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (process.env.DEV_MODE) {
    win.loadURL("http://localhost:8080");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "render/index.html"));
  }

  return win;
};

async function createStorageFolder() {
  await fs.mkdir(path.join(__dirname, "../storage/logs"), { recursive: true });
  await fs.mkdir(path.join(__dirname, "../storage/images/albums"), {
    recursive: true,
  });
}

app.whenReady().then(async () => {
  await createStorageFolder();
  const config = await readConfig();
  const mainWin = createWindow();

  ipcMain.on("open-log", () => {
    shell.openPath(path.resolve(__dirname, "../storage/logs/melomano.log"));
  });

  ipcMain.handle("folder:add", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWin, {
      properties: ["openDirectory"],
    });

    if (canceled) {
      return;
    } else {
      await addFolder(filePaths[0]);
      return filePaths[0];
    }
  });

  ipcMain.handle("folder:remove", async (_e, path) => removeFolder(path));

  ipcMain.on("save-config", async (_e, config) => {
    await saveConfig(config);
    return restartServer(mainWin);
  });

  ipcMain.on("restart", async () => restartServer(mainWin));

  ipcMain.on("scan", async () => {
    scan_process = fork(path.join(__dirname, "../scripts/scan.js"));

    scan_process.on("message", (value) => {
      status.scanner = value;
      mainWin.webContents.send("status:change", status);
    });
  });

  ipcMain.handle("status:get", async () => status);

  ipcMain.on("dialog:message", async (_e, msg) =>
    dialog.showMessageBox(mainWin, {
      message: msg,
      type: "info",
    })
  );

  ipcMain.on("shut-down", async () => app.quit());

  mainWin.once("ready-to-show", () => {
    startServer(mainWin);
    mainWin.webContents.send("init", config);
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
