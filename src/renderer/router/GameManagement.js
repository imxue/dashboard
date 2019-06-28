import NullLayout from '@/views/layout/null'
import Layout from '@/views/layout/index'
import AllGame from '@/views/GameManagement/CenterResource/AllGame'
import TodyaUpdate from '@/views/GameManagement/CenterResource/TodyaUpdate'
import SystemTool from '@/views/GameManagement/CenterResource/SystemTool'
import Download from '@/views/GameManagement/CenterResource/subtype1-download'
import remove from '@/views/GameManagement/CenterResource/subtype1-remove'
import DownloadQueue from '@/views/GameManagement/ResourceDownload/DownloadQueue'
import DownloadLog from '@/views/GameManagement/ResourceDownload/DownloadLog'
import DownloadSet from '@/views/GameManagement/ResourceDownload/DownloadSet'
import DownloadedGame from '@/views/GameManagement/LocalResource/DownloadedGame'
import BarGames from '@/views/GameManagement/LocalResource/BarGames'
import ServerSyncSet from '@/views/GameManagement/SyncManagement/ServerSyncSet'
import SyncTask from '@/views/GameManagement/SyncManagement/SyncTask'
import SyncLog from '@/views/GameManagement/SyncManagement/SyncLog'
import DefaultRule from '@/views/GameManagement/SyncManagement/DefaultRule'
import BarGamesEditMain from '@/views/GameManagement/LocalResource/BarGamesEditMain'
import DownloadedGameEdit from '@/views/GameManagement/LocalResource/DownloadedGameEdit'
import BarGameAddMain from '@/views/GameManagement/LocalResource/BarGameAddMain'
export default {
  path: '/game',
  name: '游戏管理',
  component: Layout,
  redirect: '/game/subType1/subType1-1',
  meta: { title: 'GameManagement', icon: 'example' },
  children: [
    {
      path: 'subtype1',
      name: '中心资源',
      meta: { title: 'CenterResource', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'subType1-1',
          name: '全部游戏',
          meta: { title: 'AllGame' },
          component: AllGame
        },
        {
          path: 'subType1-2',
          name: '今日更新',
          meta: { title: 'TodyaUpdate' },
          component: TodyaUpdate
        },
        {
          path: 'subType1-3',
          name: '系统工具',
          meta: { title: 'SystemTool' },
          component: SystemTool
        },
        // {
        //   path: 'subType1-4',
        //   name: '停服资源',
        //   meta: { title: '停服资源' },
        //   component: () => import('@/views/GameManagement/CenterResource/StopResource')
        // },
        // {
        //   path: 'subType1-5',
        //   name: 'SubType1-5',
        //   meta: { title: '下载资源' },
        //   component: () => import('@/views/GameManagement/CenterResource/DownloadResource')
        // },
        {
          path: 'subType1-download',
          name: 'subType1-download',
          meta: { title: 'Download', hidden: true },
          // showBtn: true,
          component: Download,
          hidden: true
        },
        {
          path: 'subType1-remove',
          name: '本地移除',
          meta: { title: '本地移除', hidden: true },
          // showBtn: true,
          component: remove,
          hidden: true
        }
      ]
    },
    {
      path: 'subType2',
      name: '资源下载',
      meta: { title: 'ResourceDownload', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'subType2-1',
          name: '下载队列',
          meta: { title: 'DownloadQueue' },
          component: DownloadQueue
        },
        {
          path: 'subType2-2',
          name: 'GameManagement-SubType2-2',
          meta: { title: 'DownloadLog' },
          component: DownloadLog
        },
        {
          path: 'DownloadSet',
          name: 'subType2-set',
          meta: { title: 'DownloadSet', hidden: true },
          component: DownloadSet,
          hidden: true
        }
      ]
    },
    {
      path: 'subType3',
      name: 'GameManagement-SubType3',
      meta: { title: 'LocalResource', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'SubType3-1',
          name: '已下载游戏',
          meta: { title: 'DownloadedGame' },
          component: DownloadedGame
        },
        {
          path: 'BarGames',
          name: 'GameManagement-SubType3-2',
          meta: { title: 'BarGames' },
          component: BarGames
        },
        // {
        //   path: 'BarGameAdd',
        //   name: 'BarGameAdd',
        //   meta: { title: '添加', hidden: true },
        //   component: () => import('@/views/GameManagement/LocalResource/BarGameAdd'),
        //   hidden: true
        // },
        // {
        //   path: 'BarGamesEdit',
        //   name: 'GameManagement-SubType3-1-edit',
        //   meta: { title: '编辑', hidden: true },
        //   component: () => import('@/views/GameManagement/LocalResource/BarGamesEdit'),
        //   hidden: true
        // },
        // {
        //   path: 'SubType3-1-fix',
        //   name: 'GameManagement-SubType3-1-fix',
        //   meta: { title: '修复', hidden: true },
        //   component: () => import('@/views/GameManagement/LocalResource/subtype3-1-fix'),
        //   hidden: true
        // },
        // {
        //   path: 'SubType3-1-more',
        //   name: 'GameManagement-SubType3-1-more',
        //   meta: { title: '批量操作', hidden: true },
        //   component: () => import('@/views/GameManagement/LocalResource/subtype3-1-more'),
        //   hidden: true
        // },
        {
          path: 'BarGameAddMain',
          name: 'GameManagement-SubType3-add',
          meta: { title: 'Add', hidden: true },
          component: BarGameAddMain,
          hidden: true
        },
        {
          path: 'BarGamesEditMain', // 编辑游戏
          name: 'GameManagement-SubType3-edit',
          meta: { title: 'Edit', hidden: true },
          component: BarGamesEditMain,
          hidden: true
        },
        {
          path: 'DownloadedGameEdit',
          name: 'GameManagement-SubType3-delete',
          meta: { title: 'Edit', hidden: true },
          component: DownloadedGameEdit,
          hidden: true
        }
      ]
    },
    {
      path: 'subType4',
      name: 'GameManagement-SubType4',
      meta: { title: 'SyncManagement', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'SubType4-1',
          name: 'GameManagement-SubType4-1',
          meta: { title: 'ServerSyncSet' },
          component: ServerSyncSet
        },
        {
          path: 'SubType4-2',
          name: 'GameManagement-SubType4-2',
          meta: { title: 'SyncTask' },
          component: SyncTask
        },
        {
          path: 'SubType4-3',
          name: 'GameManagement-SubType4-3',
          meta: { title: 'SyncLog' },
          component: SyncLog
        },
        {
          path: 'DefaultRule',
          name: 'DefaultRule',
          meta: { title: 'DefaultRule', hidden: true },
          component: DefaultRule,
          hidden: true
        }
      ]
    }
  ]
}
