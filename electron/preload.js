const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  showMessage: (msg) => ipcRenderer.send("dialog:message", msg),
  addFolder: () => ipcRenderer.invoke("folder:add"),
  removeFolder: (path) => ipcRenderer.invoke("folder:remove", path),
  saveConfig: (config) => ipcRenderer.send("save-config", config),
  restart: () => ipcRenderer.send("restart"),
  onInit: (callback) => ipcRenderer.on("init", callback),
  getStatus: () => ipcRenderer.invoke("status:get"),
  onStatusChange: (callback) => ipcRenderer.on("status:change", callback),
  scan: () => ipcRenderer.send("scan"),
  hide: () => ipcRenderer.send("hide"),
  shutDown: () => ipcRenderer.send("shut-down"),
});
