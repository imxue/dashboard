import NullLayout from '@/views/layout/null'
import Layout from '@/views/layout/index'
import DisklessServerList from '@/views/DisklessManagement/DisklessServerList/index'
import ServerHardInfo from '@/views/DisklessManagement/DisklessServerList/ServerHardInfo'
import DisklessServerListAdd from '@/views/DisklessManagement/DisklessServerList/DisklessServerListAdd'
import DisklessServerListDetail from '@/views/DisklessManagement/DisklessServerList/DisklessServerListDetail'
import AllMirror from '@/views/DisklessManagement/MirrorManagement/index'
import ConfigPoint from '@/views/DisklessManagement/MirrorManagement/MirrorConfig'
import StartUpPlan from '@/views/DisklessManagement/ClientStartup/StartUpPlan'
import dpcp from '@/views/DisklessManagement/ClientStartup/dpcp'
import Edit from '@/views/DisklessManagement/ClientStartup/StartUpPlanEdit'
export default {
  path: '/Diskless',
  name: '无盘管理',
  component: Layout,
  redirect: '/Diskless/DisklessServer',
  meta: { title: 'DiskLessManagement', icon: 'md-cloud' },
  children: [
    {
      path: 'DisklessServer',
      name: 'DisklessServer',
      redirect: '/Diskless/DisklessServer/DisklessServerList',
      meta: { title: 'DisklessServer', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'DisklessServerList',
          name: 'DisklessServerList',
          meta: { title: 'DisklessServerList' },
          component: DisklessServerList
        },
        {
          path: 'DisklessServerAdd',
          name: '添加',
          meta: { title: 'DisklessServerListAdd' },
          component: DisklessServerListAdd,
          hidden: true
        },
        {
          path: 'DisklessServerDetail',
          name: '查看详情',
          meta: { title: 'DisklessServerListDetail' },
          component: DisklessServerListDetail,
          hidden: true
        },
        {
          path: 'ServerHardInfo',
          name: '查看详情',
          meta: { title: 'ServerHardInfo' },
          component: ServerHardInfo,
          hidden: true
        }
      ]
    },
    {
      path: 'MirrorManagement',
      name: 'MirrorManagement',
      redirect: '/Diskless/MirrorManagement/AllMirror',
      meta: { title: 'MirrorManagement', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'AllMirror',
          name: 'MirrorList',
          meta: { title: 'AllMirror' },
          component: AllMirror
        },
        {
          path: 'ConfigPoint',
          name: 'ConfigPoint',
          meta: { title: 'ConfigPoint' },
          component: ConfigPoint,
          hidden: true
        }
      ]
    },
    {
      path: 'ClientStartup',
      name: 'ClientStartup',
      redirect: '/Diskless/ClientStartup/StartUpPlan',
      meta: { title: 'ClientStartup', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'StartUpPlan',
          name: 'StartUpPlanList',
          meta: { title: 'StartUpPlan' },
          component: StartUpPlan
        },
        {
          path: 'DHCPSet',
          name: 'DPCP配置',
          meta: { title: 'DHCPSet' },
          component: dpcp
        },
        {
          path: 'StartUpPlanEdit',
          name: 'StartUpPlanEdit',
          meta: { title: 'Edit' },
          component: Edit,
          hidden: true
        }
      ]
    }
    // {
    //   path: 'UserManagement',
    //   name: '个人磁盘管理',
    //   meta: { title: 'UserManagement', hidden: true },
    //   component: NullLayout,
    //   children: [
    //     {
    //       path: 'UserManagement',
    //       name: 'UserManagementList',
    //       meta: { title: 'UserList' },
    //       component: User
    //     }
    //   ]
    // }
  ]
}
