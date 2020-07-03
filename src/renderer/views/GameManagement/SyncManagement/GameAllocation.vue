<template>
  <div>
    <div class="topItem">

         
          <Select v-model="currentIp" clearable @on-change="handleSelectChange" style="width:160px;"  >
            <Option v-for="item in serversIpList" :value="item.ip" :key="item.id">{{ item.ip }}</Option>
          </Select>

          <Select v-model="gameType" style="width:160px;" clearable  @on-change="handleGetGameByTypeName" :placeholder="$t('PleaseInputGameType')">
             <Option v-for="item in gameList" :value="item.id" :key="item.id">{{ $t(item.name) }}</Option>
           </Select>

          <Select v-model="serversDisk" style="width:160px;" clearable @on-change="handleSelectDiskChange"   :placeholder="this.$t('AllDiskSymbol')">
            <Option v-for="item in serversDiskList" :value="item.id" :key="item.id">{{ item.disk_symbol }} ( {{ item.extend_disk_type }} )</Option>
          </Select>

          <AutoComplete  icon="ios-search"  style="width:200px;" :placeholder="$t('SupportGameInit')" v-model="value1" :data="GameName" @on-change='ChangeValue'  />
      

            <Button type="primary"  @click="handleButtonAllowe">{{$t('AssignGame')}}</Button>
            <Button type="primary" @click="handleButtonCancleAllowe">{{$t('CancelAssign')}}</Button>
            <Button type="primary"  @click="handleButtonMuteAddTask">{{$t('AddSynchronizationTask')}}</Button>

    </div>
  

    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" stripe :no-data-text="this.$t('Nodata')"></Table>
  
    <Row style="margin-top:10px; ">
        <Page :current="pageinfo.page_index" :total="pageinfo.count" :page-size="this.Pagelimit" show-total  @on-change="hanbleChangePage" style=" float:right;"/>
    </Row>
    <Modal
        v-model="distributionPanel"
        :title="this.$t('AllocateGame')"
        @on-ok="ok"
       >
       <Row class="item">
           <Col span="5">
          <span>{{$t('DistributionServer')}}</span>
          </Col>
                <Col span="18">
         <Select v-model="serversIpValue1" clearable @on-change="handleSelectChangeserversIp1"   label-in-value disabled>
            <Option v-for="item in serversIpList1" :value="item.id" :key="item.id">{{ item.ip }}</Option>
          </Select>
             </Col>
        </Row>
     <Row class="item">
       <Col span="5">
                     <span>{{$t('AllocateDisk')}}</span>
        </Col>
            <Col span=18>
              <Select v-model="serversDisk1" clearable   :placeholder="this.$t('AllDiskSymbol')">
            <Option v-for="item in serversDiskList1" :value="item.id" :key="item.id">{{ item.disk_symbol }} ( {{ item.extend_disk_type }} )</Option>
          </Select>
              </Col>
        </Row>
        
    </Modal>
  </div>
</template>

