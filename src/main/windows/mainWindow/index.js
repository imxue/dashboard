import { BrowserWindow } from 'electron'

class MainWindow {
  constructor (win) {
    this.win = win
  }
  initPage () {
    const winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:9080`
      : `file://${__dirname}/index.html`

    this.win.loadURL(winURL)
  }
  createWindow () {
    console.log(__static)
    if (!this.win) {
      this.win = new BrowserWindow({
        width: 1100,
        height: 770,
        minWidth: 1100,
        minHeight: 770,
        show: false,
        backgroundColor: '#F5F7F9',
        webPreferences: {
        // 设为false允许跨域
          webSecurity: false,
          nodeIntegration: true
        },
        // eslint-disable-next-line no-undef
        icon: `${__static}/x.png`,
        frame: true
      })
      this.win.maximize()
      this.win.once('ready-to-show', () => {
        this.win.show()
      })
      this.win.on('closed', () => {
        this.win = null
      })
    }
    this.initPage()
  }
}
export default MainWindow
