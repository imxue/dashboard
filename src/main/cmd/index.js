import { app } from 'electron'
const exec = require('child_process').exec
const path = require('path')
export function start (obj) {
  // 任何你期望执行的cmd命令，ls都可以
  let cmdPath = path.resolve(app.getAppPath(), '../cmd/')
  let cmdPath2 = path.resolve(app.getAppPath(), '../cmd/kxmount')
  let cmdStr1 = ''
  let cmdStr2 = ''
  if (obj.ip) {
    cmdStr1 = `tvnviewer ${obj.ip}::5900 -password=${obj.password}`
  } else if (obj.mount) {
    cmdStr2 = `${obj.mount}`
    cmdPath = cmdPath2
  }

  // 子进程名称
  let workerProcess
  if (obj.mount) {
    runExec(cmdStr2)
  } else {
    runExec(cmdStr1)
  }
  function runExec (cmdStr) {
    workerProcess = exec(cmdStr, { cwd: cmdPath })
    // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data', function (data) {
      console.log('norma' + data)
      console.log('stdout: ' + data)
    })
    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', function (data) {
      console.log('stderr: ' + data)
    })
    // 退出之后的输出
    workerProcess.on('close', function (code) {
      console.log('error' + code)
      console.log('out code：' + code)
    })
  }
}
