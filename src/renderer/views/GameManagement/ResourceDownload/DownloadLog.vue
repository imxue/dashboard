<template>
  <div>
    <div class="topItem">
      <DatePicker size="large" type="date" :placeholder="$t('PleaseDate')" @on-change="handleChangeDate" ></DatePicker>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" stripe :no-data-text="this.$t('Nodata')"></Table>
    <Row style="margin-top:10px; ">
      <Page :total="100" style=" float:right;"/>
    </Row>
    
  </div>
</template>

<script>
import { getDownloadLogs } from '@/api/localGame'
export default {
  name: 'subType2-2',
  data () {
    return {
      tableColumns: [
        {
          renderHeader: (h, params) => { return h('span', this.$t('Status')) },
          key: 'state',
          render: (h, params) => {
            let type = params.row.state
            switch (type) {
              case 0:
                return h('span', { style: { color: '#008000' } }, this.$t('success'))
              case 1:
                return h('span', { style: { color: '#ff0000' } }, this.$t('fail'))
            }
          }
        },
        { title: '游戏类型', key: 'type', renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
        { title: '游戏名称', key: 'name', renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
        { title: '下载版本', key: 'version', renderHeader: (h, params) => { return h('span', this.$t('DownloadVersion')) } },
        { title: '更新量', key: 'updateSize', renderHeader: (h, params) => { return h('span', this.$t('UpdateVolume')) } },
        { title: '开始时间', key: 'startTime', renderHeader: (h, params) => { return h('span', this.$t('StartingTime')) } },
        { title: '结束时间', key: 'endTime', renderHeader: (h, params) => { return h('span', this.$t('EndTime')) } },
        { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
          key: 'operation',
          render: (h, params) => {
            let type = params.row.state
            // let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
            //   on: { click: () => { this.handleTableDw(params.row) } }
            // }, this.$t('DownloadAgain'))
            let c = h('Button',
              { style: { marginRight: '10px' },
                props: { type: 'primary', size: 'small' },
                on: { click: () => { this.handleTableDw(params.row) } }
              }, this.$t('RepairGame'))
            switch (type) {
              case 1:
                return h('div', [c])
              default:
                return h('div', '-')
            }
          }
        }
      ],
      tableData: []
    }
  },
  created () {
    this.handTableData(0, 10, '2019-04-23 10:41:05')
    console.log(this.$t('x'))
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    handleChangeDate (data) {
      alert(data)
    },
    handleTableDw (index) {
      var currId = index.id
      alert(currId)
    },
    handTableData (offset, limit, SearchDate) {
      getDownloadLogs(offset, limit, SearchDate).then((response) => {
        this.tableData = response.data.data.data
      }, (err) => {
        console.log(err)
      }).catch((err) => {
        console.log(err)
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

