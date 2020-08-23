import { app } from 'electron'

class AppEvent {
  // constructor () {
  // // this.development = process.env.NODE_ENV !== 'production'

  // }

  create (appManager) {
    const windowManager = appManager.windowManager
    const exits = app.makeSingleInstance(() => {
      windowManager.mainWindow.win.focus()
    })

    if (exits) {
      app.quit()
    } else {
      app.on('ready', async () => {
        appManager.initApp()
      })
    }

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
    app.on('activate', () => {
      if (windowManager.mainWindow.win === null) {
        appManager.initApp()
      }
    })
  }
}

export default new AppEvent()
