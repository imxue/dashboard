import { shallowMount } from '@vue/test-utils'
import clientListBeta from '@/views/ClientManagement/clientListBeta'

test(clientListBeta, () => {
  const wrapper = shallowMount(clientListBeta)
  console.log(wrapper)
})
