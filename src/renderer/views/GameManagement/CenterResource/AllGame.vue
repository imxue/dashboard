<template>
  <div>
    <Modal v-model="DownloadGameUp" draggable scrollable :title="$t('DownloadGames')" footer-hide>
        <Form ref='Dg'  :model='Dg' label-position="left" :label-width="80" style="width: 300px">
          <FormItem :label="$t('DiskSymbol')" label-position="left">
            <Select v-model="Dg.data" :placeholder="$t('Search')" >
              <Option v-for='item in disk' v-bind:value='item' v-bind:key='item'>{{item}}</Option>
            </Select>
            </FormItem> 
              <FormItem>
            <Button type="primary" @click="handleSubmit('Dg')">{{$t('DownloadGames')}}</Button>
            <Button @click="handleReset()" style="margin-left: 8px">{{$t('cancelText')}}</Button>
        </FormItem>
        </Form>
    </Modal>
    <div class="topItem">
      <Select v-model="model1"  class="topColumn" style="width:150px;" :placeholder="$t('pleaseInput')">
        <Option v-for="item in gameList" :value="item.value" :key="item.value">{{ $t(item.label) }}</Option>
      </Select>
      <Input class="topColumn" search :enter-button="$t('Search')" :placeholder="$t('PleaseInputGameName')" clearable style="width: 200px;" />
      <!-- <Button type="primary" class="topColumn" @click="handleButtonDW">{{$t('Download')}}</Button> -->
      <Button type="primary" class="topColumn" @click="handleButtonFixGame">{{$t('repair')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonRemove">{{$t('LocalRemoval')}}</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" stripe :no-data-text="this.$t('Nodata')"></Table>
    <Row style="margin-top:10px; ">
      <i-col span="5">{{$t('Resource')}}：{{this.pageInfo.count}} &nbsp;&nbsp;&nbsp;&nbsp;{{$t('Downloaded')}}：{{DownLoadCount}}</i-col>
      <i-col span="19"><Page :total="this.pageInfo.count" :current="pageInfo.page_size" :page-size="10" @on-change="handleGetTableList" style=" float:right;"/></i-col>
    </Row>
  </div>
</template>

<script>
import { getAllGame, getLogicalDrives, downloadGame, repairGame } from '@/api/localGame'
export default {
  name: 'allGame',
  data () {
    return {
      pageCount: '',
      disk: '',
      pageInfo: '',
      DownLoadCount: '0', // 已下载的数
      Dg: {
        data: ''
      },
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
        { type: 'selection', width: 60, align: 'center' },
        {
          renderHeader: (h, params) => { return h('span', this.$t('CurrentStatus')) },
          key: 'State',
          render: (h, params) => {
            let type = params.row.State
            switch (type) {
              case 0:
                return h('span', '未下载')
              case 1:
                return h('span', { style: { color: '#999999' } }, '待更新')
              case 2:
                return h('span', { style: { color: '#008000' } }, '更新中')
              case 3:
                return h('span', { style: { color: '#008000' } }, '最新版本')
              default:
                return '-'
            }
          }
        },
        { key: 'TypeName', renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
        { key: 'Name', renderHeader: (h, params) => { return h('span', this.$t('Name')) } },
        { key: 'Popularity', renderHeader: (h, params) => { return h('span', this.$t('Popularity')) } },
        { key: 'Size', renderHeader: (h, params) => { return h('span', this.$t('Size')) } },
        { key: 'CenterVersion', renderHeader: (h, params) => { return h('span', this.$t('CenterVersion')) } },
        { key: 'LocalVersion', renderHeader: (h, params) => { return h('span', this.$t('LocalVersion')) } },
        { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
          key: 'operation',
          render: (h, params) => {
            let type = params.row.State
            let a = h('Button',
              { style: { color: '#2d8cf0', marginRight: '10px' },
                on: { click: () => { this.handleFixGame(params.row) } }
              }, this.$t('RepairGame'))
            let b = h('Button', {
              style: { color: '#2d8cf0' },
              on: { click: () => { this.handleRemove(params.row) } }
            }, this.$t('LocalRemoval'))
            let c = h('Button', {
              style: { color: '#2d8cf0' },
              on: { click: () => { this.handleDownGame(params.row.Id) } }
            }, this.$t('DownloadGames'))
            switch (type) {
              case 0:
                return h('div', [c])
              case 1:
                return h('span', [a, b])
              case 2:
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
    this.handgetAllGame(0, 10, 'Name')
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    /**
     * 获取全部游戏
     */
    handgetAllGame (offset, limit, orderby) {
      getAllGame(offset, limit, orderby).then(response => {
        if (response.data.data instanceof Array) {
          this.tableData = response.data.data
          this.pageInfo = response.data.pageino
          this.DownLoadCount = this.tableData.filter(item => { return item.State !== 0 }).length
        }
      }, (e) => {
        this.$Notice.error({ desc: '' + e, duration: 0 })
      }).catch((e) => {
        this.$Notice.error({ desc: '' + e, duration: 0 })
      })
    },
    handleGetTableList (e) {
      this.handgetAllGame((e - 1) * 2, 2, 'Name')
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
      let info = { CenterGameId: this.deleteid, DiskSymbol: this.Dg.data + '\\' }
      downloadGame(info.CenterGameId, info.DiskSymbol).then(() => {
        this.DownloadGameUp = false
        getAllGame()
      }).catch((e) => {
        this.$Notice.error({ desc: '' + e, duration: 0 })
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
      }).catch(() => { this.$Message.info(this.$t('Getdiskinformationerror')) })
    },
    handleButtonFixGame (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
      } else {
        // this.$Message.info('修复中，请耐心等待……')
        repairGame(this.getCheckboxVal[0].Id).then((e) => {
          this.$Message.info(e.data)
        })
      }
    },
    handleButtonRemove (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
      } else {
        this.$router.push({
          path: 'subtype1-remove',
          query: { id: this.getCheckboxVal }
        })
      }
    },
    test () {
      let matched = this.$route.matched.filter(item => item.name)
      console.log(matched)
    },
    handleReset () {
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
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>

