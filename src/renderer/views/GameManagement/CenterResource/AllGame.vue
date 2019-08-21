<template>
  <div>
    <Modal v-model="DownloadGameUp" draggable scrollable :title="$t('DownloadGames')" footer-hide>
        <Form ref='Dg'  :model='Dg' label-position="left" :label-width="80" style="width: 300px">
          <FormItem :label="$t('DiskSymbol')" label-position="left">
            <Select v-model="Dg.data" :placeholder="$t('Search')" >
              <Option v-for='item in disk' :value='item.DeviceID' :key='item.DeviceID'>{{item.DeviceID}} \ {{$t('AvailableSpace')}} {{item.free_space}}</Option>
            </Select>
            </FormItem> 
              <FormItem>
            <Button type="primary" :loading="loadBtn" @click="handleSubmit('Dg')">{{$t('DownloadGames')}}</Button>
            <Button @click="handleReset()" style="margin-left: 8px">{{$t('cancelText')}}</Button>
        </FormItem>
        </Form>
    </Modal>
    <div class="topItem">
      <Select v-model="model1"  class="topColumn" style="width:160px;" :placeholder="$t('pleaseInput')">
        <Option v-for="item in gameList" :value="item.id" :key="item.id">{{ item.dispaly_name }}</Option>
      </Select>
      <AutoComplete  icon="ios-search" class="topColumn"  :placeholder="$t('PleaseInputGameName')" style="width: 200px;" v-model="GameName" @on-change='ChangeValue' />
      <Button type="primary" class="topColumn" @click="handleButtonFixGame">{{$t('repair')}}</Button>
      <Button type="error" class="topColumn" @click="handleButtonRemove">{{$t('LocalRemoval')}}</Button>
    </div>
    <!-- table -->
    <Table width="100%" border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" stripe ></Table>
    <Row style="margin-top:10px; ">
      <Col span="24">
      <Page :total="this.pageInfo.count" show-total :current="pageInfo.page_index + 1" :page-size="this.Pagelimit" @on-change="handleGetTableList" style=" float:right;"/></Col>
    </Row>
  </div>
</template>

<script>
import { getAllGame, getLogicalDrives, downloadGame, repairGame, deleteGame } from '@/api/localGame'
import { getAllCenterGameTypes } from '@/api/game'
import { bytesToSize2 } from '../../../utils/index'
export default {
  name: 'allGame',
  data () {
    return {
      loadBtn: false, // 下载按钮 loading
      pageCount: '',
      disk: '',
      GameName: '', // 游戏名提示
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
        // { Id: 0, value: 'HotGame', label: 'HotGame' },
        // { Id: 1, value: 'OnlineGame', label: 'OnlineGame' },
        // { Id: 2, value: 'ConsoleGame', label: 'ConsoleGame' },
        // { Id: 3, value: 'CasualGame', label: 'CasualGame' },
        // { Id: 4, value: 'AuxiliaryGame', label: 'AuxiliaryGame' }
      ],
      tableColumns: [
        { type: 'selection', width: '50px', align: 'center' },
        {
          renderHeader: (h, params) => { return h('span', this.$t('CurrentStatus')) },
          key: 'State',
          minWidth: 110,
          maxWidth: 110,
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
          minWidth: 100,
          maxWidth: 110,
          renderHeader: (h, params) => { return h('span', this.$t('TypeName')) }
        },
        { key: 'Name', maxWidth: 108, minWidth: 108, renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
        { key: 'Popularity',
          minWidth: 120,
          maxWidth: 120,
          sortable: true,
          renderHeader: (h, params) => { return h('span', this.$t('Popularity')) }
        },
        { key: 'Size', minWidth: 80, maxWidth: 100, sortable: true, renderHeader: (h, params) => { return h('span', this.$t('Size')) } },
        { key: 'CenterVersion', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('CenterVersion')) } },
        { key: 'LocalVersion', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('LocalVersion')) } },
        { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
          key: 'operation',
          minWidth: 170,
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
    // this.TypeName = `TypeName.${Vue.config.lang}` // 从数据库取游戏名
    this.handleGetGameType()
    this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: '' })
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    /**
     * 获取游戏类型
     */
    async handleGetGameType () {
      try {
        let resp = await getAllCenterGameTypes()
        this.gameList = resp.data
      } catch (error) {
        console.log(this.error)
      }
    },
    /**
     * 获取游戏资料
     */
    async handleGetGameList (obj) {
      let pageList = { gameList: [], pageInfo: [] }
      try {
        let resp = await getAllGame(obj)
        this.tableData = resp.data.data
        this.pageInfo = resp.data.pageino
      } catch (error) {
        console.log(error)
      }
      return pageList
    },
    /**
     *  搜索游戏
     *
    */
    ChangeValue (data) {
      this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: data })
    },
    /**
     *  分页
     *
    */
    handleGetTableList (e) {
      this.handleGetGameList({ offset: (e - 1) * this.Pagelimit, limit: this.Pagelimit, orderby: 'Name', gameName: this.GameName })
    },
    /**
     * 下载游戏
    */
    handleSubmit () {
      this.loadBtn = true
      let info = { CenterGameId: this.deleteid, DiskSymbol: this.Dg.data + '\\' }
      downloadGame(info.CenterGameId, info.DiskSymbol).then((response) => {
        this.DownloadGameUp = false
        console.log(response)
        this.$Message.sucess(this.$t(`${response.data}`))
        this.handgetAllGame(0, this.Pagelimit, 'Name')
      }, (error) => {
        this.$Message.error(this.$t(`${error.data.error}`))
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
      }, (error) => {
        this.$Message.error(this.$t(`${error.data.error}`))
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
        this.$Message.success(this.$t('repairSucess'))
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

