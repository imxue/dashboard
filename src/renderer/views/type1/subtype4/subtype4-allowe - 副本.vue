<template>
  <div>
    <div class="topItem">
       <Select v-model="serverVal"  class="topColumn" style="width:150px;"  placeholder="全部服务器"  @on-change="handleSelectServerValue">
        <Option v-for="item in serverList" :value="item.Ip" :key="item.index">{{ item.Ip }}</Option>
      </Select>
      <Select v-model="gameTypeValue"  class="topColumn" style="width:150px;"  @on-change="handleSelectGameTypeValue" placeholder="——全部游戏盘——">
        <Option v-for="item in gameTypeList" :value="item.DriverId" :key="item.DriverId" >{{ item.Name }}</Option>
      </Select>
      <!-- <Select v-model="diskValue"  class="topColumn" style="width:150px;"  placeholder="——全部盘符——">
        <Option v-for="item in diskList" :value="item.value" :key="item.value" @on-change="handleSelectDiskValue(item.id)">{{ item.label }}</Option>
      </Select> -->
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
        <CheckboxGroup v-model="gameslist">
          <Checkbox label="香蕉"></Checkbox>
          <Checkbox label="苹果"></Checkbox>
          <Checkbox label="西瓜"></Checkbox>
      </CheckboxGroup>
    </Modal>
  </div>
</template>

<script>
  import { getPolicys } from '@/api/sync'
  // import { getPolicys } from '@/api/sync'
  export default {
    name: 'subtype4-allow',
    data () {
      return {
        gameslist: [],
        serverVal: '',
        serverValKey: '',
        gameTypeValue: '',
        gameTypeValueKey: '',
        diskValue: '',
        diskValueKey: '',
        showGameBox: false,
        getDriversData: [],
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
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
                  return h('span', '全部游戏')
                case 1:
                  return h('span', '热门游戏')
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
              var gameTypeList = ''
              for (var i in arr) {
                list.push(arr[i].Name)
              }
              gameTypeList = list.join(',')
              // console.log('gameTypeList::' + gameTypeList)
              return h('span', gameTypeList)
            }
          }
        ],
        tableData: [],
        serversIplist: []
      }
    },
    created () {
      this.handleGetTableData()
      // this.handleGetDrivers()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleFilter () {
        alert('筛选')
        // this.handleGetTableData()
      },
      handleCallBackVaild (res) {
        var code = res.data.Code
        if (code === 0 || res.data.state === 'OK') {
          this.$Message.success('操作成功')
        } else {
          this.$Message.error('操作失败：' + res.data.Msg)
        }
      },
      handleGetTableData () {
        getPolicys().then((res) => {
          this.tableData = res.data.Data
          if (res.data.Code === 0) {
            var arr = res.data.Data
            if (arr === null) {
              this.data = null
            } else {
              this.getDriversData = res.data.Data.Servers // 筛选三项data
              this.serverList = res.data.Data.Servers
              console.log('serverIPList' + JSON.stringify(this.serverList))
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
        this.gameTypeList = val
        var arr = this.getDriversData
        var newArr = arr.filter(item => item.Ip === val)
        var newList = []
        var data = newArr
        for (var i in data) {
          for (var j in data[i].Drivers) {
            var name = data[i].Drivers[j].name
            if (data[i].Drivers[j].IsHotgamedisk === 0) {
              name = '全部游戏'
            } else {
              name = '网络游戏'
            }
            if (data[i].Drivers[j].IsHotgamedisk === data[i].Drivers[i].IsHotgamedisk) {
              return data[i].Drivers[j].IsHotgamedisk
            }
            newList.push({
              DriverId: data[i].Drivers[j].DriverId,
              IsHotgamedisk: data[i].Drivers[j].IsHotgamedisk,
              Driver: data[i].Drivers[j].Driver,
              Name: name
            })
            // newList = newList.filter(item => item.IsHotgamedisk === IsHotgamedisk)
          }
        }
        this.gameTypeList = newList
        console.log('全部游戏盘:::' + JSON.stringify(newList))
        // console.log('全部游戏盘newList:::' + JSON.stringify(newList))
      },
      handleSelectGameTypeValue (val) {
        alert(val)
      },
      handleSelectDiskValue (val) {
        alert(val)
      },
      handleCheckBox (arr) {
        var data = arr
        var list = []
        for (var i in arr) {
          list.push(data[i].Ip)
        }
        this.getCheckboxVal = list
        console.log('getCheckboxVal:' + this.getCheckboxVal)
        return this.getCheckboxVal
      },
      handleAllow (name) {
        var val = this.getCheckboxVal.length
        if (val !== 0) {
          this.showGameBox = true
        } else {
          this.$Message.error('请至少选择一个')
        }
      },
      handleReset (name) {
        this.checkAll = true
        this.selectVal = []
        this.$router.go(-1)
      },
      handleConfirm () {},
      handleCancel () {}
    }
  }
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>

