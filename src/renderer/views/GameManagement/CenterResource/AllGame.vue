<template>
  <div>
    <Modal v-model="DownloadGameUp" draggable scrollable :title="$t('DownloadGames')" footer-hide>
        <Form ref='Dg'  :model='Dg' label-position="left" :label-width="80" style="width: 300px">
          <FormItem :label="$t('DiskSymbol')" label-position="left">
            <Select v-model="Dg.data" :placeholder="$t('Search')" clearable @on-clear="HandleGetGame">
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
      <Select v-model="model1"  class="topColumn" style="width:160px;" :placeholder="$t('pleaseInput')" @on-change="serchByGameType" clearable >
        <Option v-for="item in gameList" :value="item.id" :key="item.id">{{ item.dispaly_name }}</Option>
      </Select>
      <AutoComplete  icon="ios-search" class="topColumn"  :placeholder="$t('PleaseInputGameName')" style="width: 200px;" v-model="GameName" @on-change='ChangeValue' />
      <Button type="primary" class="topColumn" @click="handleDownGame">{{$t('Download')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonFixGame">{{$t('repair')}}</Button>
      <Button type="error" class="topColumn" @click="handleButtonRemove">{{$t('LocalRemoval')}}</Button>
    </div>
    <!-- table -->
    <Table width="100%" border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" stripe @on-sort-change="sortOrder"></Table>
    <Row style="margin-top:10px; ">
      <Col span="24">
      <Page :total="this.pageInfo.count" show-total :current="Number(pageInfo.page_index + 1)" :page-size="this.Pagelimit" @on-change="handleGetTableList" style=" float:right;"/></Col>
    </Row>
  </div>
</template>

<script>
// import { getAllGame, getLogicalDrives, downloadGame, repairGame, deleteGame } from '@/api/localGame'
import { getAllGame, getLogicalDrives, repairGame, deleteGame } from '@/api/localGame'
import { getAllCenterGameTypes } from '@/api/game'
import { bytesToSize2 } from '../../../utils/index'
import { download } from '@/utils/common'
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
      max: 20000,
      srcData: [],
      Dg: {
        data: ''
      },
      TypeName: '',
      CenterId: '',
      DownloadGameUp: false,
      model1: '',
      getCheckboxVal: [], // 勾选复选框值
      tableSelectVal: [],
      gameList: [
        { id: 0, dispaly_name: '全部游戏' }
      ],
      tableColumns: [
        { type: 'selection', width: '50px', align: 'center' },
        {
          renderHeader: (h, params) => { return h('span', this.$t('CurrentStatus')) },
          key: 'State',
          minWidth: 110,
          maxWidth: 120,
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
        { key: 'Size',
          minWidth: 80,
          maxWidth: 100,
          sortable: 'custom',
          renderHeader: (h, params) => { return h('span', this.$t('Size')) },
          render: (h, params) => {
            return h('span', bytesToSize2(params.row.Size))
          }
        },
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
      tableData: [],
      soreFlag: false,
      sortData: '' // 排过序的数据
    }
  },
  created () {
    // this.TypeName = `TypeName.${Vue.config.lang}` // 从数据库取游戏名
    this.handleGetGameType()
    this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gametypeid: '' })
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    /*
    * 根据游戏类型查找游戏
    */
    serchByGameType (type) {
      if (type === 0) {
        this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name' })
      } else {
        this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gametypeid: type })
      }
    },

    /*
    * 根据游戏名称查找游戏
    */
    ChangeValue (data) {
      this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gamename: data })
    },

    /*
    * 获取盘符
    */
    async GetDriver () {
      try {
        let resp = await getLogicalDrives()
        this.disk = resp.data
        this.disk.forEach(item => { item.free_space = bytesToSize2(item.FreeSpace) })
        this.Dg.data = this.disk[0].DeviceID
      } catch (error) {
        this.$Message.error(this.$t(`${error.data.error}`))
      }
    },

    /*
    * 整理数据
    */
    handleDownGame (id) {
      if (typeof id !== 'string' && this.getCheckboxVal.length === 0) {
        this.notifyUser('error', 'PleaseSelectAtLeastOneItemInTheList')
        return
      } else if (typeof id === 'string') {
        this.CenterId = [{ Id: id }]
      } else if (this.getCheckboxVal.length !== 0) {
        this.CenterId = this.getCheckboxVal
      }
      this.DownloadGameUp = true
      this.GetDriver()
    },

    /**
     * 下载游戏
     */
    handleSubmit () {
      this.CenterId.forEach(async item => {
        this.loadBtn = true
        let resp = await download(this, item.Id, this.Dg.data + '\\')
        if (resp !== 0) {
          this.DownloadGameUp = false
          this.loadBtn = false
          this.notifyUser('success', resp.data)
          this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: '' })
        }
        this.loadBtn = false
      })
    },
    /**
     * 修复游戏
     */
    handleButtonFixGame (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.notifyUser('error', 'PleaseSelectAtLeastOneItemInTheList')
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

    compareAsc (x) {
      return function (obj1, obj2) {
        var p = obj1[x]
        var o = obj2[x]
        return o - p
      }
    },

    compareDesc (x) {
      return function (obj1, obj2) {
        var p = obj1[x]
        var o = obj2[x]
        return p - o
      }
    },
    async sortOrder ({ columns, key, order }) {
      this.soreFlag = true
      if (order === 'desc') {
        let resp = await getAllGame({ offset: 0, limit: this.max, orderby: 'Name', gametypeid: '' })
        this.sortData = resp.data.data.sort(this.compareAsc('Size'))
        this.tableData = this.sortData.slice(this.pageInfo.page_index * this.Pagelimit, this.pageInfo.page_index * this.Pagelimit + this.Pagelimit)
      } else {
        let resp = await getAllGame({ offset: 0, limit: this.max, orderby: 'Name', gametypeid: '' })
        this.sortData = resp.data.data.sort(this.compareDesc('Size'))
        this.tableData = this.sortData.slice(this.pageInfo.page_index, this.Pagelimit)
      }
    },
    /**
     * 获取游戏类型
     */
    HandleGetGame () {},
    async handleGetGameType () {
      try {
        let resp = await getAllCenterGameTypes()
        this.gameList = [
          { id: 0, dispaly_name: this.$t('AllGame') }
        ]
        if (resp.data.lenght !== 0) {
          resp.data.forEach(item => {
            this.gameList.push(item)
          })
        }
        this.model1 = this.gameList[0].id
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
     *  分页
     *
    */
    handleGetTableList (e) {
      if (this.soreFlag) {
        this.tableData = this.sortData.slice((e - 1) * this.Pagelimit, (e - 1) * this.Pagelimit + this.Pagelimit)
      } else {
        this.handleGetGameList({ offset: (e - 1) * this.Pagelimit, limit: this.Pagelimit, orderby: 'Name', gamename: this.GameName })
      }
    },
    /**
     * 删除多个游戏
     */
    handleButtonRemove (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.notifyUser('error', 'PleaseSelectAtLeastOneItemInTheList')
      } else {
        if (this.getCheckboxVal.length > 1) {
          this.$Modal.confirm({
            title: this.$t('DeleteTip'),
            content: this.$t('DeleteCurrentData'),
            cancelText: this.$t('cancelText'),
            okText: this.$t('Confirm'),
            loading: true,
            onOk: () => {
              this.getCheckboxVal.forEach(item => {
                deleteGame(item.Id).then(
                  resp => {
                  },
                  (e) => {
                    this.notifyUser('error', `${e.data.error}`)
                    this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: '' })
                  }
                ).finally(() => {
                  this.$Modal.remove()
                })
              })
              this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: '' })
            },
            onCancel: () => {
              this.$Modal.remove()
            }
          })
        } else {
          this.handleRemove(this.getCheckboxVal[0])
        }
      }
    },
    /**
     * 删除游戏
     */
    async handleRemove (index) {
      this.$Modal.confirm({
        title: this.$t('DeleteTip'),
        okText: this.$t('Confirm'),
        cancelText: this.$t('cancelText'),
        content: this.$t('DeleteDec'),
        'closable': true,
        loading: true,
        onOk: () => {
          deleteGame(index.Id).then((e) => {
            this.notifyUser('success', 'sucess')
          }, (e) => {
            this.notifyUser('error', `${e.data.error}`)
          }).catch(() => {
            this.notifyUser('error', `${'kxLinuxErr.10'}`)
          }).finally(() => {
            this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: '' })
            this.$Modal.remove()
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
    /**
     * 修复游戏
     */
    handleFixGame (index) {
      repairGame(index.Id).then((e) => {
        // this.notifyUser('success', `${'repairSucess'}`)
      }, (e) => {
        this.notifyUser('error', `${e.data.error}`)
      }).catch((e) => {
        this.notifyUser('error', `${e}`)
      }).finally(() => {
        this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: '' })
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

