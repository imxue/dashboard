<template>
  <div>
    <div class="topItem">
      <Row>
        <i-col span="16">
          <Input class="topColumn" v-model="inputVal"  placeholder="请输入游戏名称..." clearable style="width: 200px;" />
          <Select v-model="serversIpValue" clearable @on-change="handleSelectChange"  class="topColumn" style="width:150px;" placeholder="---全部服务器---">
            <Option v-for="item in serversIpList" :value="item.Ip" :key="item.Id">{{ item.Ip }}</Option>
          </Select>
          <Select v-model="diskValue" clearable class="topColumn" style="width:150px;" placeholder="---全部盘符---">
            <Option v-for="item in diskListOption" :value="item.DriverId" :key="item.index" >{{ item.Name }}</Option>
          </Select>
          <Button type="primary" class="topColumn" @click="handleButtonSearch">搜索</Button>
          </i-col>
          <i-col span="8">
            <Button type="primary" class="topColumn" @click="handleButtonAllowe">分配游戏</Button>
            <Button type="primary" class="topColumn" @click="handleButtonCancleAllowe">取消分配</Button>
            <Button type="primary" class="topColumn" @click="handleButtonAddTask">添加同步任务</Button>
            <Button type="primary" class="topColumn" @click="handleButtonRules">默认分配规则</Button>
        </i-col>
      </Row>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox"></Table>
    <Row style="margin-top:10px; ">
      <i-col span="4">资源：3000 &nbsp;&nbsp;&nbsp;&nbsp;已下载：1000</i-col>
      <i-col span="20"><Page :current="currentPage" :total="totalPageNumber" show-total  @on-change="hanbleChangePage" style=" float:right;"/></i-col>
    </Row>
    
  </div>
</template>

