'use strict'

import { app, BrowserWindow } from 'electron'
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')

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
  log.info('App starting...')
  mainWindow = new BrowserWindow({
    height: 900,
    useContentSize: true,
    width: 1500,

    webPreferences: { webSecurity: false }
  })
  mainWindow.webContents.openDevTools()
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
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
function sendStatusToWindow (text) {
  log.info(text)
  mainWindow.webContents.send('message', text)
}
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
log.info('App starting...')
app.on('ready', function () {
  autoUpdater.checkForUpdatesAndNotify()
})
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})
autoUpdater.on('update-downloaded', () => {
  sendStatusToWindow('Update downloaded')
  autoUpdater.quitAndInstall()
})
