import Layout from '@/views/layout/index'
import NullLayout from '@/views/layout/null'

import index from '@/views/safeCenter/index.vue'
export default {
  path: '/safeCenter',
  name: '游戏管理',
  component: Layout,
  redirect: '/safeCenter/subType1',
  meta: { title: 'safeCenter', icon: 'ios-leaf' },
  children: [
    {
      path: 'subType1',
      name: 'subType1',
      redirect: '/safeCenter/subType1/index',
      meta: { title: 'safeCenter', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'index',
          name: 'index',
          meta: { title: 'indexPage', hidden: true },
          component: index
        }
      ]
    }]
}
