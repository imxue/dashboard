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
  RegInfo: {}
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
  }

}
const actions = {
  saveMaster ({ commit }, masterip) {
    // do something async
    commit('SAVE_Master_IP', masterip)
  },
  saveBarInfo ({ commit }, barinfo) {
    // do something async
    commit('SAVE_BAR_info', barinfo)
  },
  GetbarInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getNetCafe().then(response => {
        commit('SAVE_BAR_info', response.data)
        resolve(response)
      }).catch((e) => {
        reject(e)
      })
    })
  },
  GetMasterip ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMasterIp().then(response => {
        commit('SAVE_Master_IP', response.data.value)
        resolve(response)
      }).catch((e) => {
        reject(e)
      })
    })
  },
  // 获取注册信息
  GetReg ({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.barinfo) {
        GetRegInfo(state.barinfo.bar_id + '', state.masterip).then(response => {
          commit('SAVE_REG_INFO', response.data.value)
          resolve(response)
        }).catch((e) => {
          reject(e)
        })
      }
    })
  },
  SetMasterip ({ commit, state }) {
    return new Promise((resolve, reject) => {
      setValue({ key: 'master', value: state.masterip }).then(response => {
        resolve()
      }).catch((e) => {
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
