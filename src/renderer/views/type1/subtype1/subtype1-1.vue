<template>
  <div>
    <div class="topItem">
      <Select v-model="model1"  class="topColumn" style="width:150px;">
        <Option v-for="item in gameList" :value="item.value" :key="item.value" placeholder="全部游戏类型">{{ item.label }}</Option>
      </Select>
      <Input class="topColumn" search enter-button="搜索" placeholder="请输入游戏首字母..." clearable style="width: 200px;" />
      <Button type="primary" class="topColumn" @click="handleButtonDW">下载</Button>
      <Button type="primary" class="topColumn" @click="handleButtonFixGame">修复</Button>
      <Button type="primary" class="topColumn" @click="handleButtonRemove">本地移除</Button>
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
    name: 'subType1-1',
    data () {
      return {
        model1: '',
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        gameList: [
          { Id: 0, value: '热门游戏', label: '热门游戏' },
          { Id: 1, value: '网络游戏', label: '网络游戏' },
          { Id: 2, value: '单机游戏', label: '单机游戏' },
          { Id: 3, value: '休闲游戏', label: '休闲游戏' },
          { Id: 4, value: '辅助游戏', label: '辅助游戏' }
        ],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          {
            title: '当前状态',
            key: 'state',
            render: (h, params) => {
              let type = params.row.state
              switch (type) {
                case 0:
                  return h('span', '最新版本')
                case 1:
                  return h('span', { style: { color: '#999999' } }, '未下载')
                case 2:
                  return h('span', { style: { color: '#008000' } }, '更新中')
                default:
                  return '-'
              }
            }
          },
          { title: '游戏类型', key: 'type' },
          { title: '游戏名称', key: 'name' },
          { title: '当前热度', key: 'hot' },
          { title: '游戏大小', key: 'size' },
          { title: '中心游戏版本', key: 'versionCenter' },
          { title: '本地游戏版本', key: 'versionLocal' },
          { title: '操作',
            key: 'operation',
            render: (h, params) => {
              let type = params.row.state
              let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
                on: { click: () => { this.handleFixGame(params.row) } }
              }, '修复游戏')
              let b = h('span', {
                style: { color: '#2d8cf0', textDecoration: 'underline' },
                on: { click: () => { this.handleRemove(params.row) } }
              }, '本地移除')
              let c = h('span', {
                style: { color: '#2d8cf0', textDecoration: 'underline' },
                on: { click: () => { this.handleTableDw(params.row) } }
              }, '下载游戏')
              switch (type) {
                case 0:
                  return h('div', [a, b])
                case 1:
                  return h('span', [c])
                case 2:
                  return h('span', [b])
                default:
                  return '-'
              }
            }
          }
        ],
        tableData: [
          { id: 8, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' },
          { id: 1, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' },
          { id: 2, state: 2, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' },
          { id: 3, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' },
          { id: 4, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' },
          { id: 5, state: 2, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' },
          { id: 6, state: 2, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' },
          { id: 7, state: 2, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501' }
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
      handleButtonDW (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$router.push({
            path: 'subtype1-download',
            query: { id: this.getCheckboxVal }
          })
        }
      },
      handleButtonFixGame (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$Message.info('修复中，请耐心等待……')
        }
      },
      handleButtonRemove (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$router.push({
            path: 'subtype1-remove',
            query: { id: this.getCheckboxVal }
          })
        }
      },
      test () {
        let matched = this.$route.matched.filter(item => item.name)
        console.log(matched)
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

