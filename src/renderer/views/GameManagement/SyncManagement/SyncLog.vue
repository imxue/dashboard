<template>
  <div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" stripe :no-data-text="this.$t('Nodata')"></Table>
    <Row style="margin-top:10px; ">
      <Page :current="currentPage" :total="totalPageNumber" show-total  @on-change="hanbleChangePage" style=" float:right;"/>
    </Row>
    
  </div>
</template>

<script>
  import { getAllSyncGameLogs, resync } from '@/api/sync'
  export default {
    name: 'subType4-3',
    data () {
      return {
        curroffset: 0,
        currlimit: 10,
        totalPageNumber: 0,
        pageSize: 10,
        currentPage: 1,
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: '游戏名称', minWidth: 130, key: 'display_name', width: 120, renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
          {
            renderHeader: (h, params) => { return h('span', this.$t('result')) },
            width: 80,
            key: 'sync_result',
            render: (h, params) => {
              let type = params.row.sync_result
              switch (type) {
                case 0:
                  return h('span', { style: { color: '#25da30' } }, this.$t('success'))
                case 3:
                  return h('span', { style: { color: '#ff0000' } }, this.$t('fail'))
                default:
                  return '-'
              }
            }
          },
          { title: '游戏类型', minWidth: 130, key: 'game_type', renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
          { title: '热度', minWidth: 130, key: 'popularity', renderHeader: (h, params) => { return h('span', this.$t('Popularity')) } },
          { title: '目标服务器地址', minWidth: 130, key: 'server_ip', renderHeader: (h, params) => { return h('span', this.$t('TargetServerAddress')) } },
          { title: '源路径', key: 'src_dir', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('SourcePath')) } },
          { title: '目标路径', minWidth: 130, key: 'dst_dir', renderHeader: (h, params) => { return h('span', this.$t('TargetPath')) } },
          { title: '开始时间', key: 'start_time', minWidth: 100, renderHeader: (h, params) => { return h('span', this.$t('StartingTime')) } },
          { title: '结束时间', minWidth: 130, key: 'end_time', renderHeader: (h, params) => { return h('span', this.$t('EndTime')) } },
          { title: '错误信息', minWidth: 100, key: 'error', renderHeader: (h, params) => { return h('span', this.$t('ErrorMessage')) } },
          { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            key: 'operation',
            minWidth: 130,
            render: (h, params) => {
              let type = params.row.id
              let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
                on: { click: () => { this.handleTableResync(params.row) } }
              }, this.$t('Resync'))
              switch (type) {
                // case 0:
                //   return h('div', [a])
                default:
                  return h('span', [a])
              }
            }
          }
        ],
        tableData: []
      }
    },
    created () {
      this.handleGetTableList(0, 10)
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleGetTableList (offset, limit) {
        let info = {
          offset: offset,
          limit: limit
        }
        getAllSyncGameLogs(info).then((resp) => {
          this.tableData = resp.data.data
        }, () => {
          this.$Message.error(this.$t('RequestErrorPleaseTryAgainLater'))
        })
      },
      hanbleChangePage (num) {
        if (num === 1) {
          num = 0
        } else {
          num = (this.currlimit * num) - this.currlimit
        }
        this.handleGetTableList(num, this.currlimit)
      },
      handleCallBackVaild (res) {
        var code = res.data.Code
        if (code === 0 || res.data.state === 'OK') {
          this.$Message.success('操作成功')
        } else {
          this.$Message.error('操作失败：' + res.data.Msg)
        }
      },
      handleTableResync (index) { // 重新同步
        resync(index.Id).then((res) => {
          this.handleCallBackVaild(res)
        }, () => {
          this.$Message.error(this.$t('RequestErrorPleaseTryAgainLater'))
        })
      },
      changePage (key, type) {
        console.log('排序字段:' + key)
        console.log('排序规则:' + type)
      }
    }
  }
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>

