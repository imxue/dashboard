<template>
  <div>
    <div class="topItem">
      <Input class="topColumn" v-model="searchVal" search enter-button="搜索" placeholder="请输入游戏首字母..." clearable style="width: 200px;" />
      <Button type="primary" class="topColumn" @click="handleButtonAdd">添加</Button>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonEdit">编辑</Button> -->
      <Button type="primary" class="topColumn" @click="handleButtonSync">同步</Button>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonMore">批量操作</Button> -->
      <Button type="primary" class="topColumn" @click="handleButtonDelete">删除</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox"></Table>
    <Row style="margin-top:10px; ">
      <i-col span="4">资源：3000 &nbsp;&nbsp;&nbsp;&nbsp;已下载：1000</i-col>
      <i-col span="20"><Page :current="currentPage" :page-size="pageSize" :total="totalPageNumber" show-total style=" float:right;" @on-change="hanbleChangePage"/></i-col>
    </Row>
  </div>
</template>

<script>
  import { getNetbarGame, netbarMultiSync } from '@/api/localGame'
  export default {
    name: 'subType3-2',
    data () {
      return {
        searchVal: '',
        curroffset: 0,
        currlimit: 10,
        totalPageNumber: 0,
        pageSize: 10,
        currentPage: 1,
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        getCheckboxIds: [], // 勾选复选框值ids
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: '游戏名称', key: 'Name' },
          { title: '游戏热度', key: 'Centerpopularity' },
          { title: '今日点击', key: 'TodayClick' },
          { title: '总点击数', key: 'TotalClick' },
          { title: '游戏大小', key: 'Size' },
          { title: '服务器路径', key: 'Localpath' },
          { title: '客户机路径', key: 'RunPath' },
          { title: '操作',
            key: 'operation',
            render: (h, params) => {
              // let type = params.row.state
              let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
                on: { click: () => { this.handleTableEdit(params.row) } }
              }, '编辑')
              let b = h('span', {
                style: { color: '#2d8cf0', textDecoration: 'underline' },
                on: { click: () => { this.handleTableDelete(params.row) } }
              }, '删除')
              switch (params) {
                // case 0:
                //   return h('div', [a, b])
                // case 1:
                //   return h('span', [c])
                // case 2:
                //   return h('span', [b])
                default:
                  return h('span', [a, b])
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
        var listQuery = ''
        if (this.searchVal !== '') {
          listQuery = '?keyword=' + this.searchVal + '&offset=' + offset + '&limit=' + limit
        } else {
          listQuery = '?offset=' + offset + '&limit=' + limit
        }
        getNetbarGame(listQuery).then((a) => {
          var datalist = a.data.Data.List
          if (a.data.Code === 0) {
            if (datalist === null) {
              this.data = null
              this.tableData = []
            } else {
              this.tableData = a.data.Data.List
              this.totalPageNumber = Number(a.data.Data.TotalCount)
              this.currentPage = Number(a.data.Data.PageNo)
              this.pageSize = Number(a.data.Data.PageSize)
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
      handleButtonAdd () {
        this.$router.push({ path: 'subtype3-2-add' })
        // val = this.getCheckboxVal.length
        // if (val === 0) {
        //   this.$Message.error('请至少选择列表中的一项')
        // } else {
        //   this.$router.push({
        //     path: 'subtype3-2-add',
        //     query: { id: this.getCheckboxVal }
        //   })
        // }
      },
      handleButtonEdit (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$router.push({
            path: 'subtype3-2-edit',
            query: { id: this.getCheckboxVal, type: 'multiEdit' }
          })
        }
      },
      handleButtonSync (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          netbarMultiSync(this.getCheckboxVal).then((res) => {
            this.handleCallBackVaild(res)
          }, () => {
            this.$Message.error('请求出错，请稍后再试')
          })
        }
      },
      handleButtonDelete (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          // this.handleGetIds()
          this.$router.push({
            path: 'subtype3-delete',
            query: { ids: this.getCheckboxVal }
          })
        }
      },
      handleCheckBox (arr) {
        var data = arr
        var list = []
        for (var i in arr) {
          list.push(data[i].Id)
        }
        this.getCheckboxVal = list
        return this.getCheckboxVal
      },
      handleTableEdit (index) {
        this.$router.push({
          path: 'subtype3-2-edit',
          query: { data: index, type: 'edit' }
        })
      },
      handleTableFix (index) {
        this.getCheckboxVal = this.tableSelectVal.push(index.id)
        // alert(this.getCheckboxVal)
        this.$router.push({
          path: 'subtype3-2-fix',
          query: { id: this.getCheckboxVal }
        })
      },
      handleTableDelete (index) {
        var list = []
        this.tableSelectVal = list.concat(index.Id)
        // alert(this.getCheckboxVal)
        this.$router.push({
          path: 'subtype3-delete',
          query: { ids: this.tableSelectVal }
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

