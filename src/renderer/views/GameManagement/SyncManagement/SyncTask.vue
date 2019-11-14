<template>
  <div>
   
      <Row :gutter="16" class="header">
        <Col span='4'>
          <AutoComplete  icon="ios-search" class="topColumn"  :placeholder="$t('SupportGameInit')"  @on-change='ChangeValue'  />
         </Col>
      <Col  span='3'>
           <Select v-model="gameType" @on-change="handleGetGameByTypeName" :placeholder="$t('PleaseInputGameType')">
             <Option v-for="item in gameList" :value="item.id" :key="item.id">{{ $t(item.name) }}</Option>
           </Select>
        </Col>
      <Button type="primary" class="topColumn" @click="handleButtonStart">{{$t('Start')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonStop">{{$t('Pause')}}</Button>
      <Button type="error"   class="topColumn" @click="handleButtonDelete">{{$t('DeleteTask')}}</Button>
      </Row>
   
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" @on-sort-change="handleTableSort" stripe :no-data-text="this.$t('Nodata')"></Table>
    <Row style="margin-top:10px; ">
      <Page :current="this.pageinfo.page_index + 1" :total="this.pageinfo.count" :page-size="this.Pagelimit" show-total  @on-change="hanbleChangePage" style=" float:right;"/>
    </Row>
    <!-- 删除提示 -->
        <Modal
        v-model="showDeleteBox"
        :title="$t('DeleteTip')"
        @on-ok="handleConfirmDelete"
        >
        <p>{{$t('DeleteCurrentData')}}?</p>
    </Modal>
  </div>
</template>

<script>
  import { deleteSyncQueue, getAllSyncGameTasks, multiAddSyncTask, stopSyncGameTask } from '@/api/sync'
  import { getAllCenterGameTypes } from '@/api/game'
  // import { deleteSyncQueue } from '@/api/sync'
  // const _ = require('lodash')
  export default {
    name: 'subType4-2',
    data () {
      return {
        showDeleteBox: false,
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        gameType: 0,
        gameList: [
          { id: 0, name: 'AllGame' }
        ],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          {
            renderHeader: (h, params) => { return h('span', this.$t('CurrentStatus')) },
            key: 'state',
            align: 'center',
            minWidth: 96,
            maxWidth: 96,
            render: (h, params) => {
              let type = params.row.state
              switch (type) {
                case 0:
                  return h('span', { style: { color: '#25da30' } }, this.$t('NotInitiated'))
                case 1:
                  return h('span', { style: { color: '#ff0000' } }, this.$t('Running'))
                case 2:
                  return h('span', { style: { color: '#ff0000' } }, this.$t('fail'))
                case 3:
                  return h('span', { style: { color: '#47cb89' } }, this.$t('success'))
              }
            }
          },
          { title: '游戏类型', key: 'game_type', tooltip: true, maxWidth: 105, minWidth: 105, renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
          { title: '游戏名称', key: 'display_name', maxWidth: 130, minWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
          // { title: '热度', key: 'popularity', maxWidth: 98, minWidth: 98, renderHeader: (h, params) => { return h('span', this.$t('Popularity')) } },
          { title: '目标服务器地址', key: 'server_ip', maxWidth: 130, minWidth: 140, renderHeader: (h, params) => { return h('span', this.$t('TargetServerAddress')) } },
          { title: '源路径', key: 'src_dir', maxWidth: 110, minWidth: 110, tooltip: true, renderHeader: (h, params) => { return h('span', this.$t('SourcePath')) } },
          { title: '目标路径', key: 'dst_dir', maxWidth: 122, minWidth: 110, tooltip: true, renderHeader: (h, params) => { return h('span', this.$t('TargetPath')) } },
          { title: '更新量', key: 'total_bytes', maxWidth: 109, minWidth: 109, renderHeader: (h, params) => { return h('span', this.$t('UpdateVolume')) } },
          { title: '已更新', key: 'update_bytes', maxWidth: 100, minWidth: 100, renderHeader: (h, params) => { return h('span', this.$t('Updated')) } },
          // { title: '更新速度', key: 'update_speed', maxWidth: 100, minWidth: 100, tooltip: true, renderHeader: (h, params) => { return h('span', this.$t('UpdateSpeed')) } },
          { title: '预计完成时间', key: 'expect_complete_time', minWidth: 130, tooltip: true, renderHeader: (h, params) => { return h('span', this.$t('EstimatedFinishTime')) } }
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
          page_index: 0,
          page_size: 0
        },
        Pagelimit: 10
      }
    },
    created () {
      this.handleGetTableList()
      this.handleGameType()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      /**
       * 通过游戏类型查询游戏
       */
      handleGameType () {
        getAllCenterGameTypes().then(res => {
          res.data.forEach(item => {
            this.gameList.push(item)
          })
        })
      },
      /**
       * 通过游戏类型查询游戏
       */
      handleGetGameByTypeName (pagetypeid) {
        this.handleGetTableList(0, this.Pagelimit, pagetypeid)
      },
      /**
       * 更加游戏首字母查询
       */
      ChangeValue (letter) {
        this.handleGetTableList(0, this.Pagelimit, this.gameType, letter)
      },
  
      /**
       * @pagetypeid 游戏类型ID
       * @letter 游戏名首字母  0 查询全部类型
       * 查询同步日志
       */
      handleGetTableList (offset = 0, limit = this.Pagelimit, pagetypeid = 0, letter = '') {
        var data = {
          offset: offset,
          limit: limit,
          pagetypeid: pagetypeid === 0 ? '' : pagetypeid,
          letter
        }
        getAllSyncGameTasks(data).then((resp) => {
          this.tableData = resp.data.data ? resp.data.data : []
          this.tableData.forEach(item => {
            item.expect_complete_time = this.formatTime(item.expect_complete_time)
          })
          this.pageinfo = resp.data.pageino
        }, (res) => {})
      },
      /**
       * 切换页码
       */
      hanbleChangePage (e) {
        this.handleGetTableList((e - 1) * this.Pagelimit, this.Pagelimit)
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
      formatTime (item) {
        if (item === -1) {
          return '-'
        }
        let date = new Date(item)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getMonth()
        let houters = date.getHours()
        let Minutes = date.getMinutes()
        return `${year}/${month}/${day}:${houters}:${Minutes}`
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
        let val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          let str = ''
          this.getCheckboxVal.filter(item => {
            str = str + item.task_id + ','
          })
          str = str.substr(0, str.length - 1) // 切换最后一个字符
          deleteSyncQueue(str).then((res) => {
            let index
            if (this.page_size > val) {
              index = this.pageinfo.page_index
            } else {
              index = this.pageinfo.page_index === 0 ? 0 : this.pageinfo.page_index - 1
            }
            this.handleGetTableList(index, this.Pagelimit)
          }, () => {
          })
        }
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
          // let str = ''
          // this.getCheckboxVal.filter(item => {
          //   str = str + item.task_id + ','
          // })
          // str = str.substr(0, str.length - 1) // 切换最后一个字符
          let result = this.getCheckboxVal.map(item => {
            return item.task_id
          })
          multiAddSyncTask(result.join(',')).then((resp) => {
            // this.$Notice.success({
            //   title: this.$t('OperationSuccessful'),
            //   desc: '已成功添加同步任务中，可去同步任务查看详细内容'
            // })
          }, (err) => {
            this.$Message.error(this.$t(err.data))
          }).finally(() => {
            this.handleGetTableList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: '' })
          })
        }
      },
      handleButtonStop (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          let result = this.getCheckboxVal.map(item => {
            return item.task_id
          })
          stopSyncGameTask(result.join(',')).then(
            resp => {},
            (e) => {
              this.notifyUser('error', `${e.data.error}`)
            }
          ).finally(() => {
            this.handleGetTableList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: '' })
          })
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
      handleTableSort (data) {
        alert(data)
      }
    }
  }
</script>

<style scoped>
  .header{
    margin-bottom: 20px;
  }
  .topColumn{ float:left; margin-right:10px;}
  Table{
    overflow-x: hidden
  }
</style>

