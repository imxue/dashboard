import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/index'
import NullLayout from '@/views/layout/null'
// import Layout from '@/views/layout/index'

Vue.use(Router)

// 使用说明
// 分类分为3层，一级分类，二级分类，三级分类
// 一级分类组件为 Layout，二级分类组件为 NullLayout，已确保嵌套正常显示
// 一级分类 hidden: true，可以不在一级分类里显示出来

export default new Router({
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index')
    },
    {
      path: '/login/login',
      component: () => import('@/views/login/login')
    },
    {
      path: '/login/reset',
      component: () => import('@/views/login/reset')
    },
    // {
    //   path: 'subtype1-1-download',
    //   component: () => import('@/views/game/type1/subType1/subtype1-1-download'),
    //   hidden: true
    // },
    {
      path: '/404',
      component: () => import('@/views/404'),
      hidden: true
    },
    {
      path: '/',
      name: 'home',
      redirect: '/type2',
      component: Layout,
      hidden: true
    },
    {
      path: '/type2',
      name: '2',
      component: Layout,
      redirect: '/type2/subType1/subType1-1',
      meta: { title: '无盘管理', icon: 'example' },
      children: [
        {
          path: 'subType1',
          name: 'type2-SubType1',
          meta: { title: '无盘服务器', hidden: true },
          component: NullLayout,
          children: [
            {
              path: 'subType1-1',
              name: 'type2-SubType1-1',
              meta: { title: '无盘服务器列表' },
              component: () => import('@/views/type2/subtype1/subtype1-1')
            },
            {
              path: 'subType1-add',
              name: 'type2-SubType1-add',
              meta: { title: '添加' },
              component: () => import('@/views/type2/subtype1/subtype1-add'),
              hidden: true
            },
            {
              path: 'subType1-detail',
              name: 'type2-SubType1-detail',
              meta: { title: '查看详情' },
              component: () => import('@/views/type2/subtype1/subtype1-detail'),
              hidden: true
            }
          ]
        },
        {
          path: 'subType2',
          name: 'type2-SubType2-1',
          meta: { title: '镜像管理', hidden: true },
          component: NullLayout,
          children: [
            {
              path: 'subType2-1',
              name: 'type2-SubType2-1',
              meta: { title: '全部镜像' },
              component: () => import('@/views/type2/subtype2/subtype2-1')
            },
            {
              path: 'subType2-set',
              name: 'type2-SubsubType2Type1-set',
              meta: { title: '配置点' },
              component: () => import('@/views/type2/subtype2/subtype2-set'),
              hidden: true
            }
          ]
        },
        {
          path: 'subType3',
          name: 'type2-SubType3',
          meta: { title: '客户机启动', hidden: true },
          component: NullLayout,
          children: [
            {
              path: 'subType3-1',
              name: 'type2-SubType3-1',
              meta: { title: '全部方案' },
              component: () => import('@/views/type2/subtype3/subtype3-1')
            },
            {
              path: 'subType3-2',
              name: 'DPCP配置',
              meta: { title: 'DPCP配置' },
              component: () => import('@/views/type2/subtype3/dpcp')
            },
            {
              path: 'subType3-edit',
              name: 'type2-SubType3-edit',
              meta: { title: '方案编辑' },
              component: () => import('@/views/type2/subtype3/subtype3-edit'),
              hidden: true
            }
          ]
        }
      ]
    },
    {
      path: '/type3',
      name: '3',
      component: Layout,
      redirect: '/type3/subType1/subType1-1',
      meta: { title: '客户机管理', icon: 'example' },
      children: [
        {
          path: 'subType1',
          name: 'type3-SubType1',
          meta: { title: '客户机管理', hidden: true },
          component: NullLayout,
          children: [
            {
              path: 'subType1-1',
              name: 'type3-SubType1-1',
              alias: '/disklesslist',
              meta: { title: '客户机列表' },
              component: () => import('@/views/type3/subtype1/subtype1-1')
            },
            {
              path: 'subType1-add',
              name: 'type3-SubType1-add',
              meta: { title: '添加客户机列表' },
              component: () => import('@/views/type3/subtype1/subtype1-add'),
              hidden: true
            }
          ]
        }
      ]
    },
    // {
    //   path: '/type4',
    //   name: '4',
    //   component: Layout,
    //   redirect: '/type4/subType1/subType1-1',
    //   meta: { title: '系统设置', icon: 'example' },
    //   children: [
    //     {
    //       path: 'subType1',
    //       name: 'type4-SubType1',
    //       meta: { title: '系统设置', hidden: true },
    //       component: NullLayout,
    //       children: [
    //         {
    //           path: 'subType1-1',
    //           name: 'type4-SubType1-1',
    //           meta: { title: '用户管理' },
    //           component: () => import('@/views/type4/subtype1/subtype1-1')
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ]
})
