import NullLayout from '@/views/layout/null'
import Layout from '@/views/layout/index'

export default {
  path: '/Diskless',
  name: '无盘管理',
  component: Layout,
  redirect: '/diskless/DisklessServer/DisklessServerList',
  meta: { title: 'DiskLessManagement', icon: 'example' },
  children: [
    {
      path: 'DisklessServer',
      name: '无盘服务器',
      meta: { title: 'DisklessServer', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'DisklessServerList',
          name: '无盘服务器列表',
          meta: { title: 'DisklessServerList' },
          component: () => import('@/views/DisklessManagement/DisklessServerList/index')
        },
        {
          path: 'DisklessServerAdd',
          name: '添加',
          meta: { title: 'DisklessServerListAdd' },
          component: () => import('@/views/DisklessManagement/DisklessServerList/DisklessServerListAdd'),
          hidden: true
        },
        {
          path: 'DisklessServerDetail',
          name: '查看详情',
          meta: { title: 'DisklessServerListDetail' },
          component: () => import('@/views/DisklessManagement/DisklessServerList/DisklessServerListDetail'),
          hidden: true
        }
      ]
    },
    {
      path: 'subType2',
      name: 'type2-SubType2-1',
      meta: { title: 'MirrorManagement', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'subType2-1',
          name: 'MirrorList',
          meta: { title: 'AllMirror' },
          component: () => import('@/views/DisklessManagement/MirrorManagement/subtype2-1')
        },
        {
          path: 'subType2-set',
          name: 'type2-SubsubType2Type1-set',
          meta: { title: 'ConfigPoint' },
          component: () => import('@/views/DisklessManagement/MirrorManagement/subtype2-set'),
          hidden: true
        }
      ]
    },
    {
      path: 'subType3',
      name: 'type2-SubType3',
      meta: { title: 'ClientStartup', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'StartUpPlan',
          name: 'StartUpPlanList',
          meta: { title: 'StartUpPlan' },
          component: () => import('@/views/DisklessManagement/ClientStartup/StartUpPlan')
        },
        {
          path: 'DHCPSet',
          name: 'DPCP配置',
          meta: { title: 'DHCPSet' },
          component: () => import('@/views/DisklessManagement/ClientStartup/dpcp')
        },
        {
          path: 'StartUpPlanEdit',
          name: 'StartUpPlanEdit',
          meta: { title: 'Edit' },
          component: () => import('@/views/DisklessManagement/ClientStartup/StartUpPlanEdit'),
          hidden: true
        }
      ]
    }
  ]
}
