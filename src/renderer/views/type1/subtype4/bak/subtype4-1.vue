<template>
  <div>
    <div class="topItem">
      <Input class="topColumn" search enter-button="搜索" placeholder="请输入游戏首字母..." clearable style="width: 200px;" />
      <Select v-model="model1"  class="topColumn" style="width:150px;" placeholder="全部游戏类型">
        <Option v-for="item in gameList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="diskValue"  class="topColumn" style="width:150px;" placeholder="全部盘符">
        <Option v-for="item in diskList" :value="item.value" :key="item.value" >{{ item.label }}</Option>
      </Select>
      <Button type="primary" class="topColumn" @click="handleButtonAllowe">分配游戏</Button>
      <Button type="primary" class="topColumn" @click="handleButtonCancleAllowe">取消分配</Button>
      <Button type="primary" class="topColumn" @click="handleButtonAddTask">添加同步任务</Button>
      <Button type="primary" class="topColumn" @click="handleButtonRules">默认分配规则</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox"></Table>
    <Row style="margin-top:10px; ">
      <i-col span="4">资源：3000 &nbsp;&nbsp;&nbsp;&nbsp;已下载：1000</i-col>
      <i-col span="20"><Page :total="100"  style=" float:right;"/></i-col>
    </Row>
    
  </div>
</template>

<script>
  export default {
    name: 'subtype4-1',
    data () {
      return {
        model1: '',
        diskValue: '',
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        gameList: [
          { Id: 0, value: '热门游戏', label: '热门游戏' },
          { Id: 1, value: '网络游戏', label: '网络游戏' },
          { Id: 2, value: '单机游戏', label: '单机游戏' },
          { Id: 3, value: '休闲游戏', label: '休闲游戏' },
          { Id: 4, value: '辅助游戏', label: '辅助游戏' }
        ],
        diskList: [
          { Id: 1, value: '192.168.100.200 E（1.83 TB）', label: '192.168.100.200 E（1.83 TB）' },
          { Id: 2, value: '192.168.100.200 E（1.83 TB）', label: '192.168.100.200 E（1.83 TB）' },
          { Id: 3, value: '192.168.100.200  E（1.83 TB）', label: '192.168.100.200 E（1.83 TB）' }
        ],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          {
            title: '状态',
            key: 'state',
            render: (h, params) => {
              let type = params.row.state
              switch (type) {
                case 0:
                  return h('span', { style: { color: '#999999' } }, '未分配')
                case 1:
                  return h('span', '最新')
                case 2:
                  return h('span', { style: { color: '#008000' } }, '更新中')
                default:
                  return '-'
              }
            }
          },
          { title: '游戏类型', key: 'type' },
          { title: '游戏名称', key: 'name' },
          { title: '游戏热度', key: 'hot' },
          { title: '游戏大小', key: 'size' },
          { title: '目标服务器IP', key: 'targetIp' },
          { title: '目标盘符', key: 'targetDrive' },
          { title: '盘符容量', key: 'diskCapacity' },
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
        tableData: [
          { id: 8, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', targetIp: '20181010153501', targetDrive: 'e:', diskCapacity: '' },
          { id: 1, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', targetIp: '20181010153501', targetDrive: 'e:', diskCapacity: '' },
          { id: 2, state: 2, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', targetIp: '20181010153501', targetDrive: 'e:', diskCapacity: '' },
          { id: 3, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', targetIp: '20181010153501', targetDrive: 'e:', diskCapacity: '' },
          { id: 4, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', targetIp: '20181010153501', targetDrive: 'e:', diskCapacity: '' },
          { id: 5, state: 2, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', targetIp: '20181010153501', targetDrive: 'e:', diskCapacity: '' },
          { id: 6, state: 2, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', targetIp: '20181010153501', targetDrive: 'e:', diskCapacity: '' },
          { id: 7, state: 2, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', targetIp: '20181010153501', targetDrive: 'e:', diskCapacity: '' }
        ]
      }
    },
    created () {
      // console.log(this.$route.matched[0])
      // console.log('hello', JSON.stringify(this.routes))
      // this.test()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleButtonAllowe (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$Message.info('分配游戏')
        }
      },
      handleButtonCancleAllowe (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$Message.info('取消分配……')
        }
      },
      handleButtonAddTask (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$Message.info('添加同步任务')
        }
      },
      handleButtonRules (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$router.push({
            path: 'subtype4-allowe',
            query: { id: this.getCheckboxVal }
          })
        }
      },
      handleCheckBox (arr) {
        var data = arr
        var list = []
        for (var i in arr) {
          list.push(data[i].id)
        }
        this.getCheckboxVal = list.join(',')
        console.log(this.getCheckboxVal)
        return this.getCheckboxVal
      },
      handleTableDw (index) {
        this.getCheckboxVal = this.tableSelectVal.push(index.id)
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
        // alert(this.getCheckboxVal)
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

