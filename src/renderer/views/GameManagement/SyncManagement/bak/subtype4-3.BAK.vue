<template>
  <div>
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonStart">开始</Button>
      <Button type="primary" class="topColumn" @click="handleButtonStop">暂停</Button>
      <Button type="error"   class="topColumn" @click="handleButtonDelete">删除任务</Button>
      <Button type="primary" class="topColumn" @click="handleButtonTop">置顶</Button>
      <Button type="primary" class="topColumn" @click="handleButtonMove">上移</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" @on-sort-change="handleTableSort"></Table>
    <Row style="margin-top:10px; ">
      <Page :total="100" :current="1" @on-change="changePage"  style=" float:right;"/>
    </Row>
    
  </div>
</template>

<script>
  export default {
    name: 'subType4-3',
    data () {
      return {
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          {
            title: '结果',
            key: 'state',
            render: (h, params) => {
              let type = params.row.state
              switch (type) {
                case 0:
                  return h('span', { style: { color: '#25da30' } }, '完成')
                case 1:
                  return h('span', { style: { color: '#ff0000' } }, '失败')
                default:
                  return '-'
              }
            }
          },
          { title: '游戏类型', key: 'type' },
          { title: '游戏名称', key: 'name' },
          { title: '热度', key: 'hot' },
          { title: '目标服务器地址', key: 'ip' },
          { title: '源路径', key: 'sourcePath' },
          { title: '目标路径', key: 'targetPath' },
          { title: '开始时间', key: 'startTime' },
          { title: '结束时间', key: 'endTime' },
          { title: '错误信息', key: 'errInfo' },
          { title: '操作',
            key: 'operation',
            render: (h, params) => {
              let type = params.row.id
              let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
                on: { click: () => { this.handleTableDelete(params.index) } }
              }, '重新同步')
              switch (type) {
                // case 0:
                //   return h('div', [a])
                default:
                  return h('span', [a])
              }
            }
          }
        ],
        tableData: [
          { id: 0, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', ip: '10.30.20.33', sourcePath: 'D:/网络游戏/英雄联盟', targetPath: 'E:/网络游戏/英雄联盟', updateSize: '10.85 GB', startTime: ' ', endTime: ' ', errInfo: '1.53 MB/s' },
          { id: 1, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', ip: '10.30.20.33', sourcePath: 'D:/网络游戏/英雄联盟', targetPath: 'E:/网络游戏/英雄联盟', updateSize: '10.85 GB', startTime: ' ', endTime: ' ', errInfo: '1.53 MB/s' },
          { id: 2, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', ip: '10.30.20.33', sourcePath: 'D:/网络游戏/英雄联盟', targetPath: 'E:/网络游戏/英雄联盟', updateSize: '10.85 GB', startTime: ' ', endTime: ' ', errInfo: '1.53 MB/s' },
          { id: 3, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', ip: '10.30.20.33', sourcePath: 'D:/网络游戏/英雄联盟', targetPath: 'E:/网络游戏/英雄联盟', updateSize: '10.85 GB', startTime: ' ', endTime: ' ', errInfo: '1.53 MB/s' },
          { id: 4, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', ip: '10.30.20.33', sourcePath: 'D:/网络游戏/英雄联盟', targetPath: 'E:/网络游戏/英雄联盟', updateSize: '10.85 GB', startTime: ' ', endTime: ' ', errInfo: '1.53 MB/s' },
          { id: 5, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', ip: '10.30.20.33', sourcePath: 'D:/网络游戏/英雄联盟', targetPath: 'E:/网络游戏/英雄联盟', updateSize: '10.85 GB', startTime: ' ', endTime: ' ', errInfo: '1.53 MB/s' },
          { id: 6, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', ip: '10.30.20.33', sourcePath: 'D:/网络游戏/英雄联盟', targetPath: 'E:/网络游戏/英雄联盟', updateSize: '10.85 GB', startTime: ' ', endTime: ' ', errInfo: '1.53 MB/s' },
          { id: 7, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', ip: '10.30.20.33', sourcePath: 'D:/网络游戏/英雄联盟', targetPath: 'E:/网络游戏/英雄联盟', updateSize: '10.85 GB', startTime: ' ', endTime: ' ', errInfo: '1.53 MB/s' }
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
      handleButtonStart (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          alert('val')
        }
      },
      handleButtonStop (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          alert('val')
        }
      },
      handleButtonDelete (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          alert('val')
        }
      },
      handleButtonTop (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          alert('val')
        }
      },
      handleButtonMove (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          alert('val')
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
      handleTableDelete (index) {
        this.tableData.splice(index, 1)
      },
      handleTableMove (index) {},
      handleTableTop (index) {
        var currId = index.id
        alert(currId)
      },
      handleTableSort (data) {
        alert(data)
      },
      changePage (key, type) {
        console.log('排序字段:' + key)
        console.log('排序规则:' + type)
      }
    }
  }
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>

