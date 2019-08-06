<template>
  <div>
    <div class="topItem">
      <Input class="topColumn" search :enter-button="$t('Search')" :placeholder="$t('PleaseInputGameName')" clearable style="width: 200px;" />
      <!-- <Button type="primary" class="topColumn" @click="handleButtonDW">{{$t('Download')}}</Button> -->
      <Button type="primary" class="topColumn" @click="handleButtonFixGame">{{$t('repair')}}</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="SystemTool"  @on-selection-change="handleCheckBox" stripe></Table>
    <Row style="margin-top:10px; ">
       <!-- <i-col span="4">{{$t('Resource')}}：{{this.pageInfo.count}}{{$t('Downloaded')}}：{{DownLoadCount}}</i-col> -->
       <Page :total="this.pageInfo.count" :current="pageInfo.page_index + 1" :page-size="this.Pagelimit" @on-change="handleGetTableList" style=" float:right;"/>
    </Row>
    
  </div>
</template>

<script>
import { getSystemTools } from '@/api/localGame'
export default {
  name: 'SystemTool',
  data () {
    return {
      getCheckboxVal: [], // 勾选复选框值
      tableSelectVal: [],
      tableColumns: [
        { type: 'selection', width: 60, align: 'center' },
        {
          renderHeader: (h, params) => { return h('span', this.$t('Status')) },
          key: 'State',
          render: (h, params) => {
            let type = params.row.State
            switch (type) {
              case 0:
                return h('span', this.$t('LatestVersion'))
              case 1:
                return h('span', { style: { color: '#999999' } }, this.$t('Undownload'))
              case 2:
                return h('span', { style: { color: '#008000' } }, this.$t('Updating'))
              case 3:
                return h('span', { style: { color: '#ff0000' } }, this.$t('UpdateFailed'))
              default:
                return '-'
            }
          }
        },
        { key: 'TypeName', renderHeader: (h, params) => { return h('span', this.$t('Type')) } },
        { key: 'Name', renderHeader: (h, params) => { return h('span', this.$t('ToolName')) } },
        { key: 'Size', renderHeader: (h, params) => { return h('span', this.$t('ToolSize')) } },
        { key: 'CenterVersion', renderHeader: (h, params) => { return h('span', this.$t('CenterVersion')) } },
        { key: 'LocalVersion', renderHeader: (h, params) => { return h('span', this.$t('LocalVersion')) } },
        { key: 'DownloadPath', renderHeader: (h, params) => { return h('span', this.$t('localPath')) } }
      ],
      SystemTool: [],
      pageInfo: {
        count: '',
        page_index: '',
        page_size: ''
      },
      Pagelimit: 10
    }
  },
  created () {
    this.handleGetTable(0, 10, 'name', '无盘')
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    handleGetTable (offset, limit, orderby, gamename) {
      getSystemTools(offset, limit, orderby, gamename).then((resp) => {
        this.SystemTool = resp.data.data
        this.pageInfo = resp.data.pageino
      })
    },
    handleGetTableList (e) {
      this.handleGetTable((e - 1) * this.Pagelimit, this.Pagelimit, 'Name', '无盘')
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
    handleButtonFixGame (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
      } else {
        this.$Message.info('修复中，请耐心等待……')
      }
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

