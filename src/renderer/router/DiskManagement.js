import NullLayout from '@/views/layout/null'
import Layout from '@/views/layout/index'

export default {
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
}
