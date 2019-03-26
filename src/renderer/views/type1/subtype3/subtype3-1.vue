<template>
  <div>
    <div class="topItem">
      <Row>
        <i-col span="10">
          <Select v-model="optionVal" clearable placeholder="---全部游戏类型---"  class="topColumn" style="width:150px;"  @on-change="handleSelectChange">
            <Option v-for="item in gameList" :value="item.Id" :key="item.Name" >{{ item.Name }}</Option>
          </Select>
          <Input class="topColumn" v-model="searchVal"  placeholder="请输入游戏名称..." clearable style="width: 200px;" />
          <Button type="primary" class="topColumn" @click="handleButtonSearch">搜索</Button>
        </i-col>
        <i-col span="4" offset="10">
          <!-- <Button type="primary" class="topColumn" @click="handleButtonFix">修复</Button> -->
          <Button type="primary" class="topColumn" @click="handleButtonSync">同步</Button>
          <Button type="primary" class="topColumn" @click="handleButtonDelete">删除</Button>
        </i-col>
      </Row>
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
  import { getLocalGame, localMultiSync } from '@/api/localGame'
  import { getDrivers } from '@/api/sync'
  export default {
    name: 'subType3-1',
    data () {
      return {
        optionVal: 0,
        searchVal: '',
        curroffset: 0,
        currlimit: 10,
        totalPageNumber: 0,
        pageSize: 10,
        currentPage: 1,
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        gameList: [],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          {
            title: '状态',
            key: 'State',
            render: (h, params) => {
              let type = params.row.State
              switch (type) {
                case true:
                  return h('span', '最新版本')
                case false:
                  return h('span', { style: { color: '#008000' } }, '更新中')
                default:
                  return '-'
              }
            }
          },
          {
            title: '游戏类型',
            // key: 'GType',
            render: (h, params) => {
              var type = Math.abs(params.row.GType)
              if (type === 999) {
                return h('span', '本吧游戏')
              } else {
                var arr = this.gameList
                for (var name of arr) {
                  if (name.Id === type) {
                    // console.log(name.Name)
                    return h('span', name.Name)
                  }
                }
              }
            }
          },
          { title: '游戏名称', key: 'Name' },
          { title: '游戏热度', key: 'Centerpopularity' },
          { title: '游戏大小', key: 'Size' },
          {
            title: '更新模式',
            key: 'IsAutoupdate',
            render: (h, params) => {
              let type = params.row.IsAutoupdate
              switch (type) {
                case false:
                  return h('span', '手动')
                case true:
                  return h('span', '自动')
                default:
                  return '-'
              }
            }
          },
          { title: '服务器存放路径', key: 'Localpath' },
          { title: '客户机执行路径', key: 'RunPath' },
          { title: '操作',
            key: 'operation',
            render: (h, params) => {
              // let type = params.row.state
              let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
                on: { click: () => { this.handleTableEdit(params.row) } }
              }, '编辑')
              // let b = h('span', {
              //   style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
              //   on: { click: () => { this.handleTableFix(params.row) } }
              // }, '修复')
              let c = h('span', {
                style: { color: '#2d8cf0', textDecoration: 'underline' },
                on: { click: () => { this.handleTableDelete(params.row) } }
              }, '删除')
              switch (params) {
                default:
                  return h('span', [a, c])
              }
            }
          }
        ],
        tableData: []
      }
    },
    created () {
      // console.log(this.$route.matched[0])
      // console.log('hello', JSON.stringify(this.routes))
      // this.test()
      this.handleGetDrivers()
      this.handleGetTableList(this.curroffset, this.currlimit)
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleGetDrivers () {
        getDrivers().then((res) => {
          if (res.data.Code === 0) {
            var arr = res.data.Data.TypeIds
            if (arr === null) {
              this.gameList = null // 全部游戏类型
            } else {
              this.gameList = arr
              // console.log('gameTypeList::' + JSON.stringify(this.gameTypeList))
            }
          } else {
            this.$Message.error(res.data.Msg)
          }
        }, () => {
          this.$Message.error('请求出错，请稍后再试')
        })
      },
      handleSelectChange (index) {
        this.optionVal = index
        // alert(index)
      },
      handleButtonSearch () {
        if (this.optionVal === undefined) {
          this.optionVal = 0
        }
        // alert('selectValue::' + this.optionVal + '&&searchVal::' + this.searchVal)
        this.handleGetTableList(this.curroffset, this.currlimit)
      },
      handleGetTableList (offset, limit) {
        var listQuery = '?keyword=' + this.searchVal + '&gameType=' + this.optionVal + '&offset=' + offset + '&limit=' + limit
        getLocalGame(listQuery).then((a) => {
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
      // handleButtonFix (val) {
      //   val = this.getCheckboxVal.length
      //   if (val === 0) {
      //     this.$Message.error('请至少选择列表中的一项')
      //   } else {
      //     this.$router.push({
      //       path: 'subtype3-1-fix',
      //       query: { id: this.getCheckboxVal }
      //     })
      //   }
      // },
      handleButtonSync (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          localMultiSync(this.getCheckboxVal).then((res) => {
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
        // this.getCheckboxVal = this.tableSelectVal.push(index.Id)
        // alert(JSON.stringify(index))
        this.$router.push({
          path: 'subtype3-1-edit',
          query: { data: index }
        })
      },
      handleTableFix (index) {
        this.getCheckboxVal = this.tableSelectVal.push(index.Id)
        // alert(this.getCheckboxVal)
        this.$router.push({
          path: 'subtype3-1-fix',
          query: { id: this.getCheckboxVal }
        })
      },
      handleTableDelete (index) {
        var list = []
        this.tableSelectVal = list.concat(index.Id)
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

