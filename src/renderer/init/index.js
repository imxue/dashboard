import { getAllPcConfigs } from '../api/client'
import { GetRegInfo } from '../api/wupan'
import store from '../store/index'
import alert from '../utils/alert'
import fs from 'fs'
import path from 'path'
const { app } = require('electron').remote

// store.dispatch('GetbarInfo').then(async (barinfo) => {
//   let resp = await store.dispatch('GetMasterip')
//   if (resp.data.value) {
//     await GetRegInfo(barinfo.data.barid + '', resp.data.value)
//   }
// }).catch((e) => {
//   alert.notifyUserOfError('获取网吧信息失败')
// })

async function test () {
  try {
    let barinfo = await store.dispatch('GetbarInfo')
    let resp = await store.dispatch('GetMasterip')
    resp.data.value && await GetRegInfo(barinfo.data.bar_id + '', resp.data.value)
  } catch (error) {
    if (error === '硬件编码不一致') {
      alert.notifyUserOfError('请先去解绑')
    } else {
      alert.notifyUserOfError(error)
    }
  }
}

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
// 本地程序版本
export default function getLocalVersion () {
  let p = process.env.NODE_ENV === 'development' ? path.join(app.getAppPath(), '../../../../../cmd/Update/version.dat') : path.join(app.getAppPath(), '../../../version.dat')
  fs.readFile(p, (_err, data) => {
    if (_err) {
      store.dispatch('propraminfo', null)
    } else {
      // eslint-disable-next-line no-new-func
      var propram = new Function('return ' + data.toString())()
      store.dispatch('propraminfo', propram)
    }
  })
}
test()
start()
getLocalVersion()
