<template>
  <div>
    <div class="topItem">
      <Row :gutter="16">
           <Col :lg="{ span: 3, offset: 0 }">
           <Select v-model="model1" >
             <!-- <Option v-for="item in gameList" :value="item.value" :key="item.value">{{ item.label }}</Option> -->
             <Option v-for="item in gameList" :value="item.value" :key="item.value">{{ $t(item.label) }}</Option>
           </Select>
        </Col>
          <Col :lg="{ span: 3, offset: 0 }">
          <AutoComplete  icon="ios-search" class="topColumn"  :placeholder="$t('PleaseInputGameName')" v-model="value1" :data="GameName" @on-change='ChangeValue' @on-select='showItem' />
      </Col>
        <Col :lg="{ span: 3, offset: 0 }">
          <Select v-model="serversIpValue" clearable @on-change="handleSelectChange"  class="topColumn" >
            <Option v-for="item in serversIpList" :value="item.ip" :key="item.id">{{ item.ip }}</Option>
          </Select>
          </Col>
          <Col :lg="{ span: 3, offset: 0 }">
          <Select v-model="serversDisk" clearable @on-change="handleSelectDiskChange"  class="topColumn" :placeholder="this.$t('AllDiskSymbol')">
            <Option v-for="item in serversDiskList" :value="item" :key="item.id">{{ item.device_path }}</Option>
          </Select>
           </Col>
           <Col :lg="{ span: 11, offset: 0 }">
            <Button type="primary" class="topColumn" @click="handleButtonAllowe">{{$t('AssignGame')}}</Button>
            <Button type="primary" class="topColumn" @click="handleButtonCancleAllowe">{{$t('CancelAssign')}}</Button>
            <Button type="primary" class="topColumn" @click="handleButtonAddTask">{{$t('AddSynchronizationTask')}}</Button>
            <router-link to="DefaultRule">
            <!-- <Button type="primary" class="topColumn" >{{$t('DefaultAssignmentRule')}}</Button> -->
            </router-link>
        </Col>
      </Row>
    </div>
    <!-- table -->
    <Row>
        <Col span="24">
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" stripe :no-data-text="this.$t('Nodata')"></Table>
        </Col>
    </Row>
    <Row style="margin-top:10px; ">
      <i-col span="7">{{$t('Resource')}}：3000 &nbsp;&nbsp;&nbsp;&nbsp;{{$t('Downloaded')}}：1000</i-col>
      <i-col span="17"><Page :current="currentPage" :total="totalPageNumber" show-total  @on-change="hanbleChangePage" style=" float:right;"/></i-col>
    </Row>
    <Modal
        v-model="distributionPanel"
        title="分配游戏"
        @on-ok="ok"
        @on-cancel="cancel">
       <Row class="item">
           <Col span="5">
          <span>分配服务器</span>
          </Col>
                <Col span="18">
         <Select v-model="serversIpValue1" clearable @on-change="handleSelectChangeserversIp1"  class="topColumn" >
            <Option v-for="item in serversIpList" :value="item.ip" :key="item.id">{{ item.ip }}</Option>
          </Select>
             </Col>
        </Row>
     <Row class="item">
       <Col span="5">
<span>分配磁盘</span>
        </Col>
            <Col span=18>
          <Select v-model="serversDisk1" clearable @on-change="handleSelectChangeDisk1"  class="topColumn" :placeholder="this.$t('AllDiskSymbol')">
            <Option v-for="item in serversDiskList" :value="item" :key="item.id">{{ item.device_path }}</Option>
          </Select>
              </Col>
        </Row>
        
    </Modal>
  </div>
</template>

