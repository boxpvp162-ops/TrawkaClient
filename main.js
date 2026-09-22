const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
const { Client, Auth } = require("msmc");
const { Client: MCLC } = require("minecraft-launcher-core");
const { autoUpdater } = require("electron-updater");

let win;
let account = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1180, height: 760, minWidth: 900, minHeight: 620,
    backgroundColor: "#090812",
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, nodeIntegration: false }
  });
  win.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
  createWindow();
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify().catch(() => {});
  }
});

ipcMain.handle("login-microsoft", async () => {
  try {
    const auth = new Auth("select_account");
    const xbox = await auth.launch("raw");
    const token = await xbox.getMinecraft();
    account = token.mclc();
    return { ok:true, name:account.name, uuid:account.uuid,
      skin:`https://mc-heads.net/avatar/${account.uuid}/128` };
  } catch (e) {
    return { ok:false, error:String(e.message || e) };
  }
});

ipcMain.handle("logout", () => { account=null; return true; });

ipcMain.handle("launch", async (_, opts) => {
  if (!account) return {ok:false,error:"Najpierw zaloguj konto Microsoft."};
  try {
    const launcher = new MCLC();
    const ram = Number(opts.ram || 4096);
    const version = opts.version || "1.21.4";
    await launcher.launch({
      authorization: account,
      root: path.join(app.getPath("appData"), "TrawkaLauncher", "minecraft"),
      version: { number: version, type: "release" },
      memory: { max: `${ram}M`, min: "1024M" },
      javaPath: undefined
    });
    return {ok:true};
  } catch(e) {
    return {ok:false,error:String(e.message || e)};
  }
});

ipcMain.handle("open-folder", () => {
  shell.openPath(path.join(app.getPath("appData"), "TrawkaLauncher"));
});

ipcMain.handle("app-version", () => app.getVersion());

ipcMain.on("update-download", () => autoUpdater.downloadUpdate().catch(()=>{}));

autoUpdater.on("update-available", () => win?.webContents.send("update-status","Dostępna aktualizacja."));
autoUpdater.on("update-downloaded", () => win?.webContents.send("update-status","Aktualizacja pobrana. Zostanie zainstalowana po ponownym uruchomieniu."));
