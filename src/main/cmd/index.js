import { app } from 'electron'
const exec = require('child_process').exec
const path = require('path')
export function start (obj) {
  // 任何你期望执行的cmd命令，ls都可以
  let cmdPath = process.env.NODE_ENV === 'development' ? path.resolve(__dirname, '../../../cmd/') : path.resolve(app.getAppPath(), '../cmd/')
  let cmdPath2 = path.resolve(app.getAppPath(), '../cmd/kxmount')
  let cmdStr1 = ''
  let cmdStr2 = ''
  let cmdStr = ''
  if (obj.ip) {
    cmdStr1 = `tvnviewer ${obj.ip}::5900 -password=${obj.password}`
  } else if (obj.mount) {
    cmdStr2 = `${obj.mount}`
    cmdPath = cmdPath2
  }
  let resp = null
  // 子进程名称
  if (obj.mount) {
    cmdStr = cmdStr2
  } else {
    cmdStr = cmdStr1
  }
  return new Promise((resolve, reject) => {
    exec(cmdStr, { cwd: cmdPath }, (error, stdout, stderr) => {
      if (error) {
        resp = error
      }
      resolve(resp)
    })
  })
}
