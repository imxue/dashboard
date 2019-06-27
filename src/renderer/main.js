import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import moment from 'moment'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

import './router/Hook'
// import '../language'
import i18n from '../language'
import '../renderer/components/test'

Vue.use(iView)

Vue.use(moment)

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  i18n,
  router,
  store,
  template: '<App/>',
  components: { App }
}).$mount('#app')
