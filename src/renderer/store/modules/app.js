import { getNetCafe } from '../../api/login'
import { GetRegInfo } from '../../api/wupan'
import { getMasterIp, setValue } from '@/api/common'
const state = {
  masterip: '',
  barinfo: null,
  netWork: {
    ip: '127.0.0.1',
    port: '12880'
  },
  RegInfo: {},
  HardwareInformation: '',
  fileName: '' // 选中的文件
}
const mutations = {
  SAVE_Master_IP (state, masterip) {
    state.masterip = masterip
  },
  SAVE_BAR_info (state, barinfo) {
    state.barinfo = barinfo
  },
  SAVE_REG_INFO (state, reginfo) {
    state.RegInfo = reginfo
  },
  SAVE_HardwareInformation (state, flag) {
    state.HardwareInformation = flag
  },
  SAVE_fileName (state, name) {
    state.fileName = name
  }

}
const actions = {
  saveMaster ({ commit }, masterip) {
    // do something async
    commit('SAVE_Master_IP', masterip)
  },
  SAVEHardwareInformation ({ commit }, flag) {
    // do something async
    commit('SAVE_HardwareInformation', flag)
  },
  saveBarInfo ({ commit }, barinfo) {
    // do something async
    commit('SAVE_BAR_info', barinfo)
  },
  savefileName ({ commit }, name) {
    // do something async
    commit('SAVE_fileName', name)
  },
  GetbarInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getNetCafe()
        .then(response => {
          commit('SAVE_BAR_info', response.data)
          resolve(response)
        })
        .catch(e => {
          reject(e)
        })
    })
  },
  GetMasterip ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMasterIp()
        .then(response => {
          commit('SAVE_Master_IP', response.data.value)
          resolve(response)
        })
        .catch(e => {
          reject(e)
        })
    })
  },
  // 获取注册信息
  GetReg ({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.barinfo) {
        GetRegInfo(state.barinfo.bar_id + '', state.masterip)
          .then(response => {
            commit('SAVE_REG_INFO', response.data.value)
            resolve(response)
          })
          .catch(e => {
            reject(e)
          })
      }
    })
  },
  SetMasterip ({ commit, state }) {
    return new Promise((resolve, reject) => {
      setValue({ key: 'master', value: state.masterip })
        .then(response => {
          resolve()
        })
        .catch(e => {
          reject(e)
        })
    })
  },
  savereginfo ({ commit, state }, reginfo) {
    commit('SAVE_REG_INFO', reginfo)
  }
}
export default {
  state,
  mutations,
  actions
}
