import { ipcMain } from 'electron'
import { start } from './cmd/index'

ipcMain.on('cmd', async (e, arg) => {
  let resp = await start(arg)
  e.reply('cmd', resp)
})
