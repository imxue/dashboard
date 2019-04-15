import NullLayout from '@/views/layout/null'
import Layout from '@/views/layout/index'

export default {
  path: '/game',
  name: '游戏管理',
  component: Layout,
  redirect: '/game/subType1/subType1-1',
  meta: { title: '游戏管理', icon: 'example' },
  children: [
    {
      path: 'subtype1',
      name: '中心资源',
      meta: { title: '中心资源', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'subType1-1',
          name: '全部游戏',
          meta: { title: '全部游戏' },
          component: () => import('@/views/GameManagement/CenterResource/AllGame')
        },
        {
          path: 'subType1-2',
          name: '今日更新',
          meta: { title: '今日更新' },
          component: () => import('@/views/GameManagement/CenterResource/TodyaUpdate')
        },
        {
          path: 'subType1-3',
          name: '系统工具',
          meta: { title: '系统工具' },
          component: () => import('@/views/GameManagement/CenterResource/SystemTool')
        },
        {
          path: 'subType1-4',
          name: '停服资源',
          meta: { title: '停服资源' },
          component: () => import('@/views/GameManagement/CenterResource/StopResource')
        },
        // {
        //   path: 'subType1-5',
        //   name: 'SubType1-5',
        //   meta: { title: '下载资源' },
        //   component: () => import('@/views/GameManagement/CenterResource/DownloadResource')
        // },
        {
          path: 'subType1-download',
          name: 'subType1-download',
          meta: { title: '下载', hidden: true },
          // showBtn: true,
          component: () => import('@/views/GameManagement/CenterResource/subtype1-download'),
          hidden: true
        },
        {
          path: 'subType1-remove',
          name: '本地移除',
          meta: { title: '本地移除', hidden: true },
          // showBtn: true,
          component: () => import('@/views/GameManagement/CenterResource/subtype1-remove'),
          hidden: true
        }
      ]
    },
    {
      path: 'subType2',
      name: '资源下载',
      meta: { title: '资源下载', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'subType2-1',
          name: '下载队列',
          meta: { title: '下载队列' },
          component: () => import('@/views/GameManagement/ResourceDownload/DownloadQueue')
        },
        {
          path: 'subType2-2',
          name: 'GameManagement-SubType2-2',
          meta: { title: '下载日志' },
          component: () => import('@/views/GameManagement/ResourceDownload/DownloadLog')
        },
        {
          path: 'subType2-set',
          name: 'subType2-set',
          meta: { title: '下载设置', hidden: true },
          component: () => import('@/views/GameManagement/ResourceDownload/DownloadSet'),
          hidden: true
        }
      ]
    },
    {
      path: 'subType3',
      name: 'GameManagement-SubType3',
      meta: { title: '本地资源', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'SubType3-1',
          name: 'GameManagement-SubType3-1',
          meta: { title: '已下载游戏' },
          component: () => import('@/views/GameManagement/LocalResource/subtype3-1')
        },
        {
          path: 'SubType3-2',
          name: 'GameManagement-SubType3-2',
          meta: { title: '本吧游戏' },
          component: () => import('@/views/GameManagement/LocalResource/subtype3-2')
        },
        {
          path: 'SubType3-1-add',
          name: 'GameManagement-SubType3-1-add',
          meta: { title: '添加', hidden: true },
          component: () => import('@/views/GameManagement/LocalResource/subtype3-1-add'),
          hidden: true
        },
        {
          path: 'SubType3-1-edit',
          name: 'GameManagement-SubType3-1-edit',
          meta: { title: '编辑', hidden: true },
          component: () => import('@/views/GameManagement/LocalResource/subtype3-1-edit'),
          hidden: true
        },
        {
          path: 'SubType3-1-fix',
          name: 'GameManagement-SubType3-1-fix',
          meta: { title: '修复', hidden: true },
          component: () => import('@/views/GameManagement/LocalResource/subtype3-1-fix'),
          hidden: true
        },
        {
          path: 'SubType3-1-more',
          name: 'GameManagement-SubType3-1-more',
          meta: { title: '批量操作', hidden: true },
          component: () => import('@/views/GameManagement/LocalResource/subtype3-1-more'),
          hidden: true
        },
        {
          path: 'SubType3-2-add',
          name: 'GameManagement-SubType3-add',
          meta: { title: '添加', hidden: true },
          component: () => import('@/views/GameManagement/LocalResource/subtype3-2-add'),
          hidden: true
        },
        {
          path: 'SubType3-2-edit',
          name: 'GameManagement-SubType3-edit',
          meta: { title: '编辑', hidden: true },
          component: () => import('@/views/GameManagement/LocalResource/subtype3-2-edit'),
          hidden: true
        },
        {
          path: 'SubType3-delete',
          name: 'GameManagement-SubType3-delete',
          meta: { title: '编辑', hidden: true },
          component: () => import('@/views/GameManagement/LocalResource/subtype3-delete'),
          hidden: true
        }
      ]
    },
    {
      path: 'subType4',
      name: 'GameManagement-SubType4',
      meta: { title: '同步管理', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'SubType4-1',
          name: 'GameManagement-SubType4-1',
          meta: { title: '服务器同步设置' },
          component: () => import('@/views/GameManagement/SyncManagement/ServerSyncSet')
        },
        {
          path: 'SubType4-2',
          name: 'GameManagement-SubType4-2',
          meta: { title: '同步任务' },
          component: () => import('@/views/GameManagement/SyncManagement/SyncTask')
        },
        {
          path: 'SubType4-3',
          name: 'GameManagement-SubType4-3',
          meta: { title: '同步日志' },
          component: () => import('@/views/GameManagement/SyncManagement/SyncLog')
        },
        {
          path: 'SubType4-allowe',
          name: 'GameManagement-SubType4-allowe',
          meta: { title: '默认分配规则', hidden: true },
          component: () => import('@/views/GameManagement/SyncManagement/DefaultRule'),
          hidden: true
        }
      ]
    }
  ]
}
