<template>
  <div>
    <div class="topItem">
      <Select v-model="model1"  class="topColumn" style="width:150px;">
        <Option v-for="item in gameList" :value="item.value" :key="item.value" placeholder="全部游戏类型">{{ item.label }}</Option>
      </Select>
      <Input class="topColumn" search enter-button="搜索" placeholder="请输入游戏首字母..." clearable style="width: 200px;" />
      <Button type="primary" class="topColumn" @click="handleButtonAdd">添加</Button>
      <Button type="primary" class="topColumn" @click="handleButtonEdit">编辑</Button>
      <Button type="primary" class="topColumn" @click="handleButtonFix">修复</Button>
      <Button type="primary" class="topColumn" @click="handleButtonSync">同步</Button>
      <Button type="primary" class="topColumn" @click="handleButtonMore">批量操作</Button>
      <Button type="primary" class="topColumn" @click="handleButtonDelete">删除</Button>
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
    name: 'subType3-1',
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
            title: '状态',
            key: 'state',
            render: (h, params) => {
              let type = params.row.state
              switch (type) {
                case 0:
                  return h('span', '最新版本')
                case 1:
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
          {
            title: '更新模式',
            key: 'mode',
            render: (h, params) => {
              let type = params.row.mode
              switch (type) {
                case 0:
                  return h('span', '自动')
                case 1:
                  return h('span', '手动')
                default:
                  return '-'
              }
            }
          },
          { title: '服务器存放路径', key: 'versionCenter' },
          { title: '客户机执行路径', key: 'versionLocal' },
          { title: '操作',
            key: 'operation',
            render: (h, params) => {
              // let type = params.row.state
              let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
                on: { click: () => { this.handleTableEdit(params.row) } }
              }, '编辑')
              let b = h('span', {
                style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
                on: { click: () => { this.handleTableFix(params.row) } }
              }, '修复')
              let c = h('span', {
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
                  return h('span', [a, b, c])
              }
            }
          }
        ],
        tableData: [
          { id: 8, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', mode: 0, versionCenter: '20181010153501', versionLocal: '20181010153501' },
          { id: 1, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', mode: 1, versionCenter: '20181010153501', versionLocal: '20181010153501' },
          { id: 2, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', mode: 1, versionCenter: '20181010153501', versionLocal: '20181010153501' },
          { id: 3, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', mode: 0, versionCenter: '20181010153501', versionLocal: '20181010153501' },
          { id: 4, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', mode: 0, versionCenter: '20181010153501', versionLocal: '20181010153501' },
          { id: 5, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', mode: 0, versionCenter: '20181010153501', versionLocal: '20181010153501' },
          { id: 6, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', mode: 0, versionCenter: '20181010153501', versionLocal: '20181010153501' },
          { id: 7, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', size: '10.85 GB', mode: 0, versionCenter: '20181010153501', versionLocal: '20181010153501' }
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
      handleButtonAdd (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$router.push({
            path: 'subtype3-1-add',
            query: { id: this.getCheckboxVal }
          })
        }
      },
      handleButtonEdit (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$router.push({
            path: 'subtype3-1-edit',
            query: { id: this.getCheckboxVal }
          })
        }
      },
      handleButtonFix (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$router.push({
            path: 'subtype3-1-fix',
            query: { id: this.getCheckboxVal }
          })
        }
      },
      handleButtonSync (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$Message.success('同步任务')
          // this.$router.push({
          //   path: 'subtype3-1-sync',
          //   query: { id: this.getCheckboxVal }
          // })
        }
      },
      handleButtonMore (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          // this.$router.push({
          //   path: 'subtype3-1-more',
          //   query: { id: this.getCheckboxVal }
          // })
        }
      },
      handleButtonDelete (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$router.push({
            path: '/game/subtype1/subtype1-remove',
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
      handleTableEdit (index) {
        this.getCheckboxVal = this.tableSelectVal.push(index.id)
        // alert(this.getCheckboxVal)
        this.$router.push({
          path: 'subtype3-1-edit',
          query: { id: this.getCheckboxVal }
        })
      },
      handleTableFix (index) {
        this.getCheckboxVal = this.tableSelectVal.push(index.id)
        // alert(this.getCheckboxVal)
        this.$router.push({
          path: 'subtype3-1-fix',
          query: { id: this.getCheckboxVal }
        })
      },
      handleTableDelete (index) {
        this.getCheckboxVal = this.tableSelectVal.push(index.id)
        // alert(this.getCheckboxVal)
        this.$router.push({
          path: '/game/subtype1/subtype1-remove',
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