<script>
  import { distributeGame, canceldistributeGame, syncGame, getAllServers, getAllServerDisks, getAllServerGamesByIp } from '@/api/sync'
  import { getAllCenterGameTypes } from '@/api/game'
  import { bytesToSize3 } from '../../../utils/index'
  export default {
    name: 'ServerSyncSet',
    data () {
      return {
        pageinfo: {
          count: 0,
          page_index: 0
        },
        Pagelimit: 10,
        distributionPanel: false, //  分配游戏面板
        currentIp: '', // 当前页ip
        serversDisk: '',
        serversDiskList: [],
        serversDiskList1: [], // 待分配的磁盘列表
        clearVal: '',
        inputVal: '',
        diskValue: '',
        serverVal: '',
        serversIpValue: '',
        driversData: [],
        getCheckboxVal: [], // 勾选复选框值
        getCheckboxValString: '',
        tableSelectVal: [],
        serversIpList: [],
        serversIpList1: [], // 待分配的服务器
        diskList: [],
        GameName: [],
        value1: '',
        serversIpValue1: '',
        serversDisk1: '',
        diskListOption: [],
        gameType: 0,
        gameList: [],
        tableColumns: [
          { type: 'selection', minWidth: 60, align: 'center' },
          {
            renderHeader: (h, params) => { return h('span', this.$t('Status')) },
            key: 'state',
            minWidth: 90,
            render: (h, params) => {
              let type = params.row.state
              switch (type) {
                case 0:
                  return h('span', { style: { color: '#999999' } }, this.$t('DisableSync'))
                case 1:
                  return h('span', { style: { color: '#999999' } }, this.$t('Unallocated'))
                case 2:
                  return h('span', this.$t('PendingUpgrade'))
                case 3:
                  return h('span', this.$t('Waitingfordiskallocation'))
                case 4:
                  return h('span', this.$t('Sync'))
                case 5:
                  return h('span', this.$t('Updatefailed'))
                case 6:
                  return h('span', { style: { color: '#47cb89' } }, this.$t('success'))
              }
            }
          },
          { key: 'display_name', minWidth: 109, renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
          { key: 'game_type', tooltip: true, minWidth: 105, renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
          { key: 'popularity', sortable: true, minWidth: 105, renderHeader: (h, params) => { return h('span', this.$t('Popularity')) } },
          { key: 'size',
            sortable: true,
            minWidth: 90,
            renderHeader: (h, params) => { return h('span', this.$t('Size')) },
            render: (h, params) => {
              return h('span', bytesToSize3(params.row.size))
            }
          },
          { key: 'local_version', minWidth: 118, renderHeader: (h, params) => { return h('span', this.$t('LocalGameVersion')) } },
          { key: 'target_symbol', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('Serverdisk')) } },
          { key: 'final_sync_version', minWidth: 119, renderHeader: (h, params) => { return h('span', this.$t('LasterSysVersion')) } }
        ],
        tableData: []
      }
    },
    created () {
      this.handleGetAllServers() // 获取所以服务器列表
      this.handleGameType()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },

    methods: {
      /**
       * 通过游戏类型查询游戏
       */

      handleGetGameByTypeName (gametypeid) {
        this.gametypeid = gametypeid
        this.handleGetGame({ gametypeid })
      },
      /**
       * 查询游戏类型
       */
      handleGameType () {
        getAllCenterGameTypes().then(res => {
          res.data.forEach(item => {
            this.gameList.push(item)
          })
        })
      },
      /**
       * 根据游戏名首字母查询
       */
      ChangeValue (value) {
        let info = {
          offset: 0,
          limit: this.Pagelimit,
          orderby: 'size',
          serverip: this.currentIp,
          gametype: '',
          serverdiskid: '',
          letter: value
        }
        getAllServerGamesByIp(info).then((resp) => {
          this.tableData = resp.data.data
          this.pageinfo = resp.data.pageino
          this.pageinfo.page_index++
        }, (error) => {
          console.log(error)
        })
      },
      /**
       * 获取服务器ip
       */
      handleGetAllServers () {
        getAllServers().then((resp) => {
          this.serversIpList = resp.data || []
          this.serversIpList = this.serversIpList
          this.currentIp = this.serversIpList[0].ip // 默认选择第一个服务器
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
            this.serversDiskList.map(item => {
              switch (item.extend_disk_type) {
                case 0:
                  item.extend_disk_type = this.$t('GameDisk')
                  break
                case 1:
                  item.extend_disk_type = this.$t('HotGameDisk')
                  break
                case 2:
                  item.extend_disk_type = this.$t('PrivateGameDisk')
                  break
              }
            })
          }
          this.currentServerId = this.serversDiskList[0]
          // this.currentDiskId = this.serversDiskList[0].id
          this.handleGetGame()
        })
      },
      /**
       * 获取服务器游戏
       */
      handleGetGame ({ offset = 0, limit = this.Pagelimit, serverdiskid = '', orderby = 'name', serverip = this.currentIp, gametypeid = '', letter = '' } = {}) {
        let info = {
          offset,
          limit,
          serverip,
          gametypeid,
          letter,
          serverdiskid,
          orderby
        }
        getAllServerGamesByIp(info).then((resp) => {
          this.tableData = resp.data.data
          this.pageinfo = resp.data.pageino
          this.pageinfo.page_index++
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
      hanbleChangePage (e) {
        this.handleGetGame({ offset: (e - 1) * this.Pagelimit })
      },
      /**
       * 切换服务器ip
       */
      handleSelectChange (serverip) {
        this.currentIp = serverip
        // this.currentServerId = serverInfo.server_id
        this.handleGetGame()
        this.handleGetAllServersDisk()
      },
      /**
       * 服务器磁盘
       */
      handleSelectDiskChange (diskID) {
        this.currentDiskId = diskID
        this.handleGetGame({ serverdiskid: diskID })
      },
      handleSelectChangeserversIp1 (data) {
        getAllServerDisks(data.label).then((resp) => {
          this.serversDiskList1 = resp.data || []
          console.log(this.serversDiskList1)
          if (this.serversDiskList) {
            this.serversDiskList1 = this.serversDiskList1.filter(item => {
              return item.disk_type === 1
            })
            this.serversDiskList1.map(item => {
              switch (item.extend_disk_type) {
                case 0:
                  item.extend_disk_type = this.$t('GameDisk')
                  break
                case 1:
                  item.extend_disk_type = this.$t('HotGameDisk')
                  break
                case 2:
                  item.extend_disk_type = this.$t('PrivateGameDisk')
                  break
              }
            })
            console.log(this.serversDiskList1)
            this.serversDisk1 = this.serversDiskList1[0].id
          }
        })
      },
      /**
       * 分配游戏
       */
      handleButtonAllowe (data) {
        if (this.getCheckboxVal.length === 0) {
          this.notifyUserOfError('PleaseSelectAtLeastOneItemInTheList')
        } else {
          this.distributionPanel = true
          this.serversIpList1 = this.serversIpList.filter(item => { return item.ip === this.currentIp })
          this.serversIpValue1 = this.serversIpList1[0].id
          let data = {
            label: this.serversIpList1[0].ip
          }
          this.handleSelectChangeserversIp1(data)
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
            info.server_id = this.serversIpValue1
            info.server_disk_id = this.serversDisk1
            info.local_game_id = item.local_game_id
            data.push(info)
          })
          distributeGame(data).then((res) => {
            this.getCheckboxVal = []
            this.handleGetGame((this.pageinfo.page_index - 1) * this.Pagelimit, this.Pagelimit, this.currentDiskId)
            this.$Message.success(res.data)
          }, () => {
            this.$Message.error('请求出错，请稍后再试')
          })
        } else if (this.allowGame) {
          let info = {}
          let data = []
          info.server_id = this.serversIpValue1
          info.server_disk_id = this.serversDisk1
          info.local_game_id = this.allowGame.local_game_id
          data.push(info)
          distributeGame(data).then((res) => {
            this.handleGetGame((this.pageinfo.page_index - 1) * this.Pagelimit, this.Pagelimit)
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
        this.distributionPanel = true
        this.allowGame = data
        this.serversIpList1 = this.serversIpList.filter(item => { return item.ip === this.currentIp })
        this.serversIpValue1 = this.serversIpList1[0].id
        let dataCopy = {
          label: this.serversIpList1[0].ip
        }
        this.handleSelectChangeserversIp1(dataCopy)
      },
      /**
       * 取消分配游戏
       */
      handleButtonCancleAllowe (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.notifyUserOfError('PleaseSelectAtLeastOneItemInTheList')
        } else {
          let str = ''
          this.getCheckboxVal.filter(item => {
            str = str + item.server_game_id + ','
          })
          str = str.substr(0, str.length - 1) // 切换最后一个字符
          canceldistributeGame(str).then((res) => {
            this.handleGetGame(this.pageinfo.page_index - 1, this.Pagelimit)
            this.notifyUserOfError('OperationSuccessful')
          }, (error) => {
            this.$Message.error(error.data.error)
          })
        }
      },
      /**
       * 添加同步任务
       */
      handleButtonAddTask (data) {
        syncGame(data.server_game_id).then((res) => {
          this.handleGetGame(this.pageinfo.page_index - 1, this.Pagelimit)
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
       * 添加多个同步任务
       */
      handleButtonMuteAddTask () {
        let length = this.getCheckboxVal.length
        if (length === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          let str = ''
          this.getCheckboxVal.filter(item => {
            str = str + item.server_game_id + ','
          })
          str = str.substr(0, str.length - 1) // 切换最后一个字符
          syncGame(str).then((res) => {
            this.handleGetGame(this.pageinfo.page_index - 1, this.Pagelimit)
            this.$Notice.success({
              title: this.$t('OperationSuccessful'),
              desc: '已成功添加同步任务中，可去同步任务查看详细内容'
            })
          }, () => {
            this.$Message.error('请求出错，请稍后再试')
          })
        }
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
 .hide{
    display: none;
  }
</style>

