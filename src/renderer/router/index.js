import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/index'
import gamemanagement from './GameManagement'
import clienmanagement from './ClienManagement'
import diskmanagement from './DiskManagement'
import safeCenter from './SafeCenter'
import { login, enroll, login2, login3, all } from './others'
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/game',
      component: Layout,
      hidden: true
    },
    gamemanagement, // 游戏管理
    diskmanagement, // 无盘管理
    clienmanagement, // 客户机管理
    safeCenter,
    login,
    enroll,
    login2,
    login3,
    all
  ]
})
