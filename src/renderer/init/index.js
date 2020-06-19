import { getAllPcConfigs } from '../api/client'
import store from '../store/index'
import alert from '../utils/alert'
import fs from 'fs'
import path from 'path'
const { app } = require('electron').remote

store.dispatch('GetbarInfo').then((e) => {
}, (e) => {
  console.log(e)
}).catch((e) => {
  alert.notifyUserOfError('获取网吧信息失败')
})

function init () {
  // 获取客户机变动
  if (store.state.app.barinfo) {
    getAllPcConfigs().then(res => {
      let changeClient = res.data.data.filter(item => {
        return item.config_state === 1
      })
      store.dispatch('SAVEHardwareInformation', changeClient)
    }, () => {
      console.log('获取客户机变动失败')
    })
  }
}

function start () {
  init()
  setTimeout(() => {
    start()
  }, 250560000)
}
let p = process.env.NODE_ENV === 'development' ? path.join(app.getAppPath(), '../../../../../cmd/Update/version.dat') : path.join(app.getAppPath(), '../../../Update/version.dat')
fs.readFile(p, (_err, data) => {
  if (_err) {
    store.dispatch('propraminfo', null)
  } else {
    // eslint-disable-next-line no-new-func
    var propram = new Function('return ' + data.toString())()
    store.dispatch('propraminfo', propram)
  }
})

start()
