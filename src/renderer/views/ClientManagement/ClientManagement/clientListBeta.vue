<template>
  <div class="clientList">
    <Header />
    <SuperWorkstation
      :Workstation="Workstation"
      @SuperIp="fetchClient"
      @Remote="handleRemote"
      :masterIp="masterIp"
    />
    <clientListData
      @SetClient="HandleSetClient"
      :masterIp="masterIp"
      :clientList="clientList"
      @Remote="handleRemote"
      @fetchData="fetchClient"
      @OpenModal="HandleOpenMpdal"
    />
  <clientTemplate
      :edit="flag"
      v-show="showClientTemplate"
      :showClientTemplate="showClientTemplate"
      :masterIp="masterIp"
      :clientData="client"
      @VisibleclientTemplate="HandleVisibleclientTemplateVisible"
      @closed="HandleClosedModal"
    />
  </div>
</template>
<script>
import Header from './components/clientListHeader'
import SuperWorkstation from './superWorkstation'
import clientListData from './clientListData'
import ClientTemplate from './components/clientTemplate'
// import {
//   setSuper,
//   getSuper,
//   setCancelSuper,
//   batchSetPcConf
// } from '@/api/client'
import {
  getPcListConfig,
  //   getImageListx,
  //   deletePcsConfigx,
  //   getPcGroupx,
  PcRemote
  //   CtrlPcsConf
} from '@/api/wupan'
import { toRemote } from '@/api/toMain'
import { mapState } from 'vuex'
export default {
  name: 'clientList',
  components: {
    Header,
    SuperWorkstation,
    clientListData,
    ClientTemplate
  },
  computed: {
    ...mapState({
      masterIp: (state) => state.app.masterip
    })
  },
  data () {
    return {
      flag: 'add',
      showClientTemplate: false,
      Workstation: [],
      clientIp: [],
      clientMac: [],
      clientPc: [],
      clientList: [],
      client: {}
    }
  },
  created () {
    // this.HandelSuperIp()
  },
  methods: {
    HandleOpenMpdal (param) {
      this.showClientTemplate = true
      this.flag = param.type
      this.client = param.data
    },
    HandleVisibleclientTemplateVisible (show) {
      this.showClientTemplate = show
    },
    handleWarkUp (row) {
      console.log(row)
    },
    async fetchClient (ip) {
      this.clientList = []
      this.Workstation = []
      try {
        let resp = await getPcListConfig(this.masterIp)
        let list = resp.data.result.list
        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            if (ip && list[i].ip === ip) {
              this.Workstation.push(list[i])
            } else {
              this.clientList.push(list[i])
            }
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    filterIpPCMac (array) {
      this.clientIp = this.clientMac = this.clientPc = []
      if (array.length < 1) return ''
      for (let i = 0; i < array.length; i++) {
        this.clientIp.push(array[i].ip)
        this.clientMac.push(array[i].mac)
        this.clientPc.push(array[i].pc)
      }
      console.log(this.clientIp, this.clientMac, this.clientPc)
    },
    async handleRemote (obj) {
      PcRemote({ mac: obj.mac, ip: obj.ip, pwd: obj.passwd }, this.masterIp)
      let resp = toRemote({ ip: obj.ip, password: obj.passwd })
      if (resp) {
        this.$Message.error(resp.cmd)
      }
    }
  }
}
</script>
