import { getAllPcConfigs } from '../api/client'
import store from '../store/index'
getAllPcConfigs()
function init () {
  // 获取客户机变动
  getAllPcConfigs().then(res => {
    let changeClient = res.data.data.filter(item => {
      return item.config_state === 1
    })
    store.dispatch('SAVEHardwareInformation', changeClient)
  })
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
