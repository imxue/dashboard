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
  import { getSyncLog, resync } from '@/api/sync'
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
          {
            renderHeader: (h, params) => { return h('span', this.$t('result')) },
            key: 'state',
            render: (h, params) => {
              let type = params.row.state
              switch (type) {
                case 0:
                  return h('span', { style: { color: '#25da30' } }, this.$t('success'))
                case 1:
                  return h('span', { style: { color: '#ff0000' } }, 'this.$t("fail")')
                default:
                  return '-'
              }
            }
          },
          { title: '游戏类型', key: 'Type', renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
          { title: '游戏名称', key: 'Dispalyname', width: 120, renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
          { title: '热度', key: 'Centerpopularity', renderHeader: (h, params) => { return h('span', this.$t('Popularity')) } },
          { title: '目标服务器地址', width: 120, key: 'Localpath', renderHeader: (h, params) => { return h('span', this.$t('TargetServerAddress')) } },
          { title: '源路径', key: 'Ip', width: 120, renderHeader: (h, params) => { return h('span', this.$t('SourcePath')) } },
          { title: '目标路径', key: 'Dir', renderHeader: (h, params) => { return h('span', this.$t('TargetPath')) } },
          { title: '开始时间', key: 'BeginSyncTime', renderHeader: (h, params) => { return h('span', this.$t('StartingTime')) } },
          { title: '结束时间', key: 'EndSyncTime', renderHeader: (h, params) => { return h('span', this.$t('EndTime')) } },
          { title: '错误信息', key: 'ErrorInfo', renderHeader: (h, params) => { return h('span', this.$t('ErrorMessage')) } },
          { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            key: 'operation',
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
      this.handleGetTableList(this.curroffset, this.currlimit)
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleGetTableList (offset, limit) {
        var listQuery = '?offset=' + offset + '&limit=' + limit
        getSyncLog(listQuery).then((a) => {
          var datalist = a.data.Data.List
          if (a.data.Code === 0) {
            if (datalist === null) {
              this.data = null
              this.tableData = []
            } else {
              this.tableData = a.data.Data.List
              this.totalPageNumber = Number(a.data.Data.TotalCount)
              this.currentPage = Number(a.data.Data.PageNo)
              this.pageSize = Number(a.data.Data.TotalPage)
            }
          } else {
            this.$Message.error(a.data.Msg)
          }
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

