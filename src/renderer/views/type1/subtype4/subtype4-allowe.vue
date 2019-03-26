<template>
  <div>
    <div class="topItem">
       <Select v-model="serverVal"  class="topColumn" style="width:150px;"  placeholder="全部服务器"  @on-change="handleSelectServerValue">
        <Option v-for="item in serverList" :value="item.Ip" :key="item.index">{{ item.Ip }}</Option>
      </Select>
      <Select v-model="gameDiskValue"  class="topColumn" style="width:150px;"  @on-change="handleSelectGameDiskValue" placeholder="——全部游戏盘——">
        <Option v-for="item in gameDiskList" :value="item.Id" :key="item.Id" >{{ item.Name }}</Option>
      </Select>
      <Select v-model="diskValue"  class="topColumn" style="width:150px;"  placeholder="——全部盘符——">
        <Option v-for="item in diskList" :value="item.Drive" :key="item.Drive" @on-change="handleSelectDiskValue">{{ item.Name }}</Option>
      </Select>
      <Button type="primary" @click="handleFilter">筛选</Button>
      <Button type="primary" @click="handleAllow">分配</Button>
      <Button @click="handleReset" style="margin-left: 8px">取消</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox"></Table>
    <Row style="margin-top:10px; ">
      <i-col span="10">资源：3000 &nbsp;&nbsp;&nbsp;&nbsp;已下载：1000</i-col>
    </Row>
        <!-- 分配 -->
        <Modal
        v-model="showGameBox"
        title="请选择您要分配的游戏类型"
        @on-ok="handleConfirm"
        @on-cancel="handleCancel"
        width = "400">
        <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll">全选</Checkbox>
        <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
          <Checkbox v-for="item in gameTypeList" :key="item.Id" :label="item.Id" >{{item.Name}}</Checkbox>
      </CheckboxGroup>
    </Modal>
  </div>
</template>