<script>
  import { getSearch, getDrivers, getPolicys, distributeGame, canceldistributeGame, syncGame, getAllServers, getAllServerDisks, getAllServerGamesByIp } from '@/api/sync'

  export default {
    name: 'ServerSyncSet',
    data () {
      return {
        distributionPanel: false, //  分配游戏面板
        currentIp: '',
        serversDisk: '',
        serversDiskList: [],
        model1: '',
        clearVal: '',
        inputVal: '',
        diskValue: '',
        serverVal: '',
        serversIpValue: '',
        driversData: [],
        curroffset: 0,
        currlimit: 10,
        totalPageNumber: 0,
        pageSize: 10,
        currentPage: 1,
        getCheckboxVal: [], // 勾选复选框值
        getCheckboxValString: '',
        tableSelectVal: [],
        serversIpList: [],
        diskList: [],
        diskListOption: [],
        gameList: [
          { Id: 0, value: 'HotGame', label: 'HotGame' },
          { Id: 1, value: 'OnlineGame', label: 'OnlineGame' },
          { Id: 2, value: 'ConsoleGame', label: 'ConsoleGame' },
          { Id: 3, value: 'CasualGame', label: 'CasualGame' },
          { Id: 4, value: 'AuxiliaryGame', label: 'AuxiliaryGame' }
        ],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { key: 'display_name', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
          { key: 'game_type', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
          { key: 'popularity', minWidth: 100, renderHeader: (h, params) => { return h('span', this.$t('Popularity')) } },
          { key: 'size', minWidth: 70, renderHeader: (h, params) => { return h('span', this.$t('Size')) } },
          { key: 'local_version', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('本地游戏版本')) } },
          { key: 'final_sync_version', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('服务器存放磁盘')) } },
          {
            renderHeader: (h, params) => { return h('span', this.$t('Status')) },
            key: 'state',
            minWidth: 120,
            render: (h, params) => {
              let type = params.row.state
              switch (type) {
                case 0:
                  return h('span', { style: { color: '#999999' } }, '禁止同步')
                case 1:
                  return h('span', { style: { color: '#999999' } }, '未分配')
                case 2:
                  return h('span', '待更新')
                case 3:
                  return h('span', '等待磁盘分配')
                case 4:
                  return h('span', '更新中')
                case 5:
                  return h('span', '更新失败')
                case 6:
                  return h('span', '更新成功')
              }
            }
          },
          { key: 'final_sync_version', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('最后同步版本')) } },
          { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            key: 'operation',
            minWidth: 240,
            render: (h, params) => {
              let type = params.row.state
              let a = h('Button',
                { style: { marginRight: '5px', width: '70px' },
                  props: { type: 'primary', size: 'small' },
                  on: { click: () => { this.handleAllowe(params.row) } }
                }, this.$t('AssignGame'))
              let b = h('Button',
                { style: { marginRight: '5px', width: '70px' },
                  props: { type: 'primary', size: 'small' },
                  on: { click: () => { this.handleTableCancel(params.row) } }
                }, this.$t('CancelAssign'))
              let c = h('Button',
                { style: { marginRight: '5px', width: '86px' },
                  props: { type: 'primary', size: 'small' },
                  on: { click: () => { this.handleButtonAddTask(params.row) } }
                }, this.$t('AddSynchronizationTask'))
              switch (type) {
                case 0:
                  return h('span', [a])
                case 1:
                  return h('span', [a, c])
                case 2:
                  return h('span', [b])
                case 3:
                  return h('span', [c])
                case 4:
                  return h('span', [c])
                case 5:
                  return h('span', [c])
                case 6:
                  return h('span', [c])
                default:
                  return '-'
              }
            }
          }
        ],
        tableData: []
      }
    },
    created () {
      this.handleGetAllServers() // 获取所以服务器列表
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      /**
       * 更加游戏名
       */
      ChangeValue (value) {
        debugger
      },
      /**
       * 获取服务器ip
       */
      handleGetAllServers () {
        getAllServers().then((resp) => {
          this.serversIpList = resp.data || []
          this.serversIpList = this.serversIpList.filter(item => {
            return item.is_master !== 1
          })
          console.log(this.serversIpList)
          this.serversIpValue = this.serversIpList[0].ip
          this.serversIpValue1 = this.serversIpList[0].ip
          this.currentIp = this.serversIpList[0].ip
          this.handleGetAllServersDisk() // 获取磁盘
        })
      },
      /**
       * 获取服务器上的磁盘
       */
      handleGetAllServersDisk () {
        getAllServerDisks(this.currentIp).then((resp) => {
          this.serversDiskList = resp.data || []
          if (this.serversDiskList) {
            this.serversDiskList = this.serversDiskList.filter(item => {
              return item.disk_type === 1
            })
          }
          this.serversDisk = this.serversDiskList[0]
          this.serversDisk1 = this.serversDiskList[0] // 分配界面上的
          this.currentServerId = this.serversDiskList[0].server_id
          this.currentDiskId = this.serversDiskList[0].id
          this.handleGetGameByIp()
        })
      },
      /**
       * 获取服务器游戏
       */
      handleGetGameByIp (info) {
        info = {
          offset: 0,
          limit: 10,
          orderby: 'size',
          serverip: this.currentIp,
          letter: ''
        }
        getAllServerGamesByIp(info).then((resp) => {
          this.tableData = resp.data.data
        }, (error) => {
          console.log(error)
        })
      },
      handleButtonSearch () {
        if (this.inputVal === undefined) {
          this.inputVal = ''
        }
        if (this.diskValue === undefined || this.diskValue === '') {
          this.diskValue = 0
        }
        if (this.serversIpValue === undefined) {
          this.serversIpValue = ''
        }
        this.handleGetSearch(this.curroffset, this.currlimit)
      },
      handlGetDrivers () {
        getDrivers().then((res) => {
          if (res.data.Code === 0) {
            var arr = res.data.Data.Servers
            if (arr === null) {
              this.driversData = null // 全部服务器list
              this.serversIpList = null // 全部游戏类型
            } else {
              this.driversData = arr
              this.serversIpList = res.data.Data.Servers
              console.log('serversIpList::' + JSON.stringify(this.serversIpList))
            }
          } else {
            this.$Message.error(res.data.Msg)
          }
        }, () => {
        })
      },
      handleGetDriversOption () {
        getPolicys().then((res) => {
          if (res.data.Code === 0) {
            var arr = res.data.Data
            if (arr === null) {
              this.diskList = null
            } else {
              this.diskList = arr
            }
          } else {
            this.$Message.error(res.data.Msg)
          }
        }, () => {
        })
      },
      handleGetSearch (offset, limit) {
        var data = 'keyword=' + this.inputVal + '&serverIp=' + this.serversIpValue + '&driverId=' + this.diskValue + '&offset=0&limit=10'
        getSearch(data).then((res) => {
          if (res.data.Code === 0) {
            var arr = res.data.Data.List
            if (arr === null) {
              this.tableData = []
              this.getDriversData = []
              this.serverList = []
            } else {
              this.getDriversData = res.data.Data.Servers // 筛选三项data
              this.tableData = res.data.Data.List
              // console.log('tableData' + JSON.stringify(this.tableData))
            }
          } else {
            this.$Message.error(res.data.Msg)
          }
        }, () => {
        })
      },
      hanbleChangePage (num) {
        if (num === 1) {
          num = 0
        } else {
          num = (this.currlimit * num) - this.currlimit
        }
        this.handleGetSearch(num, this.currlimit)
      },
      /**
       * 服务器ip
       */
      handleSelectChange (serverip) {
        this.currentIp = serverip
        // this.currentServerId = serverInfo.server_id
        this.handleGetGameByIp()
        this.handleGetAllServersDisk()
      },
      /**
       * 服务器磁盘
       */
      handleSelectDiskChange (diskInfo) {
        this.currentDiskId = diskInfo.id
      },
      handleSelectChangeserversIp1 (serverip) {
        this.currentIp = serverip
        getAllServerDisks(this.currentIp).then((resp) => {
          this.serversDiskList = resp.data || []
          if (this.serversDiskList) {
            this.serversDiskList = this.serversDiskList.filter(item => {
              return item.disk_type === 1
            })
            this.serversDisk1 = this.serversDiskList[0]
          }
        })
      },
      handleButtonAllowe (data) {
        if (this.getCheckboxVal.length === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          this.distributionPanel = true
        }
      },
      /**
       * 分配游戏
       */
      ok () {
        let data = []
        if (this.getCheckboxVal.length >= 1) {
          this.getCheckboxVal.forEach(item => {
            let info = {}
            info.server_id = this.serversDisk1.server_id
            info.server_disk_id = this.serversDisk1.id
            info.local_game_id = item.local_game_id
            data.push(info)
          })
          distributeGame(data).then((res) => {
            this.handleGetGameByIp()
            this.$Message.success(res.data)
          }, () => {
            this.$Message.error('请求出错，请稍后再试')
          })
        } else if (this.allowGame) {
          let info = {}
          let data = []
          info.server_id = this.serversDisk1.server_id
          info.server_disk_id = this.serversDisk1.id
          info.local_game_id = this.allowGame.local_game_id
          data.push(info)
          distributeGame(data).then((res) => {
            this.handleGetGameByIp()
            this.$Message.success(res.data)
          }, () => {
            this.$Message.error('请求出错，请稍后再试')
          })
        }
      },
      /**
       * 分配游戏单个
       */
      handleAllowe (data) {
        // let info = {
        //   server_id: this.currentServerId,
        //   server_disk_id: this.currentDiskId,
        //   local_game_id: data.local_game_id
        // }
        this.distributionPanel = true
        this.allowGame = data
        // let temp = []
        // temp.push(info)
        // distributeGame(temp).then((res) => {
        //   this.$Message.error(res.data)
        // }, () => {
        //   this.$Message.error('请求出错，请稍后再试')
        // })
      },
      /**
       * 取消分配游戏
       */
      handleButtonCancleAllowe (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          canceldistributeGame(this.getCheckboxVal[0].server_game_id).then((res) => {
            this.$Message.success(this.$t('OperationSuccessful'))
            this.handleGetGameByIp()
          }, () => {
            this.$Message.error('请求出错，请稍后再试')
          })
        }
      },
      /**
       * 添加同步任务
       */
      handleButtonAddTask (data) {
        syncGame(data.server_game_id).then((res) => {
          this.$Notice.success({
            title: this.$t('OperationSuccessful'),
            desc: '已成功添加同步任务中，可去同步任务查看详细内容'
          })
        }, () => {
          this.$Message.error('请求出错，请稍后再试')
        })
      },
      handleButtonRules (val) {
        this.$router.push('DefaultRule')
      },
      /**
       * 获取表中数据
       */
      handleCheckBox (data) {
        this.getCheckboxVal = data
      },
      handleTableDw (index) {
        this.getCheckboxVal = this.tableSelectVal.push(index.Id)
        // alert(this.getCheckboxVal)
        this.$router.push({
          path: 'subtype1-download',
          query: { id: this.getCheckboxVal }
        })
      },
      handleFixGame (index) {
        this.getCheckboxVal = this.tableSelectVal.push(index.id)
        this.$Message.info('id:' + this.getCheckboxVal + '修复中，请耐心等待……')
      },
      handleRemove (index) {
        this.getCheckboxVal = this.tableSelectVal.push(index.id)
        this.$router.push({
          path: 'subtype1-remove',
          query: { id: this.getCheckboxVal }
        })
      }
    }
  }
</script>

<style scoped>
  .topItem{ padding:10px 0;}

  .ivu-input-icon{right:55px;}
  .item {
    margin-bottom:10px;
  }
</style>

