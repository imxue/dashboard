import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import moment from 'moment'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './router/Hook'

Vue.use(iView)
Vue.use(moment)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
// axios.defaults.baseURL = 'http://10.30.11.6:8080'
// axios.defaults.baseURL = 'http://10.30.18.62:1010'
// axios.defaults.baseURL = 'http://10.88.66.10:13302/jsonrpc'
axios.defaults.baseUR = 'http://121.43.179.220:13302/jsonrpc'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