<script>
  import { getPolicys, getDrivers, distributePolicy } from '@/api/sync'
  // import { getPolicys } from '@/api/sync'
  export default {
    name: 'subtype4-allow',
    data () {
      return {
        // gameslist: [],
        serverVal: '',
        driverId: 0,
        serverValKey: '',
        gameDiskValue: '',
        diskValue: '',
        diskValueKey: '',
        showGameBox: false,
        indeterminate: true,
        checkAll: false,
        checkAllGroup: [],
        getDriversData: [],
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        gameDiskList: [
          { Id: 0, Name: '游戏盘' },
          { Id: 1, Name: '热门游戏盘' }
        ],
        gameTypeList: [],
        serverList: [],
        diskList: [],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: '目标服务器IP', key: 'Ip' },
          {
            title: '磁盘类型',
            key: 'IsHotgamedisk',
            render: (h, params) => {
              let type = params.row.IsHotgamedisk
              switch (type) {
                case 0:
                  return h('span', '全部游戏盘')
                case 1:
                  return h('span', '热门游戏盘')
                default:
                  return '-'
              }
            }
          },
          { title: '目标盘符', key: 'Drive' },
          { title: '盘符大小', key: 'Driversize' },
          {
            title: '默认存放游戏',
            key: 'GameTypeIds',
            render: (h, params) => {
              var arr = params.row.GameTypeIds
              var list = []
              var gamesTypeList = ''
              for (var i in arr) {
                list.push(arr[i].Name)
              }
              gamesTypeList = list.join(',')
              // console.log('gamesTypeList::' + gamesTypeList)
              return h('span', gamesTypeList)
            }
          }
        ],
        tableData: [],
        serversIplist: []
      }
    },
    created () {
      this.handleCheckFilterVal()
      this.handleGetDrivers()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleFilterTable (a, b, c) {
        var arr = this.tableData
        var newArr = []
        if (a !== '' && b !== '' && c !== '') {
          newArr = arr.filter(item => item.Ip === a && item.IsHotgamedisk === b && item.Drive === c)
        }
        if (a !== '' && b === '' && c !== '') {
          newArr = arr.filter(item => item.Ip === a && item.Drive === c)
        }
        if (a !== '' && b === '' && c === '') {
          newArr = arr.filter(item => item.Ip === a)
        }
        if (a !== '' && b !== '' && c === '') {
          newArr = arr.filter(item => item.Ip === a && item.IsHotgamedisk === b)
        }
        if (a === '' && b !== '' && c !== '') {
          newArr = arr.filter(item => item.IsHotgamedisk === b && item.Drive === c)
        }
        if (a === '' && b === '' && c !== '') {
          newArr = arr.filter(item => item.Drive === c)
        }
        this.tableData = newArr
        console.log('筛选后的newArr::' + JSON.stringify(newArr))
      },
      handleFilter () {
        var a = this.serverValKey
        var b = this.gameDiskValue
        var c = this.diskValue
        console.log('筛选:' + a + '&gameDiskValue:' + b + '&diskValue=' + c)
        if (a === '' && b === '' && c === '') {
          this.handleGetTableData()
        } else {
          this.handleFilterTable(a, b, c)
        }
      },
      handleCallBackVaild (res) {
        var code = res.data.Code
        if (code === 0 || res.data.state === 'OK') {
          this.$Message.success('操作成功')
        } else {
          this.$Message.error('操作失败：' + res.data.Msg)
        }
      },
      handleFormatServerList (arr) {
        let result = []
        for (let i = 0; i < arr.length; i++) {
          let flag = true
          let temp = arr[i]
          for (let j = 0; j < result.length; j++) {
            if (temp.Ip === result[j].Ip) {
              flag = false
              break
            }
          }
          if (flag) {
            result.push(temp)
          }
        }
        this.serverList = result
        // console.log('IPlist;;;' + JSON.stringify(result))
        return result
      },
      handleGetDrivers () {
        getDrivers().then((res) => {
          if (res.data.Code === 0) {
            var arr = res.data.Data.TypeIds
            if (arr === null) {
              this.gameTypeList = null // 全部游戏类型
            } else {
              this.gameTypeList = arr
              // console.log('gameTypeList::' + JSON.stringify(this.gameTypeList))
            }
          } else {
            this.$Message.error(res.data.Msg)
          }
        }, () => {
          this.$Message.error('请求出错，请稍后再试')
        })
      },
      handleCheckFilterVal () {
        this.handleFilter()
      },
      handleGetTableData () {
        getPolicys().then((res) => {
          if (res.data.Code === 0) {
            var arr = res.data.Data
            if (arr === null) {
              this.tableData = null
            } else {
              this.tableData = arr
              // var newArr = []
              this.getDriversData = arr // 筛选三项data
              this.handleFormatServerList(arr)
            }
          } else {
            this.$Message.error(res.data.Msg)
          }
        }, () => {
          this.$Message.error('请求出错，请稍后再试')
        })
      },
      handleSelectServerValue (val) {
        this.serverValKey = val
      },
      handleSelectGameDiskValue (val) {
        this.gameDiskValue = val
        var serversIp = this.serverValKey
        this.diskValue = ''
        var arr = this.tableData
        var newArr = arr.filter(item => item.Ip === serversIp && item.IsHotgamedisk === val)
        var list = []
        // this.diskList = arr
        for (var i in newArr) {
          list.push({
            Drive: newArr[i].Drive,
            Name: newArr[i].Drive + '\' (' + newArr[i].Driversize + 'GB)'
          })
        }
        this.diskList = list
      },
      handleSelectDiskValue (val) {
        this.diskValue = val
        // alert('this.diskValue::' + this.diskValue)
      },
      handleCheckBox (arr) {
        var data = arr
        var list = []
        for (var i in arr) {
          list.push(data[i].DriverId)
        }
        this.getCheckboxVal = list.join('')
        this.driverId = parseInt(this.getCheckboxVal)
        // console.log('driverId:' + this.driverId)
      },
      handleAllow (name) {
        var val = this.getCheckboxVal.length
        if (val === 1) {
          this.showGameBox = true
        } else {
          this.$Message.error('只能选择一个')
        }
      },
      handleCheckAll () {
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        }
        this.indeterminate = false
        if (this.checkAll) {
          var arr = this.gameTypeList
          var list = []
          for (var i in arr) {
            list.push(arr[i].Id)
          }
          this.checkAllGroup = list
        } else {
          this.checkAllGroup = [ ]
        }
        // console.log('this.checkAllGroup2lse::' + JSON.stringify(list))
      },
      checkAllGroupChange (data) {
        if (data.length === this.gameTypeList.length && data.length !== 0) {
          this.indeterminate = false
          this.checkAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.indeterminate = false
          this.checkAll = false
        }
        this.checkAllGroup = data
        // console.log('this.checkAllGroup===' + JSON.stringify(this.checkAllGroup))
      },
      handleReset (name) {
        this.checkAll = false
        this.selectVal = []
        this.$router.go(-1)
      },
      handleConfirm () {
        distributePolicy(this.driverId, this.checkAllGroup).then((res) => {
          this.handleCallBackVaild(res)
          this.handleGetTableData()
        }, () => {
          this.$Message.error('请求出错，请稍后再试')
        })
      },
      handleCancel () {
        this.indeterminate = true
        this.checkAll = false
        this.checkAllGroup = []
        // this.showGameBox = false
      }
    }
  }
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>

