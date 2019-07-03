<template>
  <div>
    <div class="topItem">
      <Row>
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
          
           <Col :lg="{ span: 11, offset: 0 }">
            <Button type="primary" class="topColumn" @click="handleButtonAllowe">{{$t('AssignGame')}}</Button>
            <Button type="primary" class="topColumn" @click="handleButtonCancleAllowe">{{$t('CancelAssign')}}</Button>
            <Button type="primary" class="topColumn" @click="handleButtonAddTask">{{$t('AddSynchronizationTask')}}</Button>
            <router-link to="DefaultRule">
            <Button type="primary" class="topColumn" >{{$t('DefaultAssignmentRule')}}</Button>
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
    
  </div>
</template>

<script>
  import { getSearch, getDrivers, getPolicys, distributeGame, cancelDistribution, multiAddSyncTask, getAllServers, getAllServerDisks, getAllServerGamesByIp } from '@/api/sync'

  export default {
    name: 'ServerSyncSet',
    data () {
      return {
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
                  return h('span', { style: { color: '#999999' } }, this.$t('Unallocated'))
                case 1:
                  return h('span', '最新')
                // case 2:
                //   return h('span', { style: { color: '#008000' } }, '更新中')
                default:
                  return '-'
              }
            }
          },
          { key: 'final_sync_version', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('最后同步版本')) } },
          { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            key: 'operation',
            minWidth: 160,
            render: (h, params) => {
              let type = params.row.state
              let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
                on: { click: () => { this.handleTableAllowe(params.row) } }
              }, this.$t('AssignGame'))
              let b = h('span', {
                style: { color: '#2d8cf0', marginRight: '10px', textDecoration: 'underline' },
                on: { click: () => { this.handleTableCancel(params.row) } }
              }, this.$t('CancelAssign'))
              let c = h('span', {
                style: { color: '#2d8cf0', textDecoration: 'underline' },
                on: { click: () => { this.handleTableAdd(params.row) } }
              }, this.$t('AddSynchronizationTask'))
              switch (type) {
                case 0:
                  return h('span', [a])
                case 1:
                  return h('span', [b, c])
                case 2:
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
          orderby: 'name',
          serverip: '10.88.66.144',
          letter: 'm'
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
      handleCallBackVaild (res) {
        var code = res.data.Code
        if (code === 0 || res.data.state === 'OK') {
          this.$Message.success('操作成功')
        } else {
          this.$Message.error('操作失败：' + res.data.Msg)
        }
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
      handleSelectChange (value) {
        this.diskValue = []
        var arr = this.diskList
        var list = []
        var newArr = arr.filter(item => item.Ip === value)
        for (var i in newArr) {
          list.push({
            Ip: newArr[i].Ip,
            DriverId: newArr[i].DriverId,
            Name: newArr[i].Ip + newArr[i].Drive + '\\ (' + newArr[i].Driversize + 'GB)'
          })
        }
        this.diskListOption = list // 最终盘符列表
      },
      handleButtonAllowe (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          distributeGame(this.getCheckboxVal).then((res) => {
            this.handleCallBackVaild(res)
          }, () => {
            this.$Message.error('请求出错，请稍后再试')
          })
        }
      },
      handleButtonCancleAllowe (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          cancelDistribution(this.getCheckboxVal).then((res) => {
            this.handleCallBackVaild(res)
          }, () => {
            this.$Message.error('请求出错，请稍后再试')
          })
        }
      },
      handleButtonAddTask (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          multiAddSyncTask(this.getCheckboxVal).then((res) => {
            this.handleCallBackVaild(res)
          }, () => {
            this.$Message.error('请求出错，请稍后再试')
          })
        }
      },
      handleButtonRules (val) {
        this.$router.push('DefaultRule')
      },
      handleCheckBox (arr) {
        var data = arr
        var list = []
        for (var i in arr) {
          list.push(data[i].Id)
        }
        this.getCheckboxVal = list
        this.getCheckboxValString = list.join(',')
        console.log(this.getCheckboxVal)
        return this.getCheckboxVal
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
        // alert(this.getCheckboxVal)
        // this.$router.push({
        //   path: 'subtype1-remove',
        //   query: { id: this.getCheckboxVal }
        // })
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
  .topColumn{ float:left; margin-right:2px;}
  .ivu-input-icon{right:55px;}
</style>

