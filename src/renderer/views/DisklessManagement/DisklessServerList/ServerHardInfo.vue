<template>
 <div>
     <h4>{{$t('MainBoard')}}</h4>
      <Table :columns="baseBoardcol" :data="baseBoard" border></Table>
      <h4 style="margin-top:10px;">cpu</h4>
      <Table :columns="cpuListcol" :data="cpuList" border></Table>
        <h4 style="margin-top:10px;">{{$t('NetworkCard')}}</h4>
       <Table :columns="ethernetListcol" :data="ethernetList" border></Table>
           <h4 style="margin-top:10px;">{{$t('RAM')}}</h4>
        <Table :columns="meminfocol" :data="meminfo[0].dimmList" border></Table>
        <h4 style="margin-top:10px;">{{$t('HardDisk')}}</h4>
        <template v-for="item in storageList">
         <Table :columns="storageListcol" :data="item.diskList" border></Table>
        </template>
 </div>
</template>
<script>
import { bytesToSize } from '@/utils/index'
import {
  GetServerHardInfo
} from '@/api/wupan'
export default {
  name: 'ServerHardInfo',
  data () {
    return {
      baseBoard: '',
      cpuList: [],
      ethernetList: [],
      meminfo: [],
      storageList: [],
      supportKVM: '',
      ip: '',
      timer: null
    }
  },
  computed: {
    baseBoardcol () {
      return [
        {
          key: 'manuFacturer',
          title: this.$t('manuFacturer')
        },
        {
          key: 'productName',
          title: this.$t('productName')
        },
        {
          key: 'biosDate',
          title: this.$t('Date')
        },
        {
          key: 'biosVersion',
          title: this.$t('version')
        }

      ]
    },
    cpuListcol () {
      return [
        {
          key: 'name',
          title: this.$t('n'),
          minWidth: 100,
          maxWidth: 120
        },
        {
          key: 'model',
          title: this.$t('model'),
          minWidth: 300,
          maxWidth: 300
        },
        {
          key: 'supportVt',
          title: this.$t('supportVt')
        },
        {
          key: 'util',
          title: this.$t('util')
        },
        {
          key: 'temperature',
          title: this.$t('temperature')

        }
      ]
    },
    ethernetListcol () {
      return [
        {
          key: 'name',
          title: this.$t('n'),
          minWidth: 80,
          maxWidth: 80
        },
        {
          key: 'ip',
          title: 'ip',
          minWidth: 108,
          maxWidth: 108
        }, {
          key: 'linkRate',
          title: this.$t('linkRate'),
          minWidth: 90,
          maxWidth: 90
        },
        {
          key: 'linkStatic',
          title: this.$t('linkStatic'),
          minWidth: 100,
          maxWidth: 100
        },
        {
          key: 'mac',
          title: 'mac',
          minWidth: 145,
          maxWidth: 145
        },

        {
          key: 'netmask',
          title: this.$t('netmask'),
          minWidth: 100,
          maxWidth: 120
        },
        {
          key: 'controller',
          title: this.$t('controller'),
          minWidth: 350
        }
      ]
    },
    meminfocol () {
      return [
        {
          key: 'locator',
          title: this.$t('locator')
        },
        {
          key: 'type',
          title: this.$t('Type')

        },
        {
          key: 'manufacturer',
          title: this.$t('manuFacturer')
        },
        {
          key: 'serialNumber',
          title: this.$t('serialNumber')
        },
        {
          key: 'size',
          title: this.$t('Size')

        },
        {
          key: 'speed',
          title: this.$t('speed')

        }
      ]
    },
    storageListcol () {
      return [
        {
          key: 'name',
          title: this.$t('n'),
          minWidth: 100,
          maxWidth: 100
        },
        {
          key: 'health',
          title: this.$t('health'),
          minWidth: 90,
          maxWidth: 90
        },
        {
          key: 'interfaceRate',
          title: this.$t('interfaceRate'),
          minWidth: 200,
          maxWidth: 200
        },
        {
          key: 'model',
          title: this.$t('model'),
          minWidth: 200,
          maxWidth: 200
        },
        {
          key: 'serial',
          title: this.$t('serialNumber')
        },
        {
          key: 'sizeK',
          title: this.$t('Size'),
          render: (h, params) => {
            return h('span', bytesToSize(params.row.sizeK))
          }
        },
        {
          key: 'temperature',
          title: this.$t('temperature')
        }
      ]
    }
  },
  created () {
    // this.baseBoard = [this.$route.query.data.data.result.baseBoard]
    // this.cpuList = this.$route.query.data.data.result.cpuList
    // this.ethernetList = this.$route.query.data.data.result.ethernetList
    // this.meminfo = [this.$route.query.data.data.result.meminfo]
    // this.storageList = this.$route.query.data.data.result.storageList
    this.ip = this.$route.query.serverIp
    this.HandleGetHardInfo(this.ip).then(() => {
      this.start()
    })
  },
  beforeRouteLeave (to, from, next) {
    clearTimeout(this.timer)
    next()
  },
  methods: {
    async HandleGetHardInfo (ip) {
      let resp = await GetServerHardInfo(ip)
      this.baseBoard = [resp.data.result.baseBoard]
      this.cpuList = resp.data.result.cpuList
      this.ethernetList = resp.data.result.ethernetList
      this.meminfo = [resp.data.result.meminfo]
      this.storageList = resp.data.result.storageList
    },
    async start () {
      this.HandleGetHardInfo(this.ip)
      this.timer = setTimeout(() => {
        this.start()
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>