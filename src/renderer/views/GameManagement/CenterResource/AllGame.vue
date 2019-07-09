<template>
  <div>
    <Modal v-model="DownloadGameUp" draggable scrollable :title="$t('DownloadGames')" footer-hide>
        <Form ref='Dg'  :model='Dg' label-position="left" :label-width="80" style="width: 300px">
          <FormItem :label="$t('DiskSymbol')" label-position="left">
            <Select v-model="Dg.data" :placeholder="$t('Search')" >
              <Option v-for='item in disk' v-bind:value='item.DeviceID' v-bind:key='item.DeviceID'>{{item.DeviceID}} \ {{$t('AvailableSpace')}} {{item.free_space}}</Option>
            </Select>
            </FormItem> 
              <FormItem>
            <Button type="primary" :loading="loadBtn" @click="handleSubmit('Dg')">{{$t('DownloadGames')}}</Button>
            <Button @click="handleReset()" style="margin-left: 8px">{{$t('cancelText')}}</Button>
        </FormItem>
        </Form>
    </Modal>
    <div class="topItem">
      <Select v-model="model1"  class="topColumn" style="width:150px;" :placeholder="$t('pleaseInput')">
        <Option v-for="item in gameList" :value="item.value" :key="item.value">{{ $t(item.label) }}</Option>
      </Select>
      <AutoComplete  icon="ios-search" class="topColumn"  :placeholder="$t('PleaseInputGameName')" style="width: 200px;" v-model="value1" :data="GameName" @on-change='ChangeValue' @on-select='showItem' />
      <!-- <Button type="primary" class="topColumn" @click="handleButtonDW">{{$t('Download')}}</Button> -->
      <Button type="primary" class="topColumn" @click="handleButtonFixGame">{{$t('repair')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonRemove">{{$t('LocalRemoval')}}</Button>
    </div>
    <!-- table -->

   
    <Table size="small"   width="100%" border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" stripe :no-data-text="this.$t('Nodata')"></Table>
   

    <Row style="margin-top:10px; ">
      <Col span="6">{{$t('Resource')}}：{{this.pageInfo.count}} {{$t('Downloaded')}}：{{DownLoadCount}}</Col>
      <Col span="18"><Page :total="this.pageInfo.count" :current="pageInfo.page_index" :page-size="this.Pagelimit" @on-change="handleGetTableList" style=" float:right;"/></Col>
    </Row>
  </div>
</template>

<script>
import { getAllGame, getLogicalDrives, downloadGame, repairGame, deleteGame } from '@/api/localGame'
import { bytesToSize2 } from '../../../utils/index'
import Vue from 'vue'
const _ = require('lodash')
export default {
  name: 'allGame',
  data () {
    return {
      loadBtn: false, // 下载按钮 loading
      pageCount: '',
      disk: '',
      GameName: [], // 游戏名提示
      value1: '',
      temp: [],
      tempx: [],
      tableDataAll: [],
      pageInfo: '',
      Pagelimit: 10, // 页面展示的数量
      DownLoadCount: '0', // 已下载的数
      Dg: {
        data: ''
      },
      TypeName: '',
      deleteid: '',
      DownloadGameUp: false,
      model1: '',
      getCheckboxVal: [], // 勾选复选框值
      tableSelectVal: [],
      gameList: [
        { Id: 0, value: 'HotGame', label: 'HotGame' },
        { Id: 1, value: 'OnlineGame', label: 'OnlineGame' },
        { Id: 2, value: 'ConsoleGame', label: 'ConsoleGame' },
        { Id: 3, value: 'CasualGame', label: 'CasualGame' },
        { Id: 4, value: 'AuxiliaryGame', label: 'AuxiliaryGame' }
      ],
      tableColumns: [
        { type: 'selection', width: '50px', align: 'center' },
        {
          renderHeader: (h, params) => { return h('span', this.$t('CurrentStatus')) },
          key: 'State',
          minWidth: 130,
          render: (h, params) => {
            let type = params.row.State
            switch (type) {
              case 0:
                return h('span', this.$t('Undownload'))
              case 1:
                return h('span', { style: { color: '#999999' } }, this.$t('PendingUpgrade'))
              case 2:
                return h('span', { style: { color: '#008000' } }, this.$t('Updating'))
              case 3:
                return h('span', { style: { color: '#008000' } }, this.$t('LatestVersion'))
              default:
                return '-'
            }
          }
        },
        { key: 'TypeName',
          minWidth: 130,
          renderHeader: (h, params) => { return h('span', this.$t('TypeName')) }
        },
        { key: 'Name', minWidth: 120, renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
        { key: 'Popularity',
          minWidth: 120,
          sortable: true,
          renderHeader: (h, params) => { return h('span', this.$t('Popularity')) }
        },
        { key: 'Size', minWidth: 80, sortable: true, renderHeader: (h, params) => { return h('span', this.$t('Size')) } },
        { key: 'CenterVersion', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('CenterVersion')) } },
        { key: 'LocalVersion', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('LocalVersion')) } },
        { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
          key: 'operation',
          fixed: 'right',
          minWidth: 190,
          render: (h, params) => {
            let type = params.row.State
            let a = h('Button',
              { style: { marginRight: '5px', width: '70px' },
                props: { type: 'primary', size: 'small' },
                on: { click: () => { this.handleFixGame(params.row) } }
              }, this.$t('RepairGame'))
            let b = h('Button', {
              style: { width: '70px' },
              props: { type: 'error', size: 'small' },
              on: { click: () => { this.handleRemove(params.row) } }
            }, this.$t('LocalRemoval'))
            let c = h('Button', {
              style: { width: '70px' },
              props: { type: 'primary', size: 'small' },
              on: { click: () => { this.handleDownGame(params.row.Id) } }
            }, this.$t('DownloadGames'))
            switch (type) {
              case 0:
                return h('div', [c])
              case 1:
                return h('span', [a, b])
              case 2:
                return h('span', [b])
              case 3:
                return h('span', [b])
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
    this.TypeName = `TypeName.${Vue.config.lang}` // 从数据库取游戏名
    this.handgetAllGame(0, this.Pagelimit, 'Name')
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    ChangeValue () {
      if (this.value1) {
        this.tempx = []
        this.GameName = this.temp.slice(0, 6)
        let r = new RegExp(`${this.value1}`)
        this.tempx = this.GameAllName.filter(item => {
          return r.test(item)
        })
        this.GameName = this.tempx.slice(0, 6)
      } else {
        this.GameName = this.temp.slice(0, 6)
        this.handgetAllGame(0, 10, 'Name')
      }
    },
    showItem (name) {
      this.searchByGameName(name)
    },
    /**
     * 通过游戏名称搜索游戏
     */
    searchByGameName (name) {
      getAllGame(0, 1000000, 'Size').then(response => {
        this.tableDataAll = response.data.data.data
        this.tableData = this.tableDataAll.filter(item => {
          return item.Name === name
        })
      }, (e) => {
        this.$Notice.error({ desc: '' + e, duration: 0 })
      }).catch((e) => {
        this.$Notice.error({ desc: '' + e, duration: 0 })
      })
    },
    /**
     * 获取全部游戏
     */
    HandleGetAllGameThrottle: _.throttle(function (offset, limit, orderby) {
      getAllGame(offset, limit, orderby).then(response => {
        this.tableData = response.data.data
        this.tableData.filter(item => {
          if (item.Name) {
            this.GameName.push(item.Name)
          }
          this.GameAllName = Array.from(this.GameName)
          this.GameName = this.GameName.slice(0, 6)
          this.temp = Array.from(this.GameAllName)
        })
        this.pageInfo = response.data.pageino
        this.pageInfo.page_index++
        this.DownLoadCount = this.tableData.filter(item => { return item.State !== 0 }).length
      }, () => {
        // 这里执行reject状态的
        this.$Message.error(this.$t('kxLinuxErr.36873'))
      }).catch(() => {
        // 在发送代码错误时执行这里
        this.$Message.error(this.$t('kxLinuxErr.10'))
      })
    }, 2000),
    handgetAllGame (offset, limit, orderby) {
      getAllGame(offset, limit, orderby).then(response => {
        this.tableData = response.data.data
        this.tableData.filter(item => {
          if (item.Name) {
            this.GameName.push(item.Name)
          }
          this.GameAllName = Array.from(this.GameName)
          this.GameName = this.GameName.slice(0, 6)
          this.temp = Array.from(this.GameAllName)
        })
        this.pageInfo = response.data.pageino
        this.pageInfo.page_index++
        this.DownLoadCount = this.tableData.filter(item => { return item.State !== 0 }).length
      }, () => {
        // 这里执行reject状态的
        this.$Message.error(this.$t('kxLinuxErr.36873'))
      }).catch(() => {
        // 在发送代码错误时执行这里
        this.$Message.error(this.$t('kxLinuxErr.10'))
      })
    },
    handleGetTableList (e) {
      this.handgetAllGame((e - 1) * this.Pagelimit, this.Pagelimit, 'Name')
    },
    handleButtonDW (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
      } else {
        this.$router.push({
          path: 'subtype1-download',
          query: { id: this.getCheckboxVal }
        })
      }
    },
    /**
     * 下载游戏
    */
    handleSubmit () {
      this.loadBtn = true
      let info = { CenterGameId: this.deleteid, DiskSymbol: this.Dg.data + '\\' }
      downloadGame(info.CenterGameId, info.DiskSymbol).then((response) => {
        this.DownloadGameUp = false
      }, (e) => {
        this.$Message.error(this.$t('FileNotFound'))
      }).catch((e) => {
        this.$Message.error({ desc: '' + e, duration: 0 })
      }).finally(() => {
        this.loadBtn = false
      })
    },
    /**
     * 下载游戏弹窗
    */
    handleDownGame (id) {
      this.DownloadGameUp = true
      this.deleteid = id
      getLogicalDrives().then(response => {
        this.disk = response.data
        this.disk.map(item => {
          item.free_space = bytesToSize2(item.FreeSpace)
        })
        this.Dg.data = this.disk[0].DeviceID
      }, () => {
        this.$Message.error(this.$t('kxLinuxErr.36873'))
      }).catch(() => { this.$Message.info(this.$t('Getdiskinformationerror')) })
    },
    /**
     * 修复多个游戏
     */
    handleButtonFixGame (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
      } else {
        if (this.getCheckboxVal.length > 1) {
          this.getCheckboxVal.forEach((item) => {
            this.handleFixGame(item)
          })
        } else {
          this.handleFixGame(this.getCheckboxVal[0])
        }
      }
    },
    /**
     * 删除多个游戏
     */
    handleButtonRemove (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
      } else {
        if (this.getCheckboxVal.length > 1) {
          this.getCheckboxVal.forEach((item) => {
            this.handleRemove(item)
          })
        } else {
          this.handleRemove(this.getCheckboxVal[0])
        }
      }
    },
    /**
     * 删除游戏
     */
    handleRemove (index) {
      this.$Modal.confirm({
        title: this.$t('DeleteTip'),
        okText: this.$t('Confirm'),
        cancelText: this.$t('cancelText'),
        content: this.$t('DeleteDec'),
        'closable': true,
        onOk: () => {
          deleteGame(index.Id).then((e) => {
            this.$Message.error(this.$t('FileNotFound'))
          }, (e) => {
            this.$Message.error(this.$t('FileNotFound'))
          }).catch(() => {
            this.$Message.error(this.$t('kxLinuxErr.10'))
          })
        }
      })
    },
    handleReset () {
      this.loadBtn = false // 是保存按钮回归
      this.DownloadGameUp = false
    },
    /**
     * 获取选取的表格数据
    */
    handleCheckBox (arr) {
      this.getCheckboxVal = arr
      return this.getCheckboxVal
    },
    handleTableDw (index) {
      this.getCheckboxVal = this.tableSelectVal.push(index.id)
      this.$router.push({
        path: 'subtype1-download',
        query: { id: this.getCheckboxVal }
      })
    },
    /**
     * 修复游戏
     */
    handleFixGame (index) {
      repairGame(index.Id).then((e) => {
        this.$Message.error(this.$t('repairSucess'))
      }, () => {
        this.$Message.error(this.$t('FileNotFound'))
      }).catch((e) => {
        this.$Message.error({ desc: '' + e, duration: 0 })
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

