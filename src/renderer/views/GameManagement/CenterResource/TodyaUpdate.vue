<template>
  <div>
    <div class="topItem">
      <Select v-model="model1"  class="topColumn" style="width:150px;" :placeholder="$t('pleaseInput')">
        <Option v-for="item in gameList" :value="item.value" :key="item.value" >{{ $t(item.label) }}</Option>
      </Select>
        <AutoComplete  icon="ios-search" class="topColumn"  :placeholder="$t('PleaseInputGameName')" style="width: 200px;" v-model="value1" :data="GameName" @on-change='ChangeValue' @on-select='showItem' />
      <!-- <Button type="primary" class="topColumn" @click="handleButtonDW">{{$t("Download")}}</Button> -->
      <Button type="primary" class="topColumn" @click="handleButtonFixGame">{{$t("repair")}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonRemove">{{$t("LocalRemoval")}}</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData"  @on-selection-change="handleCheckBox" stripe :no-data-text="this.$t('Nodata')"></Table>
    <Row style="margin-top:10px; ">
      <Col span="6">{{$t('Resource')}}：{{this.pageInfo.count}} {{$t('Downloaded')}}：{{DownLoadCount}}</Col>
      <Col span="18"><Page :total="this.pageInfo.count" :current="pageInfo.page_index" :page-size="PageLimt" @on-change="handleGetTableList" style=" float:right;"/></Col>
    </Row>
    
  </div>
</template>

<script>
import { getTodayUpdateGames, repairGame, deleteGame } from '@/api/localGame'
export default {
  name: 'subType1-1',
  data () {
    return {
      pageInfo: '',
      PageLimt: 10, // 每页显示数
      model1: '',
      getCheckboxVal: [], // 勾选复选框值
      tableSelectVal: [],
      DownLoadCount: '',
      GameName: [], // 游戏名提示
      value1: '',
      temp: [],
      tempx: [],
      gameList: [
        { Id: 0, value: 'HotGame', label: 'HotGame' },
        { Id: 1, value: 'OnlineGame', label: 'OnlineGame' },
        { Id: 2, value: 'ConsoleGame', label: 'ConsoleGame' },
        { Id: 3, value: 'CasualGame', label: 'CasualGame' },
        { Id: 4, value: 'AuxiliaryGame', label: 'AuxiliaryGame' }
      ],
      tableColumns: [
        { type: 'selection', width: 60, align: 'center' },
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
        { title: '游戏类型', minWidth: 120, key: 'TypeName', renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
        { title: '游戏名称', minWidth: 120, key: 'Name', renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
        { title: '当前热度', minWidth: 120, key: 'Popularity', renderHeader: (h, params) => { return h('span', this.$t('Popularity')) } },
        { title: '游戏大小', minWidth: 120, key: 'Size', renderHeader: (h, params) => { return h('span', this.$t('Size')) } },
        { title: '中心游戏版本', minWidth: 130, key: 'CenterVersion', renderHeader: (h, params) => { return h('span', this.$t('CenterVersion')) } },
        { title: '本地游戏版本', minWidth: 130, key: 'LocalVersion', renderHeader: (h, params) => { return h('span', this.$t('LocalVersion')) } },
        { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
          key: 'operation',
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
              props: { type: 'primary', size: 'small' },
              style: { width: '70px' },
              on: { click: () => { this.handleDownGame(params.row.Id) } }
            }, this.$t('DownloadGames'))
            switch (type) {
              case 0:
                return h('div', [c])
              case 1:
                return h('span', [a])
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
    this.handgetAllGame(0, this.PageLimt, 'Name')
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    ChangeValue () {
      debugger
      if (this.value1) {
        this.tempx = []
        this.GameName = this.temp.slice(0, 6)
        let r = new RegExp(`${this.value1}`)
        this.tempx = this.GameAllName.filter(item => {
          return r.test(item)
        })
        this.GameName = this.tempx.slice(0, 6)
        debugger
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
      getTodayUpdateGames(0, 1000000, 'Size').then(response => {
        if (response.data.ok) {
          this.tableDataAll = response.data.data.data
          this.tableData = this.tableDataAll.filter(item => {
            return item.Name === name
          })
        }
      }, (e) => {
        this.$Notice.error({ desc: '' + e, duration: 0 })
      }).catch((e) => {
        this.$Notice.error({ desc: '' + e, duration: 0 })
      })
    },
    /**
     * 获取今日全部最新游戏
     */
    handgetAllHotGame (offset, limit, orderby) {
      getTodayUpdateGames(offset, limit, orderby).then(response => {
        if (response.data.ok) {
          this.tableData = response.data.data.data
          response.data.data.data.filter(item => {
            if (item.Name) {
              this.GameName.push(item.Name)
            }
            this.GameAllName = Array.from(this.GameName)
            this.GameName = this.GameName.slice(0, 6)
            this.temp = Array.from(this.GameAllName)
          })
          this.pageInfo = response.data.data.pageino
          this.pageInfo.page_index++
          this.DownLoadCount = this.tableData.filter(item => { return item.State !== 0 }).length
        }
      }, (e) => {
        // 这里执行reject状态的
        this.$Message.error(this.$t('kxLinuxErr.36873'))
      }).catch((e) => {
        // 在发送代码错误时执行这里
        this.$Message.error(this.$t('kxLinuxErr.10'))
      })
    },
    /**
     * 获取今日最新游戏
     */
    handgetAllGame (offset, limit, orderby) {
      getTodayUpdateGames(offset, limit, orderby).then((response) => {
        if (response.data.ok) {
          this.tableData = response.data.data.data
          response.data.data.data.filter(item => {
            if (item.Name) {
              this.GameName.push(item.Name)
            }
            this.GameAllName = Array.from(this.GameName)
            this.GameName = this.GameName.slice(0, 6)
            this.temp = Array.from(this.GameAllName)
          })
          this.pageInfo = response.data.data.pageino
          this.pageInfo.page_index++
          this.DownLoadCount = this.tableData.filter(item => { return item.State !== 0 }).length
        }
      })
    },
    /**
     * 获取选取的表格数据
    */
    handleCheckBox (arr) {
      this.getCheckboxVal = arr
      return this.getCheckboxVal
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
    handleGetTableList (e) {
      this.handgetAllGame((e - 1) * this.PageLimt, this.PageLimt, 'Name')
    },
    test () {
      let matched = this.$route.matched.filter(item => item.name)
      console.log(matched)
    },
    handleTableDw (index) {
      this.getCheckboxVal = this.tableSelectVal.push(index.id)
      // alert(this.getCheckboxVal)
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
        if (e.data.ok) {
          this.$Message.error(this.$t('repairSucess'))
        } else {
          this.$Message.error(this.$t('FileNotFound'))
        }
      }, () => {
        this.$Message.error(this.$t('kxLinuxErr.36873'))
      }).catch((e) => {
        this.$Message.error({ desc: '' + e, duration: 0 })
      })
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
            if (e.data.ok) {
              this.$Message.error(this.$t('DeleteGameSucess'))
            } else {
              this.$Message.error(this.$t('FileNotFound'))
            }
          }, () => {
            this.$Message.error(this.$t('kxLinuxErr.36873'))
          }).catch(() => {
            this.$Message.error(this.$t('kxLinuxErr.10'))
          })
        }
      })
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
     * 修复多个游戏
     */
    handleButtonFixGame () {
      let val = this.getCheckboxVal.length
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
    }
  }
}
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>

