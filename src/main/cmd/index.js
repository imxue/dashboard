import { app } from 'electron'
const exec = require('child_process').exec
const path = require('path')
export function start (obj) {
  // 任何你期望执行的cmd命令，ls都可以
  let cmdPath = ''
  let cmdStr = ''

  let resp = null
  // 子进程名称
  if (obj.mount) {
    cmdStr = obj.mount
    cmdPath = process.env.NODE_ENV === 'development' ? path.resolve(__dirname, '../../../cmd/kxmount') : path.resolve(app.getAppPath(), '../cmd/kxmount')
    console.log(cmdPath)
  } else if (obj.update) {
    // 更新程序
    cmdStr = `${obj.update}`
    cmdPath = process.env.NODE_ENV === 'development' ? path.resolve(__dirname, '../../../cmd/Update') : path.resolve(app.getAppPath(), '../cmd/Update')
  } else if (obj.ip && obj.password) {
    cmdStr = `tvnviewer ${obj.ip}::5900 -password=${obj.password}`
    cmdPath = process.env.NODE_ENV === 'development' ? path.resolve(__dirname, '../../../cmd/') : path.resolve(app.getAppPath(), '../cmd/')
  }
  return new Promise((resolve, reject) => {
    exec(cmdStr, { cwd: cmdPath }, (error, stdout, stderr) => {
      console.log(error)
      if (error) {
        resp = error
      }
      resolve(resp)
    })
  })
}
