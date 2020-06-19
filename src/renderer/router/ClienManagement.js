import NullLayout from '@/views/layout/null'
import Layout from '@/views/layout/index'
import ClientList from '@/views/ClientManagement/ClientManagement/ClientList'
// import ClientListBeta from '@/views/ClientManagement/ClientManagement/clientListBeta'
import hardwareinformation from '@/views/ClientManagement/ClientManagement/hardwareinformation'
import BaseSetting from '@/views/ClientManagement/ClientSetting/BaseSetting'
import HomeScreenIcon from '@/views/ClientManagement/ClientSetting/HomeScreenIcon'
import BootPath from '@/views/ClientManagement/ClientSetting/BootPath'
export default {
  path: '/ClientManagement',
  name: 'ClientManagement',
  component: Layout,
  redirect: '/ClientManagement/SubClientManagement',
  meta: { title: 'ClientManagement', icon: 'md-laptop' },
  children: [
    {
      path: 'SubClientManagement',
      name: 'SubClientManagement',
      redirect: '/ClientManagement/SubClientManagement/ClientManagementList',
      meta: { title: 'ClientManagement', hidden: true },
      component: NullLayout,
      children: [
        {
          path: 'ClientManagementList',
          name: 'ClientManagementList',
          alias: '/disklesslist',
          meta: { title: 'ClientList' },
          component: ClientList

        },
        {
          path: 'hardwareinformation',
          name: 'hardwareinformation',
          meta: { title: 'HardwareInformation' },
          component: hardwareinformation
        }
      ]
    },
    {
      path: 'clientSetting',
      name: 'clientSetting',
      redirect: '/ClientManagement/clientSetting/BaseSetting',
      meta: { title: 'ClientSetting', hidden: true },
      component: NullLayout,
      hidden: true,
      children: [
        {
          path: 'BaseSetting',
          name: 'BaseSetting',
          meta: { title: 'BaseSetting' },
          component: BaseSetting
        },
        {
          path: 'HomeScreenIcon',
          name: 'HomeScreenIcon',
          meta: { title: 'HomeScreenIcon' },
          component: HomeScreenIcon
        },
        {
          path: 'BootBatch',
          name: 'BootBatch',
          meta: { title: 'BootBatch' },
          component: BootPath
        }
      ]
    }
  ]
}
