import NullLayout from '@/views/layout/null'
import Layout from '@/views/layout/index'

export default {
  path: '/Diskless',
  name: '无盘管理',
  component: Layout,
  redirect: '/diskless/DisklessServer/DisklessServerList',
  meta: { title: '无盘管理', icon: 'example' },
  children: [
    {
      path: 'DisklessServer',
      name: '无盘服务器',
      meta: { title: '无盘服务器', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'DisklessServerList',
          name: '无盘服务器列表',
          meta: { title: '无盘服务器列表' },
          component: () => import('@/views/DisklessManagement/DisklessServerList/index')
        },
        {
          path: 'DisklessServerAdd',
          name: '添加',
          meta: { title: '添加' },
          component: () => import('@/views/DisklessManagement/DisklessServerList/DisklessServerListAdd'),
          hidden: true
        },
        {
          path: 'DisklessServerDetail',
          name: '查看详情',
          meta: { title: '查看详情' },
          component: () => import('@/views/DisklessManagement/DisklessServerList/DisklessServerListDetail'),
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
          component: () => import('@/views/DisklessManagement/subtype2/subtype2-1')
        },
        {
          path: 'subType2-set',
          name: 'type2-SubsubType2Type1-set',
          meta: { title: '配置点' },
          component: () => import('@/views/DisklessManagement/subtype2/subtype2-set'),
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
          component: () => import('@/views/DisklessManagement/subtype3/subtype3-1')
        },
        {
          path: 'subType3-2',
          name: 'DPCP配置',
          meta: { title: 'DPCP配置' },
          component: () => import('@/views/DisklessManagement/subtype3/dpcp')
        },
        {
          path: 'subType3-edit',
          name: 'type2-SubType3-edit',
          meta: { title: '方案编辑' },
          component: () => import('@/views/DisklessManagement/subtype3/subtype3-edit'),
          hidden: true
        }
      ]
    }
  ]
}
