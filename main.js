const electron = require('electron');
const url = require('url');
const path = require('path');
require('electron-reload')(__dirname);

const { app, BrowserWindow, ipcMain } = electron;
process.env.NODE_ENV = 'production';

var mainWindow;

app.on('ready', function(){
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      devTools: false
    }
  })
  mainWindow.setMenuBarVisibility(false)
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function(){
    app.quit();
  });
})

ipcMain.on('pics_dir_init', function(){
  mainWindow.webContents.send('pics_dir', app.getPath('pictures'));
})