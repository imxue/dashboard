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
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" @on-row-dblclick="handleTableEdit" stripe></Table>
    <Row style="margin-top:10px; ">
      <!-- <i-col span="4">资源：3000 &nbsp;&nbsp;&nbsp;&nbsp;已下载：1000</i-col> -->
      <i-col span="24"><Page :current="currentPage" :page-size="pageSize" :total="totalPageNumber" show-total style=" float:right;" @on-change="hanbleChangePage"/></i-col>
    </Row>
  </div>
</template>

<script>
  import { localMultiSync, getDownloadedGames } from '@/api/localGame'
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
                case 0:
                  return h('span', '未更新')
                case 1:
                  return h('span', { style: { color: '#008000' } }, '已更新')
                default:
                  return '-'
              }
            }
          },
          {
            title: '更新模式',
            key: 'UpdateMode',
            render: (h, params) => {
              let type = params.row.UpdateMode
              switch (type) {
                case 0:
                  return h('span', '手动更新')
                case 1:
                  return h('span', '自动更新')
                default:
                  return '-'
              }
            }
          },
          {
            title: '游戏类型',
            key: 'TypeName'
          },
          { title: '游戏名称', key: 'Name' },
          { title: '游戏热度', key: 'Popularity' },
          { title: '游戏大小', key: 'Size' },
          { title: '服务器存放路径',
            key: 'SavePath',
            tooltip: true,
            width: 140
          },
          { title: '执行程序', key: 'ExePath' },
          { title: '操作',
            key: 'operation',
            render: (h, params) => {
              let a = h('Button', {
                props: { type: 'primary', size: 'small' },
                style: {},
                on: { click: () => { this.handleTableEdit(params.row) } }
              }, '编辑')
              let b = h('Button', {
                props: { type: 'error', size: 'small' },
                on: { click: () => { this.handleTableDelete(params.row) } }
              }, '删除')
              switch (params) {
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
      this.handleGetTableList()
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
      },
      handleButtonSearch () {
        if (this.optionVal === undefined) {
          this.optionVal = 0
        }
        this.handleGetTableList(this.curroffset, this.currlimit)
      },
      /**
       * 获取已下载游戏
      */
      handleGetTableList () {
        getDownloadedGames(0, 10, 'name').then((a) => {
          this.tableData = a.data.data
        }, () => {
          this.$Message.error('请求出错，请稍后再试')
        }).catch((e) => {
          this.$Notice.error({ desc: '' + e, duration: 0 })
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
      /**
       * 编辑游戏
      */
      handleTableEdit (index) {
        this.$router.push({
          path: 'BarGamesEditMain',
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
  .ivu-tooltip {
    white-space: nowrap
  }
  .ivu-tooltip-rel{
    white-space: nowrap
  }
</style>

