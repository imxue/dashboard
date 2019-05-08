'use strict'

import { app, BrowserWindow } from 'electron'

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

import { autoUpdater } from 'electron-updater'
const log = require('electron-log')
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
    height: 900,
    useContentSize: true,
    width: 1500,
    webPreferences: { webSecurity: false }
  })

  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
mainWindow.webContents.openDevTools()
app.on('ready', createWindow)

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
mainWindow.webContents.openDevTools()
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
autoUpdater.on('update-downloaded', () => {
  console.log('update-downloaded')
  autoUpdater.quitAndInstall()
})
autoUpdater.on('update-available', (info) => {
  console.log('update-available')
  sendStatusToWindow('Update available.')
})
