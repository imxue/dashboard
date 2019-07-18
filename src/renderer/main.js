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
/* eslint-disable no-new */

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(lodash)
Vue.prototype.$lodash = lodash

// if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  lodash,
  store,
  render: h => h(App)
}).$mount('#app')
