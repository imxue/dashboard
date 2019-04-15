<template>
  <div>
    <div class="topItem">
      <DatePicker size="large" type="date" placeholder="请选择日期" @on-change="handleChangeDate"></DatePicker>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData"></Table>
    <Row style="margin-top:10px; ">
      <Page :total="100" style=" float:right;"/>
    </Row>
    
  </div>
</template>

<script>
  export default {
    name: 'subType2-2',
    data () {
      return {
        tableColumns: [
          {
            title: '状态',
            key: 'state',
            render: (h, params) => {
              let type = params.row.state
              switch (type) {
                case 0:
                  return h('span', { style: { color: '#008000' } }, '完成')
                case 1:
                  return h('span', '等待')
                case 2:
                  return h('span', { style: { color: '#ff0000' } }, '失败')
                default:
                  return '-'
              }
            }
          },
          { title: '游戏类型', key: 'type' },
          { title: '游戏名称', key: 'name' },
          { title: '下载版本', key: 'version' },
          { title: '更新量', key: 'updateSize' },
          { title: '开始时间', key: 'startTime' },
          { title: '结束时间', key: 'endTime' },
          { title: '操作',
            key: 'operation',
            render: (h, params) => {
              let type = params.row.state
              let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
                on: { click: () => { this.handleTableDw(params.row) } }
              }, '重新下载')
              switch (type) {
                case 2:
                  return h('div', [a])
                default:
                  return h('div', '-')
              }
            }
          }
        ],
        tableData: [
          { id: 0, state: 0, type: '网络游戏', name: '英雄联盟', version: '56.11', startTime: 'xxxxxx', endTime: 'xxxxxx', updateSize: '10.85 GB' },
          { id: 1, state: 0, type: '网络游戏', name: '英雄联盟', version: '56.11', startTime: 'xxxxxx', endTime: 'xxxxxx', updateSize: '10.85 GB' },
          { id: 2, state: 2, type: '网络游戏', name: '英雄联盟', version: '56.11', startTime: 'xxxxxx', endTime: 'xxxxxx', updateSize: '10.85 GB' },
          { id: 3, state: 1, type: '网络游戏', name: '英雄联盟', version: '56.11', startTime: 'xxxxxx', endTime: 'xxxxxx', updateSize: '10.85 GB' },
          { id: 4, state: 0, type: '网络游戏', name: '英雄联盟', version: '56.11', startTime: 'xxxxxx', endTime: 'xxxxxx', updateSize: '10.85 GB' },
          { id: 5, state: 1, type: '网络游戏', name: '英雄联盟', version: '56.11', startTime: 'xxxxxx', endTime: 'xxxxxx', updateSize: '10.85 GB' },
          { id: 6, state: 1, type: '网络游戏', name: '英雄联盟', version: '56.11', startTime: 'xxxxxx', endTime: 'xxxxxx', updateSize: '10.85 GB' },
          { id: 7, state: 1, type: '网络游戏', name: '英雄联盟', version: '56.11', startTime: 'xxxxxx', endTime: 'xxxxxx', updateSize: '10.85 GB' }
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
      handleChangeDate (data) {
        alert(data)
      },
      handleTableDw (index) {
        var currId = index.id
        alert(currId)
      }
    }
  }
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>

