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
router.beforeEach((to, from, next) => {
  // 获取用户登录成功后储存的登录标志
  let getFlag = localStorage.getItem('Flag')
  // 如果登录标志存在且为isLogin，即用户已登录
  if (getFlag === 'isLogin') {
    // 设置vuex登录状态为已登录
    next()
    // 如果已登录，还想想进入登录注册界面，则定向回首页
    // if (!to.meta.isLogin) {
    //   // iViewUi友好提示
    //   iView.Message.error('请先退出登录')
    //   next({
    //     path: '/'
    //   })
    // }
  // 如果登录标志不存在，即未登录
  } else {
    // 用户想进入需要登录的页面，则定向回登录界面
    if (to.path !== '/login') {
      // console.log('0')
      // iViewUi友好提示
      iView.Message.info('请先登录')
      next({
        path: '/login'
      })
    } else {
      next()
    }
  }
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
