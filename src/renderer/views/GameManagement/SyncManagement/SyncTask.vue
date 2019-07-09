<template>
  <div>
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonStart">{{$t('Start')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonStop">{{$t('Pause')}}</Button>
      <Button type="error"   class="topColumn" @click="handleButtonDelete">{{$t('DeleteTask')}}</Button>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonTop">{{$t('Topping')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonMove">{{$t('MoveUp')}}</Button> -->
    </div>
    <!-- table -->
    <Table border ref="selection" :loading='fetch' :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" @on-sort-change="handleTableSort" stripe :no-data-text="this.$t('Nodata')"></Table>
    <Row style="margin-top:10px; ">
      <Page :current="page_index" :total="pageinfo.count" :page-size="this.Pagelimit" show-total  @on-change="hanbleChangePage" style=" float:right;"/>
    </Row>
    <!-- 删除提示 -->
        <Modal
        v-model="showDeleteBox"
        :title="$t('DeleteTip')"
        @on-ok="handleConfirmDelete"
        @on-cancel="handleCancel"
        >
        <p>是否删除当前任务？</p>
    </Modal>
  </div>
</template>

<script>
  import { deleteSyncQueue, getAllSyncGameTasks, multiAddSyncTask } from '@/api/sync'
  // import { deleteSyncQueue } from '@/api/sync'
  // const _ = require('lodash')
  export default {
    name: 'subType4-2',
    data () {
      return {
        fetch: false,
        curroffset: 0,
        currlimit: 10,
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
                  return h('span', { style: { color: '#25da30' } }, '禁止同步')
                case 1:
                  return h('span', { style: { color: '#25da30' } }, '未分配')
                case 2:
                  return h('span', '待更新')
                case 3:
                  return h('span', '等待磁盘分配')
                case 4:
                  return h('span', '更新中')
                case 5:
                  return h('span', '更新失败')
                case 6:
                  return h('span', '更新成功')
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
        ],
        pageinfo: {
          count: 0,
          page_index: 0
        },
        Pagelimit: 11
      }
    },
    created () {
      this.handleGetTableList(0, this.Pagelimit)
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
      // handleGetTableList: _.throttle(function () {
      //   this.fetch = true
      //   var info = {
      //     offset: 0,
      //     limit: 10
      //   }
      //   getAllSyncGameTasks(info).then((resp) => {
      //     this.tableData = resp.data.data ? resp.data.data : []
      //     this.pageinfo = resp.data.pageino
      //     console.log(this.pageinfo)
      //   }, (res) => {
      //   }).finally(() => {
      //     this.fetch = false
      //   })
      // }, 2000),
      handleGetTableList (offset, limit) {
        this.fetch = true
        var info = {
          offset: offset,
          limit: limit
        }
        getAllSyncGameTasks(info).then((resp) => {
          this.tableData = resp.data.data ? resp.data.data : []
          this.pageinfo = resp.data.pageino
          this.pageinfo.page_index++
        }, (res) => {})
          .catch(() => { this.fetch = false })
          .finally(() => { this.fetch = false })
      },
      /**
       * 切换页码
       */
      hanbleChangePage (e) {
        this.handleGetTableList((e - 1) * this.Pagelimit, this.Pagelimit, 'Name')
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
        this.getCheckboxVal = name
      },
      handleButtonDelete (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          this.showDeleteBox = true
        }
      },
      /**
       * 删除同步任务
       */
      handleConfirmDelete () {
        deleteSyncQueue(this.getCheckboxVal[0].task_id).then((res) => {
          this.handleGetTableList(this.pageinfo.page_index, this.Pagelimit)
        }, () => {
        })
      },
      handleCancel () {
        this.showDeleteBox = false
      },
      handleCheckBox (arr) {
        this.getCheckboxVal = arr
      },
      handleButtonTop (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          alert('val')
        }
      },
      /**
       * 开始同步任务
       */
      handleButtonStart () {
        let val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          multiAddSyncTask(this.getCheckboxVal[0].task_id).then((resp) => {
            this.$Notice.success({
              title: this.$t('OperationSuccessful'),
              desc: '已成功添加同步任务中，可去同步任务查看详细内容'
            })
          }, (err) => {
            this.$Message.error(this.$t(err.data))
          })
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

