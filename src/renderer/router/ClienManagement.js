import NullLayout from '@/views/layout/null'
import Layout from '@/views/layout/index'

export default {
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
}
