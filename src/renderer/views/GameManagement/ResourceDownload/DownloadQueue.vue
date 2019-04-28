<template>
  <div>
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonStart">{{$t('Start')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonStop">{{$t('Pause')}}</Button>
      <!-- <Button type="error"   class="topColumn" @click="handleButtonDelete">删除任务</Button>
      <Button type="primary" class="topColumn" @click="handleButtonTop">置顶</Button>
      <Button type="primary" class="topColumn" @click="handleButtonMove">上移</Button>
      <Button type="primary" class="topColumn" @click="handleButtonSet">下载设置</Button> -->
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" @on-sort-change="handleTableSort" stripe></Table>
    <Row style="margin-top:10px; ">
      <Page :total="100" :current="1" @on-change="changePage"  style=" float:right;"/>
    </Row>
    
  </div>
</template>

<script>
import { getLoad, deleteLocalGame } from '@/api/localGame'
import { bytesToSize2 } from '@/utils/index'
export default {
  name: 'subType2-1',
  data () {
    return {
      getCheckboxVal: [], // 勾选复选框值
      tableSelectVal: [],
      tableColumns: [
        { type: 'selection', width: 60, align: 'center' },
        {
          renderHeader: (h, params) => { return h('span', this.$t('Status')) },
          key: 'Status'
        },
        { key: 'TypeName', renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
        { key: 'Name', renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
        // { title: '当前热度', key: 'hot' },
        { key: 'UpdateBytes', renderHeader: (h, params) => { return h('span', this.$t('UpdateVolume')) } },
        { key: 'UpdateBytes', renderHeader: (h, params) => { return h('span', this.$t('updatedVolume')) } },
        { key: 'Progress', renderHeader: (h, params) => { return h('span', this.$t('progress')) } },
        { key: 'UpdateSpeed', renderHeader: (h, params) => { return h('span', this.$t('UpdateSpeed')) } },
        { key: 'PreFinishedTime', renderHeader: (h, params) => { return h('span', this.$t('EstimatedFinishTime')) } },
        { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
          key: 'operation',
          render: (h, params) => {
            let type = params.row.id
            let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
              on: { click: () => { this.handleTableDelete(params.row.CenterGameId) } }
            }, this.$t('Delete'))
            let b = h('span', {
              style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
              on: { click: () => { this.handleTableMove(params.row) } }
            }, this.$t('MoveUp'))
            let c = h('span', {
              style: { color: '#2d8cf0', textDecoration: 'underline' },
              on: { click: () => { this.handleTableTop(params.row) } }
            }, this.$t('Topping'))
            switch (type) {
              case 0:
                return h('div', [a])
              default:
                return h('span', [a, b, c])
            }
          }
        }
      ],
      tableData: [] // 队列数据
    }
  },
  created () {
    this.HandleGetLoadQueue(0, 10, 'name')
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    /**
     * 获取下载队列
     */
    HandleGetLoadQueue (offset, limit, orderby) {
      getLoad(offset, limit, orderby).then(response => {
        console.log('获取下载队列')
        console.log(response)
        console.log('获取下载队列')
        if (response.data.data) {
          let temp = response.data.data
          for (let i = 0; i < temp.length; i++) {
            temp[i].Progress = Math.round(temp[i].UpdateBytes / temp[i].TotalBytes * 10000) / 100.00 + '%'
            temp[i].TotalBytes = bytesToSize2(temp[i].TotalBytes)
          }
          this.tableData = response.data.data
        }
      })
    },
    /**
     * 删除
     */
    handleTableDelete (id) {
      this.$Modal.confirm({
        title: this.$t('DeleteTip'),
        okText: this.$t('confirm'),
        cancelText: this.$t('cancelText'),
        onOk: () => {
          deleteLocalGame(id).then((e) => { console.log(e) }, (e) => { console.log(e) }).catch((e) => { console.log(e) })
        }
      })
    },
    /**
     *
    */
    handleCheckBox () {

    },
    handleTableTop () {},
    handleTableSort () {},
    handleButtonStart () {},
    handleButtonStop () {},
    changePage () {}
  }

}
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>

