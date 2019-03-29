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
      redirect: '/game/subType1/subType1-1',
      component: Layout,
      hidden: true
    },
    {
      path: '/game',
      name: '1',
      component: Layout,
      redirect: '/game/subType1/subType1-1',
      meta: { title: '游戏管理', icon: 'example' },
      children: [
        {
          path: 'subType1',
          name: 'type1-SubType1',
          meta: { title: '中心资源', hidden: true },
          component: NullLayout,
          children: [
            {
              path: 'subType1-1',
              name: 'SubType1-1',
              meta: { title: '全部游戏' },
              component: () => import('@/views/type1/subtype1/subtype1-1')
            },
            {
              path: 'subType1-2',
              name: 'SubType1-2',
              meta: { title: '今日更新' },
              component: () => import('@/views/type1/subtype1/subtype1-2')
            },
            {
              path: 'subType1-3',
              name: 'SubType1-3',
              meta: { title: '系统工具' },
              component: () => import('@/views/type1/subtype1/subtype1-3')
            },
            {
              path: 'subType1-4',
              name: 'SubType1-4',
              meta: { title: '停服资源' },
              component: () => import('@/views/type1/subtype1/subtype1-4')
            },
            // {
            //   path: 'subType1-5',
            //   name: 'SubType1-5',
            //   meta: { title: '下载资源' },
            //   component: () => import('@/views/type1/subtype1/subtype1-5')
            // },
            {
              path: 'subType1-download',
              name: 'subType1-download',
              meta: { title: '下载', hidden: true },
              // showBtn: true,
              component: () => import('@/views/type1/subtype1/subtype1-download'),
              hidden: true
            },
            {
              path: 'subType1-remove',
              name: 'subType1-remove',
              meta: { title: '本地移除', hidden: true },
              // showBtn: true,
              component: () => import('@/views/type1/subtype1/subtype1-remove'),
              hidden: true
            }
            // {
            //   path: 'subtype1-2-download',
            //   name: 'subtype1-2-download',
            //   meta: { title: '下载2', hidden: true },
            //   component: () => import('@/views/type1/subtype1/subtype1-2-download'),
            //   hidden: true
            // }
          ]
        },
        {
          path: 'subType2',
          name: 'type1-SubType2',
          meta: { title: '资源下载', hidden: true },
          component: NullLayout,
          children: [
            {
              path: 'subType2-1',
              name: 'type1-SubType2-1',
              meta: { title: '下载队列' },
              component: () => import('@/views/type1/subtype2/subtype2-1')
            },
            {
              path: 'subType2-2',
              name: 'type1-SubType2-2',
              meta: { title: '下载日志' },
              component: () => import('@/views/type1/subtype2/subtype2-2')
            },
            {
              path: 'subType2-set',
              name: 'subType2-set',
              meta: { title: '下载设置', hidden: true },
              component: () => import('@/views/type1/subtype2/subtype2-set'),
              hidden: true
            }
          ]
        },
        {
          path: 'subType3',
          name: 'type1-SubType3',
          meta: { title: '本地资源', hidden: true },
          component: NullLayout,
          children: [
            {
              path: 'SubType3-1',
              name: 'type1-SubType3-1',
              meta: { title: '已下载游戏' },
              component: () => import('@/views/type1/subtype3/subtype3-1')
            },
            {
              path: 'SubType3-2',
              name: 'type1-SubType3-2',
              meta: { title: '本吧游戏' },
              component: () => import('@/views/type1/subtype3/subtype3-2')
            },
            {
              path: 'SubType3-1-add',
              name: 'type1-SubType3-1-add',
              meta: { title: '添加', hidden: true },
              component: () => import('@/views/type1/subtype3/subtype3-1-add'),
              hidden: true
            },
            {
              path: 'SubType3-1-edit',
              name: 'type1-SubType3-1-edit',
              meta: { title: '编辑', hidden: true },
              component: () => import('@/views/type1/subtype3/subtype3-1-edit'),
              hidden: true
            },
            {
              path: 'SubType3-1-fix',
              name: 'type1-SubType3-1-fix',
              meta: { title: '修复', hidden: true },
              component: () => import('@/views/type1/subtype3/subtype3-1-fix'),
              hidden: true
            },
            {
              path: 'SubType3-1-more',
              name: 'type1-SubType3-1-more',
              meta: { title: '批量操作', hidden: true },
              component: () => import('@/views/type1/subtype3/subtype3-1-more'),
              hidden: true
            },
            {
              path: 'SubType3-2-add',
              name: 'type1-SubType3-add',
              meta: { title: '添加', hidden: true },
              component: () => import('@/views/type1/subtype3/subtype3-2-add'),
              hidden: true
            },
            {
              path: 'SubType3-2-edit',
              name: 'type1-SubType3-edit',
              meta: { title: '编辑', hidden: true },
              component: () => import('@/views/type1/subtype3/subtype3-2-edit'),
              hidden: true
            },
            {
              path: 'SubType3-delete',
              name: 'type1-SubType3-delete',
              meta: { title: '编辑', hidden: true },
              component: () => import('@/views/type1/subtype3/subtype3-delete'),
              hidden: true
            }
          ]
        },
        {
          path: 'subType4',
          name: 'type1-SubType4',
          meta: { title: '同步管理', hidden: true },
          component: NullLayout,
          children: [
            {
              path: 'SubType4-1',
              name: 'type1-SubType4-1',
              meta: { title: '服务器同步设置' },
              component: () => import('@/views/type1/subtype4/subtype4-1')
            },
            {
              path: 'SubType4-2',
              name: 'type1-SubType4-2',
              meta: { title: '同步任务' },
              component: () => import('@/views/type1/subtype4/subtype4-2')
            },
            {
              path: 'SubType4-3',
              name: 'type1-SubType4-3',
              meta: { title: '同步日志' },
              component: () => import('@/views/type1/subtype4/subtype4-3')
            },
            {
              path: 'SubType4-allowe',
              name: 'type1-SubType4-allowe',
              meta: { title: '默认分配规则', hidden: true },
              component: () => import('@/views/type1/subtype4/subtype4-allowe'),
              hidden: true
            }
          ]
        }
      ]
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
              alias: '/allPlan',
              component: () => import('@/views/type2/subtype3/subtype3-1')
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
        },
        {
          path: 'subType2',
          name: 'type3-SubType1',
          meta: { title: '客户机设置', hidden: true },
          component: NullLayout,
          children: [
            {
              path: 'subType2-1',
              name: 'type3-SubType1-1',
              meta: { title: '菜单设置' },
              component: () => import('@/views/type3/subtype1/subtype1-2')
            },
            {
              path: 'subType2-2',
              name: 'type3-SubType1-2',
              meta: { title: '桌面图标' },
              component: () => import('@/views/type3/subtype1/subtype1-3')
            }
          ]
        }
      ]
    },
    {
      path: '/type4',
      name: '4',
      component: Layout,
      redirect: '/type4/subType1/subType1-1',
      meta: { title: '系统设置', icon: 'example' },
      children: [
        {
          path: 'subType1',
          name: 'type4-SubType1',
          meta: { title: '系统设置', hidden: true },
          component: NullLayout,
          children: [
            {
              path: 'subType1-1',
              name: 'type4-SubType1-1',
              meta: { title: '用户管理' },
              component: () => import('@/views/type4/subtype1/subtype1-1')
            }
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    }
  ]
})