<script>
  import { getSearch, getDrivers, getPolicys, distributeGame, cancelDistribution, multiAddSyncTask } from '@/api/sync'
  // import { handleCallBackVaild } from '@/utils/index.js'
  export default {
    name: 'subtype4-1',
    data () {
      return {
        model1: '',
        clearVal: '',
        inputVal: '',
        diskValue: '',
        serverVal: '',
        serversIpValue: '',
        driversData: [],
        curroffset: 0,
        currlimit: 10,
        totalPageNumber: 0,
        pageSize: 10,
        currentPage: 1,
        getCheckboxVal: [], // 勾选复选框值
        getCheckboxValString: '',
        tableSelectVal: [],
        serversIpList: [],
        diskList: [],
        diskListOption: [],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          {
            title: '状态',
            key: 'State',
            render: (h, params) => {
              let type = params.row.State
              switch (type) {
                case 0:
                  return h('span', { style: { color: '#999999' } }, '未分配')
                case 1:
                  return h('span', '最新')
                // case 2:
                //   return h('span', { style: { color: '#008000' } }, '更新中')
                default:
                  return '-'
              }
            }
          },
          { title: '游戏类型', key: 'Type' },
          { title: '游戏名称', key: 'Name' },
          { title: '游戏热度', key: 'Centerpopularity' },
          { title: '游戏大小', key: 'Size' },
          { title: '目标服务器IP', key: 'Ip' },
          { title: '目标盘符', key: 'Drive' },
          { title: '盘符容量', key: 'Drivesize' },
          { title: '操作',
            key: 'operation',
            width: 170,
            render: (h, params) => {
              let type = params.row.state
              let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
                on: { click: () => { this.handleTableAllowe(params.row) } }
              }, '分配游戏')
              let b = h('span', {
                style: { color: '#2d8cf0', marginRight: '10px', textDecoration: 'underline' },
                on: { click: () => { this.handleTableCancel(params.row) } }
              }, '取消分配')
              let c = h('span', {
                style: { color: '#2d8cf0', textDecoration: 'underline' },
                on: { click: () => { this.handleTableAdd(params.row) } }
              }, '添加同步任务')
              switch (type) {
                case 0:
                  return h('span', [a])
                case 1:
                  return h('span', [b, c])
                case 2:
                  return h('span', [c])
                default:
                  return '-'
              }
            }
          }
        ],
        tableData: []
      }
    },
    created () {
      this.handleGetSearch(this.curroffset, this.currlimit) // 盘符
      this.handlGetDrivers() // 服务器list
      this.handleGetDriversOption()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleButtonSearch () {
        if (this.inputVal === undefined) {
          this.inputVal = ''
        }
        if (this.diskValue === undefined || this.diskValue === '') {
          this.diskValue = 0
        }
        if (this.serversIpValue === undefined) {
          this.serversIpValue = ''
        }
        this.handleGetSearch(this.curroffset, this.currlimit)
      },
      handleCallBackVaild (res) {
        var code = res.data.Code
        if (code === 0 || res.data.state === 'OK') {
          this.$Message.success('操作成功')
        } else {
          this.$Message.error('操作失败：' + res.data.Msg)
        }
      },
      handlGetDrivers () {
        getDrivers().then((res) => {
          if (res.data.Code === 0) {
            var arr = res.data.Data.Servers
            if (arr === null) {
              this.driversData = null // 全部服务器list
              this.serversIpList = null // 全部游戏类型
            } else {
              this.driversData = arr
              this.serversIpList = res.data.Data.Servers
              console.log('serversIpList::' + JSON.stringify(this.serversIpList))
            }
          } else {
            this.$Message.error(res.data.Msg)
          }
        }, () => {
          this.$Message.error('请求出错，请稍后再试')
        })
      },
      handleGetDriversOption () {
        getPolicys().then((res) => {
          if (res.data.Code === 0) {
            var arr = res.data.Data
            if (arr === null) {
              this.diskList = null
            } else {
              this.diskList = arr
            }
          } else {
            this.$Message.error(res.data.Msg)
          }
        }, () => {
          this.$Message.error('请求出错，请稍后再试')
        })
      },
      handleGetSearch (offset, limit) {
        var data = 'keyword=' + this.inputVal + '&serverIp=' + this.serversIpValue + '&driverId=' + this.diskValue + '&offset=0&limit=10'
        getSearch(data).then((res) => {
          if (res.data.Code === 0) {
            var arr = res.data.Data.List
            if (arr === null) {
              this.tableData = []
              this.getDriversData = []
              this.serverList = []
            } else {
              this.getDriversData = res.data.Data.Servers // 筛选三项data
              this.tableData = res.data.Data.List
              // console.log('tableData' + JSON.stringify(this.tableData))
            }
          } else {
            this.$Message.error(res.data.Msg)
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
        this.handleGetSearch(num, this.currlimit)
      },
      handleSelectChange (value) {
        this.diskValue = []
        var arr = this.diskList
        var list = []
        var newArr = arr.filter(item => item.Ip === value)
        for (var i in newArr) {
          list.push({
            Ip: newArr[i].Ip,
            DriverId: newArr[i].DriverId,
            Name: newArr[i].Ip + newArr[i].Drive + '\\ (' + newArr[i].Driversize + 'GB)'
          })
        }
        this.diskListOption = list // 最终盘符列表
      },
      handleButtonAllowe (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          distributeGame(this.getCheckboxVal).then((res) => {
            this.handleCallBackVaild(res)
          }, () => {
            this.$Message.error('请求出错，请稍后再试')
          })
        }
      },
      handleButtonCancleAllowe (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          cancelDistribution(this.getCheckboxVal).then((res) => {
            this.handleCallBackVaild(res)
          }, () => {
            this.$Message.error('请求出错，请稍后再试')
          })
        }
      },
      handleButtonAddTask (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          multiAddSyncTask(this.getCheckboxVal).then((res) => {
            this.handleCallBackVaild(res)
          }, () => {
            this.$Message.error('请求出错，请稍后再试')
          })
        }
      },
      handleButtonRules (val) {
        this.$router.push('subtype4-allowe')
      },
      handleCheckBox (arr) {
        var data = arr
        var list = []
        for (var i in arr) {
          list.push(data[i].Id)
        }
        this.getCheckboxVal = list
        this.getCheckboxValString = list.join(',')
        console.log(this.getCheckboxVal)
        return this.getCheckboxVal
      },
      handleTableDw (index) {
        this.getCheckboxVal = this.tableSelectVal.push(index.Id)
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

