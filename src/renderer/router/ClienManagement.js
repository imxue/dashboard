import NullLayout from '@/views/layout/null'
import Layout from '@/views/layout/index'
import ClientList from '@/views/ClientManagement/ClientManagement/ClientList'
// import ClientListBeta from '@/views/ClientManagement/ClientManagement/clientListBeta'
import hardwareinformation from '@/views/ClientManagement/ClientManagement/hardwareinformation'
import BaseSetting from '@/views/ClientManagement/ClientSetting/BaseSetting'
import HomeScreenIcon from '@/views/ClientManagement/ClientSetting/HomeScreenIcon'
import BootPath from '@/views/ClientManagement/ClientSetting/BootPath'
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
          component: ClientList

        },
        // {
        //   path: 'subType1-2',
        //   name: 'ClientManagementList2',
        //   alias: '/disklesslist',
        //   meta: { title: 'ClientListBeta' },
        //   component: ClientListBeta

        // },
        {
          path: 'hardwareinformation',
          name: 'hardwareinformation',
          meta: { title: 'HardwareInformation' },
          component: hardwareinformation
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
          component: BaseSetting
        },
        {
          path: 'subType2-2',
          name: 'type3-SubType1-2',
          meta: { title: 'HomeScreenIcon' },
          component: HomeScreenIcon
        },
        {
          path: 'subType2-3',
          name: 'type3-SubType1-3',
          meta: { title: 'BootBatch' },
          component: BootPath
        }
      ]
    }
  ]
}
