<template>
  <div>
    <div class="topItem">
      <Input class="topColumn" search enter-button="搜索" placeholder="请输入游戏首字母..." clearable style="width: 200px;" />
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
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: '资源类型', key: 'resourceType' },
          { title: '游戏类型', key: 'gameType' },
          { title: '游戏名称', key: 'name' },
          { title: '下载路径', key: 'dwpath' },
          { title: '游戏大小', key: 'size' },
          { title: '下架时间', key: 'time' },
          {
            title: '操作',
            key: 'operation',
            render: (h, params) => {
              return h('span', {
                style: { color: '#2d8cf0', textDecoration: 'underline' },
                on: { click: () => { this.handleRemove(params.index) } }
              }, '本地移除')
            }
          }
        ],
        tableData: [
          { id: 0, resourceType: '游戏', gameType: '网络游戏', name: '英雄联盟', size: '10.85 GB', dwpath: 'xxxxxx', time: '2018-10-10 12:33:11' },
          { id: 1, resourceType: '游戏', gameType: '网络游戏', name: '穿越火线', size: '10.85 GB', dwpath: 'xxxxxx', time: '-', path: 'xxxxxxxxxxxx' },
          { id: 2, resourceType: '游戏', gameType: '网络游戏', name: '英雄联盟', size: '10.85 GB', dwpath: 'xxxx', time: '20181010153501', path: 'xxxxxxxxxxxx' }
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
      handleButtonRemove (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$router.push({
            path: 'subtype1-remove',
            query: { id: val }
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

