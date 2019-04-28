<template>
  <div>
    <div class="topItem">
      <Select v-model="model1"  class="topColumn" style="width:150px;">
        <Option v-for="item in gameList" :value="item.value" :key="item.value" placeholder="全部游戏类型">{{ $t(item.label) }}</Option>
      </Select>
      <Input class="topColumn" search :enter-button="$t('Search')" :placeholder="$t('PleaseInputGameName')" clearable style="width: 200px;" />
      <Button type="primary" class="topColumn" @click="handleButtonDW">{{$t("Download")}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonFixGame">{{$t("repair")}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonRemove">{{$t("LocalRemoval")}}</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData"  @on-selection-change="handleCheckBox" stripe :no-data-text="this.$t('Nodata')"></Table>
    <Row style="margin-top:10px; ">
      <i-col span="8">{{$t("Resource")}}：3000 &nbsp;&nbsp;&nbsp;&nbsp;{{$t("Downloaded")}}：1000</i-col>
      <i-col span="16"><Page :total="100"  style=" float:right;"/></i-col>
    </Row>
    
  </div>
</template>

<script>
import { getTodayUpdateGames } from '@/api/localGame'
export default {
  name: 'subType1-1',
  data () {
    return {
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
          key: 'state',
          render: (h, params) => {
            let type = params.row.state
            switch (type) {
              case 0:
                return h('span', '最新版本')
              case 1:
                return h('span', { style: { color: '#999999' } }, '未下载')
              case 2:
                return h('span', { style: { color: '#008000' } }, '更新中')
              default:
                return '-'
            }
          }
        },
        { title: '游戏类型', key: 'type', renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
        { title: '游戏名称', key: 'name', renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
        { title: '当前热度', key: 'hot', renderHeader: (h, params) => { return h('span', this.$t('Popularity')) } },
        { title: '游戏大小', key: 'size', renderHeader: (h, params) => { return h('span', this.$t('Size')) } },
        { title: '中心游戏版本', key: 'versionCenter', renderHeader: (h, params) => { return h('span', this.$t('CenterVersion')) } },
        { title: '本地游戏版本', key: 'versionLocal', renderHeader: (h, params) => { return h('span', this.$t('LocalVersion')) } },
        { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
          key: 'operation',
          render: (h, params) => {
            let type = params.row.state
            let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
              on: { click: () => { this.handleFixGame(params.row) } }
            }, '修复游戏')
            let b = h('span', {
              style: { color: '#2d8cf0', textDecoration: 'underline' },
              on: { click: () => { this.handleRemove(params.row) } }
            }, '本地移除')
            let c = h('span', {
              style: { color: '#2d8cf0', textDecoration: 'underline' },
              on: { click: () => { this.handleTableDw(params.row) } }
            }, '下载游戏')
            switch (type) {
              case 0:
                return h('div', [a, b])
              case 1:
                return h('span', [c])
              case 2:
                return h('span', [b])
              default:
                return '-'
            }
          }
        }
      ],
      tableData: [
        { id: 0, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' },
        { id: 1, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' },
        { id: 2, state: 2, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' },
        { id: 3, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' },
        { id: 4, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' },
        { id: 5, state: 2, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' },
        { id: 6, state: 2, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' },
        { id: 7, state: 2, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' }
      ]
    }
  },
  created () {
    getTodayUpdateGames(0, 10, 'Name').then((response) => {
      this.tableData = response.data.data
      console.log(response)
    })
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    handleButtonDW (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error('请至少选择列表中的一项')
      } else {
        this.$router.push({
          path: 'subtype1-download',
          query: { id: this.getCheckboxVal }
        })
      }
    },
    handleButtonFixGame (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error('请至少选择列表中的一项')
      } else {
        this.$Message.info('修复中，请耐心等待……')
      }
    },
    handleButtonRemove (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error('请至少选择列表中的一项')
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
    handleCheckBox (arr) {
      var data = arr
      var list = []
      for (var i in arr) {
        list.push(data[i].id)
      }
      this.getCheckboxVal = list.join(',')
      console.log(this.getCheckboxVal)
      return this.getCheckboxVal
    },
    handleTableDw (index) {
      this.getCheckboxVal = this.tableSelectVal.push(index.id)
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
      // alert(this.getCheckboxVal)
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

