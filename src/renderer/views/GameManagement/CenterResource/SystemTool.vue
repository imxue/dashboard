<template>
  <div>
    <div class="topItem">
      <Input class="topColumn" search enter-button="搜索" placeholder="请输入游戏首字母..." clearable style="width: 200px;" />
      <Button type="primary" class="topColumn" @click="handleButtonDW">下载</Button>
      <Button type="primary" class="topColumn" @click="handleButtonFixGame">修复</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData"  @on-selection-change="handleCheckBox" stripe></Table>
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
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
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
                case 3:
                  return h('span', { style: { color: '#ff0000' } }, '更新失败')
                default:
                  return '-'
              }
            }
          },
          { title: '类型', key: 'type' },
          { title: '工具名称', key: 'name' },
          { title: '工具大小', key: 'size' },
          { title: '中心版本', key: 'versionCenter' },
          { title: '本地版本', key: 'versionLocal' },
          { title: '本地游路径', key: 'path' }
        ],
        tableData: [
          { id: 0, state: 0, type: '菜单工具', name: '游戏组件库', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501', path: 'xxxxxxxxxxxx' },
          { id: 1, state: 1, type: '无盘工具', name: '游戏工具库', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '-', path: 'xxxxxxxxxxxx' },
          { id: 2, state: 2, type: '网络游戏', name: '无盘ISO', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501', path: 'xxxxxxxxxxxx' },
          { id: 3, state: 3, type: '网络游戏', name: '无盘ISO', size: '10.85 GB', versionCenter: '20181010153501', versionLocal: '20181010153501', path: 'xxxxxxxxxxxx' }
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

