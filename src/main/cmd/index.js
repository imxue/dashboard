const exec = require('child_process').exec
// const path = require('path')
export function start (obj) {
  // 任何你期望执行的cmd命令，ls都可以
  let cmdStr1 = `tvnviewer ${obj.ip}::5900 -password=${obj.password}`
  // let cmdPath = path.resolve(app.getAppPath(), '../cmd/')
  let cmdPath = 'G:\\2019Task\\dashBoard\\cmd'
  console.log(cmdPath)
  // 子进程名称
  let workerProcess
  runExec(cmdStr1)
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
