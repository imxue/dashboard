<template>
  <div>
    <div class="topItem">
         <Col :lg="{ span: 3, offset: 0 }">
          <Select v-model="serversIpValue" clearable @on-change="handleSelectChange"  class="topColumn" >
            <Option v-for="item in serversIpList" :value="item.ip" :key="item.id">{{ item.ip }}</Option>
          </Select>
          </Col>
          <Col :lg="{ span: 4, offset: 0 }">
          <Select v-model="serversDisk" clearable @on-change="handleSelectChange"  class="topColumn">
            <Option v-for="item in serversDiskList" :value="item.device_path" :key="item.id">{{ item.device_path }}</Option>
          </Select>
           </Col>
            <Col :lg="{ span: 6, offset: 0 }">
          <Select v-model="diskValue" clearable class="topColumn" style="width:140px;" :placeholder="this.$t('AllDiskSymbol')">
            <Option v-for="item in diskListOption" :value="item.device_path" :key="item.id" >{{ item.device_path }}</Option>
          </Select>
          <!-- <Button type="primary" class="topColumn" @click="handleButtonSearch">{{$t('Search')}}</Button> -->
           </Col>
      <Button type="primary" @click="handleFilter">筛选</Button>
      <Button type="primary" @click="handleAllow">分配</Button>
      <Button @click="handleReset" style="margin-left: 8px">取消</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox"></Table>
    <Row style="margin-top:10px; ">
      <i-col span="10">资源：3000 &nbsp;&nbsp;&nbsp;&nbsp;已下载：1000</i-col>
    </Row>
        <!-- 分配 -->
        <Modal
        v-model="showGameBox"
        title="请选择您要分配的游戏类型"
        @on-ok="handleConfirm"
        @on-cancel="handleCancel"
        width = "400">
        <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll">全选</Checkbox>
        <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
          <Checkbox v-for="item in gameTypeList" :key="item.Id" :label="item.Id" >{{item.Name}}</Checkbox>
      </CheckboxGroup>
    </Modal>
  </div>
</template>

<script>
  import { getAllServers, getAllServerDisks } from '@/api/sync'
  // import { getPolicys } from '@/api/sync'
  export default {
    name: 'subtype4-allow',
    data () {
      return {
        currentIp: '',
        serversDisk: '',
        serversDiskList: [],
        serverVal: '',
        driverId: 0,
        serverValKey: '',
        gameDiskValue: '',
        diskValue: '',
        diskValueKey: '',
        showGameBox: false,
        indeterminate: true,
        checkAll: false,
        checkAllGroup: [],
        getDriversData: [],
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        gameDiskList: [
          { Id: 0, Name: '游戏盘' },
          { Id: 1, Name: '热门游戏盘' }
        ],
        gameTypeList: [],
        serverList: [],
        diskList: [],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: '目标服务器IP', key: 'Ip' },
          {
            title: '磁盘类型',
            key: 'IsHotgamedisk',
            render: (h, params) => {
              let type = params.row.IsHotgamedisk
              switch (type) {
                case 0:
                  return h('span', '全部游戏盘')
                case 1:
                  return h('span', '热门游戏盘')
                default:
                  return '-'
              }
            }
          },
          { title: '目标盘符', key: 'Drive' },
          { title: '盘符大小', key: 'Driversize' },
          {
            title: '默认存放游戏',
            key: 'GameTypeIds',
            render: (h, params) => {
              var arr = params.row.GameTypeIds
              var list = []
              var gamesTypeList = ''
              for (var i in arr) {
                list.push(arr[i].Name)
              }
              gamesTypeList = list.join(',')
              // console.log('gamesTypeList::' + gamesTypeList)
              return h('span', gamesTypeList)
            }
          }
        ],
        tableData: [],
        serversIplist: []
      }
    },
    created () {
      this.handleGetAllServers()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      /**
       * 获取服务器ip
       */
      handleGetAllServers () {
        getAllServers().then((resp) => {
          this.serversIpList = resp.data || []
          this.serversIpValue = this.serversIpList[0].ip
          this.currentIp = this.serversIpValue
          this.handleGetAllServersDisk() // 获取磁盘
        })
      },
      /**
       * 获取服务器上的磁盘
       */
      handleGetAllServersDisk () {
        getAllServerDisks(this.currentIp).then((resp) => {
          this.serversDiskList = resp.data || []
          this.serversDisk = this.serversDiskList[0].device_path
          debugger
          // this.handleGetGameByIp()
        })
      }
    }
  }
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>

