'use strict'

import { app, BrowserWindow, dialog } from 'electron'

const log = require('electron-log')
const { autoUpdater } = require('electron-updater')
let lang = app.getLocale()
app.commandLine.appendSwitch('lang', lang)
autoUpdater.autoDownload = false
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
function sendStatusToWindow (text) {
  log.info(text)
  if (win) {
    win.webContents.send('message', text)
  }
}

let win
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
    width: 1400,
    webPreferences: { webSecurity: false }
  })
  // mainWindow.webContents.openDevTools()
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: '更新提示',
    message: '有更新',
    buttons: ['Yes', 'No']
  }, (index) => {
    if (index === 0) {
      autoUpdater.downloadUpdate()
      mainWindow.webContents.send('start', 'start')
    }
  })
  sendStatusToWindow('Update available.')
})

autoUpdater.on('error', (err) => {
  dialog.showErrorBox('An Error Message', '' + err)
  mainWindow.webContents.send('error', 'error')
})
autoUpdater.on('download-progress', (progressObj) => {
  mainWindow.webContents.send('progress', progressObj.percent)
  // let logMessage = 'Download speed: ' + progressObj.bytesPerSecond
  // logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%'
  // logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  // sendStatusToWindow(logMessage)
})
autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('end', 'end')
  dialog.showMessageBox({
    type: 'info',
    title: 'Information',
    message: '立即安装',
    buttons: ['Yes', 'No']
  }, (index) => {
    if (index === 0) {
      autoUpdater.quitAndInstall()
    }
  })
})

app.on('ready', function () {
  createWindow()
  let lang = app.getLocale()
  app.commandLine.appendSwitch('lang', lang)
  autoUpdater.checkForUpdatesAndNotify()
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
