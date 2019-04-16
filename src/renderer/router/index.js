import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/index'
import gamemanagement from './GameManagement'
import clienmanagement from './ClienManagement'
import diskmanagement from './DiskManagement'
import { login1, login2, login3, all } from './others'
// import Layout from '@/views/layout/index'

Vue.use(Router)

// 使用说明
// 分类分为3层，一级分类，二级分类，三级分类
// 一级分类组件为 Layout，二级分类组件为 NullLayout，已确保嵌套正常显示
// 一级分类 hidden: true，可以不在一级分类里显示出来

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
    login1,
    login2,
    login3,
    all
  ]
})
