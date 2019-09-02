<template>
  <div>
    <div class="topItem">
      <DatePicker size="large" type="date" :placeholder="$t('PleaseDate')" @on-change="handleChangeDate" v-model="timer"></DatePicker>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" stripe :no-data-text="this.$t('Nodata')"></Table>
    <Row style="margin-top:10px; ">
      <Page :total="this.pageInfo.count" show-total :current="Number(pageInfo.page_index + 1)" :page-size="this.Pagelimit" @on-change="handleGetTableList" style=" float:right;"/></Col>
    </Row>
    
  </div>
</template>

<script>
import { getDownloadLogs, repairGame } from '@/api/localGame'
export default {
  name: 'subType2-2',
  data () {
    return {
      pageInfo: {
        count: 0,
        page_index: ''
      },
      Pagelimit: 10,
      offset: 0,
      tableColumns: [
        {
          renderHeader: (h, params) => { return h('span', this.$t('Status')) },
          key: 'state',
          render: (h, params) => {
            let type = params.row.state
            switch (type) {
              case 1:
                return h('span', { style: { color: '#008000' } }, this.$t('success'))
              case 2:
                return h('span', { style: { color: '#ff0000' } }, this.$t('fail'))
            }
          }
        },
        { title: '游戏类型', key: 'type_name', renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
        { title: '游戏名称', key: 'display_name', renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
        { title: '下载版本', key: 'version_name', renderHeader: (h, params) => { return h('span', this.$t('DownloadVersion')) } },
        { title: '更新量',
          key: 'total_bytes',
          renderHeader: (h, params) => { return h('span', this.$t('UpdateVolume')) }
        },
        { title: '开始时间',
          key: 'start_time',
          minWidth: 80,
          renderHeader: (h, params) => { return h('span', this.$t('StartingTime')) },
          render: (h, params) => {
            return h('span', this.formatTime1(params.row.start_time))
          }
        },
        { title: '结束时间',
          key: 'end_time',
          minWidth: 80,
          renderHeader: (h, params) => { return h('span', this.$t('EndTime')) },
          render: (h, params) => {
            return h('span', this.formatTime1(params.row.end_time))
          }
        },
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
              case 2:
                return h('div', [c])
              case 1:
                return h('div', '-')
            }
          }
        }
      ],
      tableData: [],
      timer: new Date()
    }
  },
  created () {
    let x = this.formatTime(this.timer)
    this.handTableData(this.offset, this.Pagelimit, x.toString())
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    formatTime (date) {
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month.toString()
      if (('' + month) && month.length < 2) {
        month = '0' + month
      }
      let day = date.getDate()
      // let houters = date.getHours()
      // let Minutes = date.getMinutes()
      // let Seconds = date.getSeconds()
      // Seconds = Seconds.toString()
      // if (('' + Seconds) && Seconds.length < 2) {
      //   Seconds = '0' + Seconds
      // }
      return `${year}-${month}-${day}`
    },
    formatTime1 (item) {
      let date = new Date(item)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month.toString()
      if (('' + month) && month.length < 2) {
        month = '0' + month
      }
      let day = date.getDate()
      let houters = date.getHours()
      let Minutes = date.getMinutes()
      let Seconds = date.getSeconds()
      Seconds = Seconds.toString()
      if (('' + Seconds) && Seconds.length < 2) {
        Seconds = '0' + Seconds
      }
      return `${year}-${month}-${day} ${houters}:${Minutes}:${Seconds}`
    },
    handleChangeDate (data) {
      this.timer = data.toString()

      this.handTableData(0, 10, this.timer)
    },
    handleTableDw (index) {
      repairGame(index.game_id).then(resp => {
        this.handTableData(0, 10, this.timer)
      }, err => {
        console.log(err)
      })
    },
    /**
     *
     * 下载日志
     */
    handTableData (offset, limit, SearchDate) {
      getDownloadLogs(offset, limit, SearchDate).then((response) => {
        this.tableData = response.data.data
        this.pageInfo = response.data.pageino
      }, (err) => {
        this.$Message.info({
          content: this.$t(err.data.error),
          closable: true
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     *  分页
     *
    */
    handleGetTableList (e) {
      this.handTableData((e - 1) * this.Pagelimit, this.Pagelimit, this.formatTime(this.timer).toString())
    }
  }
}
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>

