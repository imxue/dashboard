import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import i18n from './locale'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
// import lodash from 'lodash'

import alert from './utils/alert'
import './router/Hook'
// import './init/index'
Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})

Object.keys(alert).forEach(item => {
  Vue.prototype[item] = alert[item]
})

Vue.config.productionTip = false
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
