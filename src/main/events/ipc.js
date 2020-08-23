// import { ipcMain, dialog } from 'electron'

import { start } from '../cmd/index'
import { ipcMain, app } from 'electron'

class IpcEvents {
  create (appManager) {
    this.appManager = appManager

    ipcMain.on('restart', () => {
      app.relaunch()
      app.exit(0)
    })

    ipcMain.on('cmd', (e, arg) => {
      let x = start(arg)
      e.returnValue = x
    })
  }
}

export default new IpcEvents()
