<template>
  <div>
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonStart">{{$t('Start')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonStop">{{$t('Pause')}}</Button>
      <!-- <Button type="error"   class="topColumn" @click="handleButtonDelete">删除任务</Button>
      <Button type="primary" class="topColumn" @click="handleButtonTop">置顶</Button>
      <Button type="primary" class="topColumn" @click="handleButtonMove">上移</Button> -->
      <router-link to='DownloadSet'>
      <Button type="primary" class="topColumn">{{$t('DownloadSetting')}}</Button> 
      </router-link>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" @on-sort-change="handleTableSort" stripe ></Table>
    <Row style="margin-top:10px; ">
      <Page :total="this.pageinfo.count" :current="Number(this.pageinfo.page_index + 1)" :page-size="this.Pagelimit" @on-change="changePage"  style=" float:right;"/>
    </Row>
    
  </div>
</template>

<script>
import { getLoad } from '@/api/localGame'
import { pauseGame, startSyncGameTasks } from '@/api/game'
import { bytesToSize2, formatTime1 } from '@/utils/index'
export default {
  name: 'DownloadQ',
  data () {
    return {
      getCheckboxVal: [], // 勾选复选框值
      tableSelectVal: [],
      tableColumns: [
        { type: 'selection', width: 60, align: 'center' },
        {
          minWidth: 90,
          renderHeader: (h, params) => { return h('span', this.$t('Status')) },
          key: 'Status',
          render: (h, params) => {
            let state = params.row.Status
            switch (state) {
              case '-1':
                return h('span', { style: { color: '#999999' } }, this.$t('unknown'))
              case '0':
                return h('span', { style: { color: 'red' } }, this.$t('error'))
              case '1':
                return h('span', this.$t('seeding'))
              case '2':
                return h('span', { style: { color: '#008000' } }, this.$t('downloading'))
              case '3':
                return h('span', { style: { color: '#B47676' } }, this.$t('paused'))
              case '4':
                return h('span', this.$t('stopped'))
              case '5':
                return h('span', this.$t('checking'))
              case '6':
                return h('span', this.$t('checking'))
              case '7':
                return h('span', { style: { color: '#008000' } }, this.$t('finished'))
            }
          }
        },
        { key: 'TypeName', minWidth: 120, renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
        { key: 'Name', minWidth: 120, renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
        { key: 'TotalBytes',
          minWidth: 120,
          renderHeader: (h, params) => { return h('span', this.$t('UpdateVolume')) },
          render: (h, params) => {
            return h('span', bytesToSize2(params.row.TotalBytes))
          }
        },
        { key: 'UpdateBytes',
          minWidth: 120,
          renderHeader: (h, params) => { return h('span', this.$t('UpdatedVolume')) },
          render: (h, params) => {
            return h('span', bytesToSize2(params.row.UpdateBytes))
          } },
        { key: 'Progress',
          minWidth: 110,
          renderHeader: (h, params) => { return h('span', this.$t('progress')) },
          render: (h, params) => {
            return h('span', `${parseInt((params.row.UpdateBytes / params.row.TotalBytes) * 100)}%`)
          }
        },
        { key: 'UpdateSpeed',
          minWidth: 110,
          renderHeader: (h, params) => { return h('span', this.$t('UpdateSpeed')) },
          render: (h, params) => {
            return h('span', params.row.UpdateSpeed)
          } },
        { key: 'PreFinishedTime',
          minWidth: 110,
          renderHeader: (h, params) => { return h('span', this.$t('EstimatedFinishTime')) },
          render: (h, params) => {
            if (params.row.PreFinishedTime === -1) {
              return h('span', '-')
            } else {
              return h('span', formatTime1(params.row.PreFinishedTime))
            }
          }
        }
        // { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
        //   key: 'operation',
        //   minWidth: 130,
        //   render: (h, params) => {
        //     let type = params.row.id
        //     let a = h('span', { style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
        //       on: { click: () => { this.handleTableDelete(params.row.CenterGameId) } }
        //     }, this.$t('Delete'))
        //     // let b = h('span', {
        //     //   style: { color: '#2d8cf0', textDecoration: 'underline', marginRight: '10px' },
        //     //   on: { click: () => { this.handleTableMove(params.row) } }
        //     // }, this.$t('MoveUp'))
        //     // let c = h('span', {
        //     //   style: { color: '#2d8cf0', textDecoration: 'underline' },
        //     //   on: { click: () => { this.handleTableTop(params.row) } }
        //     // }, this.$t('Topping'))
        //     switch (type) {
        //       case 0:
        //         return h('div', [a])
        //       default:
        //         return h('span', [a])
        //     }
        //   }
        // }
      ],
      tableData: [], // 队列数据
      pageinfo: {
        count: 0,
        page_index: '1'

      },
      Pagelimit: 10
    }
  },
  created () {
    this.HandleGetLoadQueue(0, this.Pagelimit, 'name')
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
        let data = response.data.data
        if (data.length !== 0) {
          this.tableData = data
          this.pageinfo = response.data.pageino
        }
      }, (response) => {
        console.log('获取下载队列')
        console.log(response)
        console.log('获取下载队列')
      })
    },
    /**
     * 删除
     */
    // handleTableDelete (id) {
    //   this.$Modal.confirm({
    //     title: this.$t('DeleteTip'),
    //     okText: this.$t('confirm'),
    //     cancelText: this.$t('cancelText'),
    //     onOk: () => {
    //       deleteLocalGame(id).then((e) => { console.log(e) }, (e) => { console.log(e) }).catch((e) => { console.log(e) })
    //     }
    //   })
    // },
    /**
     *
    */
    handleCheckBox (data) {
      this.getCheckboxVal = data
    },
    handleTableTop () {
      pauseGame()
    },
    handleTableSort () {},
    handleButtonStart () {
      if (this.getCheckboxVal.length !== 0) {
        this.getCheckboxVal.forEach(item => {
          startSyncGameTasks(item.CenterGameId).then((resp) => {
            this.$Message.success(this.$t(resp.data))
          }, error => {
            this.$Message.error(this.$t(error.data.error))
          }).finally(() => {
            this.HandleGetLoadQueue(0, 10, 'name')
          })
        })
      }
    },
    handleButtonStop () {
      if (this.getCheckboxVal.length !== 0) {
        let array = this.getCheckboxVal
        console.log(array)
        array.forEach(item => {
          console.log(array)
          this.handlepauseGame(item.CenterGameId)
        })
        // this.HandleGetLoadQueue(0, 10, 'name')
      }
    },
    handlepauseGame (CenterGameId) {
      pauseGame(CenterGameId).then((resp) => {
        this.$Message.success(this.$t(resp.data))
      }, (error) => {
        console.log(error)
      }).catch((e) => {
        console.log(e)
      })
        .finally(() => {
          this.HandleGetLoadQueue(0, 10, 'name')
        })
    },
    changePage (index) {
      this.HandleGetLoadQueue((index - 1) * this.Pagelimit, this.Pagelimit)
    }
  }

}
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>

