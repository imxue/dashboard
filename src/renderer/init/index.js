import { getAllPcConfigs } from '../api/client'
import store from '../store/index'

import alert from '../utils/alert'
store.dispatch('GetbarInfo').catch((e) => {
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
  }, 900000)
}

setTimeout(() => {
  start()
}, 2000)
