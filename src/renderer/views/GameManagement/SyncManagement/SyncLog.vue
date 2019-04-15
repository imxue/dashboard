<template>
  <div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData"></Table>
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
            title: '结果',
            key: 'state',
            render: (h, params) => {
              let type = params.row.state
              switch (type) {
                case 0:
                  return h('span', { style: { color: '#25da30' } }, '完成')
                case 1:
                  return h('span', { style: { color: '#ff0000' } }, '失败')
                default:
                  return '-'
              }
            }
          },
          { title: '游戏类型', key: 'Type' },
          { title: '游戏名称', key: 'Dispalyname' },
          { title: '热度', key: 'Centerpopularity' },
          { title: '目标服务器地址', key: 'Localpath' },
          { title: '源路径', key: 'Ip' },
          { title: '目标路径', key: 'Dir' },
          { title: '开始时间', key: 'BeginSyncTime' },
          { title: '结束时间', key: 'EndSyncTime' },
          { title: '错误信息', key: 'ErrorInfo' },
          { title: '操作',
            key: 'operation',
            render: (h, params) => {
              let type = params.row.id
              let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
                on: { click: () => { this.handleTableResync(params.row) } }
              }, '重新同步')
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
          this.$Message.error('请求出错，请稍后再试')
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
          this.$Message.error('请求出错，请稍后再试')
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

