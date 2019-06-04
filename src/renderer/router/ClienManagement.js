import NullLayout from '@/views/layout/null'
import Layout from '@/views/layout/index'

export default {
  path: '/type3',
  name: 'ClientManagement',
  component: Layout,
  redirect: '/type3/subType1/subType1-1',
  meta: { title: 'ClientManagement', icon: 'example' },
  children: [
    {
      path: 'subType1',
      name: 'type3-SubType1',
      meta: { title: 'ClientManagement', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'subType1-1',
          name: 'ClientManagementList',
          alias: '/disklesslist',
          meta: { title: 'ClientList' },
          component: () => import('@/views/ClientManagement/ClientManagement/ClientList')
        },
        {
          path: 'subType1-add',
          name: 'type3-SubType1-add',
          meta: { title: 'ClientSetting' },
          component: () => import('@/views/ClientManagement/ClientManagement/subtype1-add'),
          hidden: true
        }
      ]
    },
    {
      path: 'subType2',
      name: 'clientSetting',
      meta: { title: 'ClientSetting', hidden: true },
      component: NullLayout,
      hidden: true,
      children: [
        {
          path: 'subType2-1',
          name: 'type3-SubType1-1',
          meta: { title: 'BaseSetting' },
          component: () => import('@/views/ClientManagement/ClientSetting/BaseSetting')
        },
        {
          path: 'subType2-2',
          name: 'type3-SubType1-2',
          meta: { title: 'HomeScreenIcon' },
          component: () => import('@/views/ClientManagement/ClientSetting/HomeScreenIcon')
        },
        {
          path: 'subType2-3',
          name: 'type3-SubType1-3',
          meta: { title: 'BootBatch' },
          component: () => import('@/views/ClientManagement/ClientSetting/BootPath')
        }
      ]
    }
  ]
}
