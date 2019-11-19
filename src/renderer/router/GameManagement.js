import NullLayout from '@/views/layout/null'
import Layout from '@/views/layout/index'
import AllGame from '@/views/GameManagement/CenterResource/AllGame'
import TodyaUpdate from '@/views/GameManagement/CenterResource/TodyaUpdate'
import SystemTool from '@/views/GameManagement/CenterResource/SystemTool'
// import Download from '@/views/GameManagement/CenterResource/subtype1-download'
// import remove from '@/views/GameManagement/CenterResource/subtype1-remove'
import DownloadQueue from '@/views/GameManagement/ResourceDownload/DownloadQueue'
import DownloadLog from '@/views/GameManagement/ResourceDownload/DownloadLog'
import DownloadSet from '@/views/GameManagement/ResourceDownload/DownloadSet'
import DownloadedGame from '@/views/GameManagement/LocalResource/DownloadedGame'
import BarGames from '@/views/GameManagement/LocalResource/BarGames'
import AssignGame from '@/views/GameManagement/SyncManagement/GameAllocation'
import SyncTask from '@/views/GameManagement/SyncManagement/SyncTask'
import SyncLog from '@/views/GameManagement/SyncManagement/SyncLog'
import DefaultRule from '@/views/GameManagement/SyncManagement/DefaultRule'
import BarGamesEdit from '@/views/GameManagement/LocalResource/BarGamesEdit'
import DownloadedGameEdit from '@/views/GameManagement/LocalResource/DownloadedGameEdit'
import BarGameAdd from '@/views/GameManagement/LocalResource/BarGameAdd'
export default {
  path: '/game',
  name: '游戏管理',
  component: Layout,
  redirect: '/game/subType1/subType1-1',
  meta: { title: 'GameManagement', icon: 'example' },
  children: [
    {
      path: 'subType1',
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
          name: 'BarGames',
          meta: { title: 'BarGames' },
          component: BarGames
        },
        {
          path: 'BarGameAdd',
          name: 'BarGameAdd',
          meta: { title: 'Add', hidden: true },
          component: BarGameAdd,
          hidden: true
        },
        {
          path: 'BarGamesEdit', // 编辑游戏
          name: 'BarGamesEdit',
          meta: { title: 'Edit', hidden: true },
          component: BarGamesEdit,
          hidden: true
        },
        {
          path: 'DownloadedGameEdit',
          name: 'DownloadedGameEdit',
          meta: { title: 'Edit', hidden: true },
          component: DownloadedGameEdit,
          hidden: true
        }
      ]
    },
    {
      path: 'SyncSetManagement',
      name: 'SyncSetManagemen',
      meta: { title: 'SyncManagement', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'AssignGame',
          name: 'AssignGame',
          meta: { title: 'AssignGame' },
          component: AssignGame
        },
        {
          path: 'SubType4-2',
          name: 'GameManagement-SubType4-2',
          meta: { title: 'SyncTask' },
          component: SyncTask
        },
        {
          path: 'SyncLog',
          name: 'SyncLog',
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
