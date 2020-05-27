<template>
 <div>
     <h4>主板</h4>
      <Table :columns="baseBoardcol" :data="baseBoard" border></Table>
      <h4 style="margin-top:10px;">cpu</h4>
      <Table :columns="cpuListcol" :data="cpuList" border></Table>
        <h4 style="margin-top:10px;">网卡</h4>
       <Table :columns="ethernetListcol" :data="ethernetList" border></Table>
           <h4 style="margin-top:10px;">内存</h4>
        <Table :columns="meminfocol" :data="meminfo[0].dimmList" border></Table>
        <h4 style="margin-top:10px;">硬盘</h4>
        <template v-for="item in storageList">
         <Table :columns="storageListcol" :data="item.diskList" border></Table>
        </template>
 </div>
</template>
<script>
export default {
  name: 'ServerHardInfo',
  data () {
    return {
      baseBoard: '',
      cpuList: [],
      ethernetList: [],
      meminfo: [],
      storageList: [],
      supportKVM: ''
    }
  },
  computed: {
    baseBoardcol () {
      return [
        {
          key: 'manuFacturer',
          title: '厂商'
        },
        {
          key: 'productName',
          title: '产品名称'
        },
        {
          key: 'biosDate',
          title: '日期'
        },
        {
          key: 'biosVersion',
          title: '版本'
        }

      ]
    },
    cpuListcol () {
      return [
        {
          key: 'model',
          title: '型号',
          minWidth: 300,
          maxWidth: 300
        },
        {
          key: 'name',
          title: '名称',
          minWidth: 100,
          maxWidth: 120
        },
        {
          key: 'supportVt',
          title: '支持虚拟化'
        },
        {
          key: 'temperature',
          title: '温度'
        },
        {
          key: 'util',
          title: '占用率'
        }
      ]
    },
    ethernetListcol () {
      return [
        {
          key: 'name',
          title: '名称',
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
          title: '链接速率',
          minWidth: 90,
          maxWidth: 90
        },
        {
          key: 'linkStatic',
          title: '状态',
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
          title: '子网掩码',
          minWidth: 100,
          maxWidth: 120
        },
        {
          key: 'controller',
          title: '型号',
          minWidth: 350
        }
        // {
        //   key: '',
        //   title: ' '

        // }
      ]
    },
    meminfocol () {
      return [
        {
          key: 'locator',
          title: '插槽'
        },
        {
          key: 'manufacturer',
          title: '厂商'
        },
        {
          key: 'serialNumber',
          title: '序列号'
        },
        {
          key: 'size',
          title: '大小'
        },
        {
          key: 'speed',
          title: '速度'
        },
        {
          key: 'temperature',
          title: '温度'
        }
      ]
    },
    storageListcol () {
      return [
        {
          key: 'name',
          title: '名称',
          minWidth: 100,
          maxWidth: 100
        },
        {
          key: 'health',
          title: '健康值',
          minWidth: 90,
          maxWidth: 90
        },
        {
          key: 'interfaceRate',
          title: '接口',
          minWidth: 200,
          maxWidth: 200
        },
        {
          key: 'model',
          title: '型号',
          minWidth: 200,
          maxWidth: 200
        },
        {
          key: 'serial',
          title: '序列号'
        },
        {
          key: 'sizeK',
          title: '大小'
        },
        {
          key: 'temperature',
          title: '温度'
        }
      ]
    }
  },
  created () {
    this.baseBoard = [this.$route.query.data.data.result.baseBoard]
    this.cpuList = this.$route.query.data.data.result.cpuList
    this.ethernetList = this.$route.query.data.data.result.ethernetList
    this.meminfo = [this.$route.query.data.data.result.meminfo]
    this.storageList = this.$route.query.data.data.result.storageList
  }
}
</script>

<style lang="scss" scoped>

</style>