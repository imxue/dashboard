
import iView from 'iview'

let ipcRenderer = require('electron').ipcRenderer

iView.LoadingBar.config({
  color: '#5cb85c',
  failedColor: '#f0ad4e',
  height: 5
})
ipcRenderer.on('start', (event, arg) => {
  iView.LoadingBar.start(0)
})
ipcRenderer.on('progress', (event, arg) => {
  iView.LoadingBar.update(arg)
})
ipcRenderer.on('end', (event, arg) => {
  iView.LoadingBar.finish()
})
ipcRenderer.on('error', (event, arg) => {
  iView.LoadingBar.error()
})
