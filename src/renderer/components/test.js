
const { remote } = require('electron')
const { Menu, MenuItem } = remote

const menu = new Menu()
menu.append(new MenuItem({ label: 'MenuItem1', click (e) { console.log(e) } }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))

window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  console.log(e)
  menu.popup({ window: remote.getCurrentWindow() })
}, false)
