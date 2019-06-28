<template>
  <div>
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonStart">{{$t('Start')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonStop">{{$t('Pause')}}</Button>
      <Button type="error"   class="topColumn" @click="handleButtonDelete">{{$t('DeleteTask')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonTop">{{$t('Topping')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonMove">{{$t('MoveUp')}}</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :loading='fetch' :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" @on-sort-change="handleTableSort" stripe :no-data-text="this.$t('Nodata')"></Table>
    <Row style="margin-top:10px; ">
      <Page :current="currentPage" :total="totalPageNumber" show-total  @on-change="hanbleChangePage" style=" float:right;"/>
    </Row>
    <!-- 删除提示 -->
        <Modal
        v-model="showDeleteBox"
        title="$t('DeleteTip')"
        @on-ok="handleConfirmDelete"
        @on-cancel="handleCancel"
        width = "300">
        <p>是否删除当前任务？</p>
    </Modal>
  </div>
</template>

<script>
  import { deleteSyncQueue, getAllSyncGameTasks } from '@/api/sync'
  // import { deleteSyncQueue } from '@/api/sync'
  const _ = require('lodash')
  export default {
    name: 'subType4-2',
    data () {
      return {
        fetch: false,
        curroffset: 0,
        currlimit: 10,
        totalPageNumber: 0,
        pageSize: 10,
        currentPage: 1,
        showDeleteBox: false,
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          {
            renderHeader: (h, params) => { return h('span', this.$t('CurrentStatus')) },
            key: 'state',
            minWidth: 130,
            render: (h, params) => {
              let type = params.row.state
              switch (type) {
                case 0:
                  return h('span', { style: { color: '#25da30' } }, '计算差异')
                case 1:
                  return h('span', { style: { color: '#25da30' } }, '同步数据')
                case 2:
                  return h('span', '数据校验')
                case 3:
                  return h('span', '等待')
                default:
                  return '-'
              }
            }
          },
          { title: '游戏类型', key: 'game_type', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
          { title: '游戏名称', key: 'display_name', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
          { title: '热度', key: 'popularity', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('Popularity')) } },
          { title: '目标服务器地址', key: 'server_ip', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('TargetServerAddress')) } },
          { title: '源路径', key: 'src_dir', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('SourcePath')) } },
          { title: '目标路径', key: 'dst_dir', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('TargetPath')) } },
          { title: '更新量', key: 'total_bytes', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('UpdateVolume')) } },
          { title: '已更新', key: 'update_bytes', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('Updated')) } },
          { title: '更新速度', key: 'update_speed', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('UpdateSpeed')) } },
          { title: '预计完成时间', key: 'expect_complete_time', minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('EstimatedFinishTime')) } }
          // { title: '操作',
          //   key: 'operation',
          //   render: (h, params) => {
          //     let type = params.row.id
          //     let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
          //       on: { click: () => { this.handleTableDelete(params.index) } }
          //     }, '删除')
          //     let b = h('span', {
          //       style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
          //       on: { click: () => { this.handleTableMove(params.row) } }
          //     }, '上移')
          //     let c = h('span', {
          //       style: { color: '#2d8cf0', textDecoration: 'underline' },
          //       on: { click: () => { this.handleTableTop(params.row) } }
          //     }, '置顶')
          //     switch (type) {
          //       case 0:
          //         return h('div', [a])
          //       default:
          //         return h('span', [a, b, c])
          //     }
          //   }
          // }
        ],
        tableData: [
          {
            'state': '',
            'game_type': '',
            'display_name': '',
            'popularity': '',
            'server_ip': '',
            'Localpath': '',
            'Dir': '',
            'total_bytes': '',
            'update_bytes': '',
            'update_speed': '',
            'expect_complete_time': ''

          }
        ]
      }
    },
    created () {
      this.handleGetTableList()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      /**
      * 获取同步任务
      */
      handleGetTableList: _.debounce(function () {
        this.fetch = true
        var info = {
          offset: 0,
          limit: 10
        }
        getAllSyncGameTasks(info).then((resp) => {
          this.tableData = resp.data.data.data ? resp.data.data.data : []
        }, (res) => {
        }).finally(() => {
          this.tableData = []
          this.fetch = false
        })
      }, 1000),
  
      hanbleChangePage (num) {
        if (num === 1) {
          num = 0
        } else {
          num = (this.currlimit * num) - this.currlimit
        }
        this.handleGetTableList(num, this.currlimit)
      },
      handleCallBackVaild (res) {
        var code = res.data.Code
        if (code === 0 || res.data.state === 'OK') {
          this.$Message.success('操作成功')
        } else {
          this.$Message.error('操作失败：' + res.data.Msg)
        }
      },
      handleCheckBoxNumber (name) {
        var val = this.getCheckboxVal.length
        if (val === 0 || val > 1) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          this.handlePostData(name)
        }
      },
      handleButtonDelete (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          this.showDeleteBox = true
        }
      },
      handleConfirmDelete () {
        var self = this
        deleteSyncQueue(this.getCheckboxVal).then((res) => {
          self.handleCallBackVaild(res)
        }, () => {
        })
      },
      handleCancel () {
        this.showDeleteBox = false
      },
      handleCheckBox (arr) {
        var data = arr
        var list = []
        for (var i in arr) {
          list.push(data[i].Id)
        }
        this.getCheckboxVal = list
        console.log(JSON.stringify(list))
        return this.getCheckboxVal
      },
      handleButtonTop (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          alert('val')
        }
      },
      handleButtonStart (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          alert('val')
        }
      },
      handleButtonStop (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          alert('val')
        }
      },
      handleButtonMove (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          alert('val')
        }
      },
      // handleTableDelete (index) {
      //   this.tableData.splice(index, 1)
      // },
      // handleTableMove (index) {},
      // handleTableTop (index) {
      //   var currId = index.id
      //   alert(currId)
      // },
      handleTableSort (data) {
        alert(data)
      }
    }
  }
</script>

<style scoped>
  .topItem{ padding: 10px 0}
  .topColumn{ float:left; margin-right:10px;}
</style>

