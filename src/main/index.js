'use strict'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
// import './ipc'
import { start } from './cmd/index'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 500,
    width: 1300,
    minWidth: 1300,
    minHeight: 500,
    backgroundColor: '#F5F7F9',
    webPreferences: { webSecurity: false }
  })
  // mainWindow.webContents.openDevTools()
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

app.on('ready', function () {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
ipcMain.on('restart', () => {
  app.relaunch()
  app.exit(0)
})

ipcMain.on('cmd', (e, arg) => {
  start(arg)
  e.returnValue = ''
})
ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, (files) => {
    if (files) {
      // event.sender.send('selected-directory', files)
      event.returnValue = files
    } else {
      event.returnValue = ''
    }
  })
})
ipcMain.on('open-file', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: '*', extensions: ['json'] }
    ]
  }, (files) => {
    if (files) {
      event.returnValue = files
      event.sender.send('selected-file', files)
    } else {
      event.returnValue = ''
    }
  })
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 *
 */

// app.on('ready', function () {
//   autoUpdater.checkForUpdatesAndNotify()
// })
