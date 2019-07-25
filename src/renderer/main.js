import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// import './router/Hook'
import i18n from './locale'
// import '../renderer/components/test'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

import lodash from 'lodash'

import alert from './utils/alert'
import './router/Hook'
/* eslint-disable no-new */

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(lodash)
Vue.prototype.$lodash = lodash

Object.keys(alert).forEach(item => {
  Vue.prototype[item] = alert[item]
})

Vue.config.productionTip = false
new Vue({
  i18n,
  router,
  lodash,
  store,
  render: h => h(App)
}).$mount('#app')
