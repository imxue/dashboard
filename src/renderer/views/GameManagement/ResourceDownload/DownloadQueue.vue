<template>
  <div>
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonStart">开始</Button>
      <Button type="primary" class="topColumn" @click="handleButtonStop">暂停</Button>
      <Button type="error"   class="topColumn" @click="handleButtonDelete">删除任务</Button>
      <Button type="primary" class="topColumn" @click="handleButtonTop">置顶</Button>
      <Button type="primary" class="topColumn" @click="handleButtonMove">上移</Button>
      <Button type="primary" class="topColumn" @click="handleButtonSet">下载设置</Button>
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
    name: 'subType2-1',
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
                  return h('span', { style: { color: '#25da30' } }, '正在下载')
                case 1:
                  return h('span', '等待')
                default:
                  return '-'
              }
            }
          },
          { title: '游戏类型', key: 'type' },
          { title: '游戏名称', key: 'name' },
          { title: '当前热度', key: 'hot' },
          { title: '更新量', key: 'updateSize' },
          { title: '已更新', key: 'updatedSize' },
          { title: '进度', key: 'jd' },
          { title: '更新速度', key: 'speed' },
          { title: '预计完成时间', key: 'time' },
          { title: '操作',
            key: 'operation',
            render: (h, params) => {
              let type = params.row.id
              let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
                on: { click: () => { this.handleTableDelete(params.index) } }
              }, '删除')
              let b = h('span', {
                style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
                on: { click: () => { this.handleTableMove(params.row) } }
              }, '上移')
              let c = h('span', {
                style: { color: '#2d8cf0', textDecoration: 'underline' },
                on: { click: () => { this.handleTableTop(params.row) } }
              }, '置顶')
              switch (type) {
                case 0:
                  return h('div', [a])
                default:
                  return h('span', [a, b, c])
              }
            }
          }
        ],
        tableData: [
          { id: 0, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', updatedSize: '5.85 GB', updateSize: '10.85 GB', speed: '1.53 MB/s', time: '19:20:20' },
          { id: 1, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', updatedSize: '5.85 GB', updateSize: '10.85 GB', speed: '1.53 MB/s', time: '19:20:20' },
          { id: 2, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', updatedSize: '5.85 GB', updateSize: '10.85 GB', speed: '1.53 MB/s', time: '19:20:20' },
          { id: 3, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', updatedSize: '5.85 GB', updateSize: '10.85 GB', speed: '1.53 MB/s', time: '19:20:20' },
          { id: 4, state: 0, type: '网络游戏', name: '英雄联盟', hot: '56.11', updatedSize: '5.85 GB', updateSize: '10.85 GB', speed: '-', time: '19:20:20' },
          { id: 5, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', updatedSize: '5.85 GB', updateSize: '10.85 GB', speed: '-', time: '19:20:20' },
          { id: 6, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', updatedSize: '5.85 GB', updateSize: '10.85 GB', speed: '-', time: '19:20:20' },
          { id: 7, state: 1, type: '网络游戏', name: '英雄联盟', hot: '56.11', updatedSize: '5.85 GB', updateSize: '10.85 GB', speed: '-', time: '19:20:20' }
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
      handleButtonSet (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          this.$router.push({
            path: 'subtype2-set',
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

