import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/index'
import gamemanagement from './GameManagement'
import clienmanagement from './ClienManagement'
import diskmanagement from './DiskManagement'
import { login, enroll, login1, login2, login3, all } from './others'
// import Layout from '@/views/layout/index'

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
    login,
    enroll,
    login1,
    login2,
    login3,
    all
  ]
})
