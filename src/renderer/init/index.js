import { getAllPcConfigs } from '../api/client'
import store from '../store/index'
getAllPcConfigs()
function init () {
  // 获取客户机变动
  getAllPcConfigs().then(res => {
    // res.data.data.forEach(item => {
    //   if (item.config_state === 1) {
    //     store.dispatch('SAVEHardwareInformation', 'HardwareInformation')
    //     return ''
    //   }
    // })
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
  }, 1000)
}

setTimeout(() => {
  start()
}, 2000)
