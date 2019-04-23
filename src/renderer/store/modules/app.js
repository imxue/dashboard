const state = {
  masterip: ''
}

const mutations = {
  SAVE_Master_IP (state, masterip) {
    state.masterip = masterip
  }

}

const actions = {
  saveMaster ({ commit }, masterip) {
    // do something async
    commit('SAVE_Master_IP', masterip)
  }
}

export default {
  state,
  mutations,
  actions
}
