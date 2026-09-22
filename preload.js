const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("api", {
  login: () => ipcRenderer.invoke("login-microsoft"),
  logout: () => ipcRenderer.invoke("logout"),
  launch: (opts) => ipcRenderer.invoke("launch", opts),
  openFolder: () => ipcRenderer.invoke("open-folder"),
  version: () => ipcRenderer.invoke("app-version"),
  onUpdate: (cb) => ipcRenderer.on("update-status", (_, msg) => cb(msg))
});
