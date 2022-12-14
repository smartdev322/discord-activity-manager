import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { ActivityManager } from './Activity/ActivityManager';
import { SearchManager } from './Data/search';
import { Activities } from './types/activities';
import * as path from 'path';
import electronIsDev = require('electron-is-dev');
const Activity = new ActivityManager();
const Search = new SearchManager();

interface FuseItem {
  item: Activities.Activity;
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    height: 575,
    width: 600,
    minHeight: 575,
    minWidth: 550,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      devTools: electronIsDev ? true : false,
    },
  });

  // and load the index.html of the app.

  electronIsDev
    ? mainWindow.loadURL(`http://localhost:3000`)
    : mainWindow.loadFile(`${path.join(__dirname, './index.html')}`);

  // Open the DevTools.
  if (electronIsDev) mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Opens the window in an external window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

ipcMain.handle(
  'pt:broadcastStatus',
  async (_, activity: Activities.Activity): Promise<number> => {
    return Activity.activityLauncher(activity);
  }
);

ipcMain.handle(
  'pt:updateStatus',
  async (_, activity: Activities.Activity): Promise<number> => {
    return Activity.updateActivity(activity);
  }
);

ipcMain.handle('pt:disconnect', async (): Promise<void> => {
  Activity.disconnect();
});

ipcMain.handle(
  'pt:search',
  async (_, search: string): Promise<Array<FuseItem>> => {
    return Search.searchList(search);
  }
);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
