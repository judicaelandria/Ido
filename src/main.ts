import { BrowserWindow, nativeTheme, app } from "electron";
import { Menubar, menubar } from "menubar";

const width = 300;
const height = 400;

const index =
  process.env.VITE_DEV_SERVER_URL || `file://${__dirname}/../index.html`;
const icons = {
  dark: `./images/one-logo.png`,
  light: `./images/one-logo.png`,
};

const browserWindow = {
  transparent: true,
  width,
  height,
  alwaysOnTop: false,
  webPreferences: {
    preload: `${__dirname}/preload.js`,
  },
};

function start(): BrowserWindow | Menubar {
  if (process.env.DETACHED) {
    const win = new BrowserWindow({
      ...browserWindow,
      transparent: false,
    });
    win.loadURL(index);
    return win;
  } else {
    const mb = menubar({
      index,
      browserWindow,
      icon: nativeTheme.shouldUseDarkColors ? icons.dark : icons.light,
    });
    mb.on("ready", () => {
      mb.showWindow();
      // mb.window?.webContents.openDevTools();
    });
    return mb;
  }
}

let windowOrMenubar: BrowserWindow | Menubar | undefined;
let window: BrowserWindow | undefined;

app.on("ready", () => {
  windowOrMenubar = start();
  window =
    windowOrMenubar instanceof BrowserWindow
      ? windowOrMenubar
      : windowOrMenubar.window;
  // window?.webContents.openDevTools();
});

// dark mode
nativeTheme.addListener("updated", () => {
  if (windowOrMenubar instanceof Menubar) {
    windowOrMenubar.tray.setImage(
      nativeTheme.shouldUseDarkColors ? icons.dark : icons.light
    );
  }
});

export {};
