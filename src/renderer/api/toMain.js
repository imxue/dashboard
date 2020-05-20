const { ipcRenderer } = require('electron')

export function toRemote (args) {
  try {
    ipcRenderer.send('cmd', args)
  } catch (error) {
    console.log(error)
  }
  ipcRenderer.on('cmd', (event, arg) => {
    return arg
  })
}
