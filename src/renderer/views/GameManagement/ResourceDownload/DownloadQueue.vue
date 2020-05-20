<template>
  <div>
    <div class="topItem">
      <Button
        type="primary"
        class="topColumn"
        @click="handleButtonRefesh"
        :disabled="this.tableData.length === 0">
      {{$t('Refresh')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonStart">{{$t('Start')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonStop">{{$t('Pause')}}</Button>
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
import { pauseGame, resumeGame } from '@/api/game'
import { bytesToSize2, formatTime1, formatSize } from '@/utils/index'
export default {
  name: 'DownloadQ',
  data () {
    return {
      getCheckboxVal: [], // 勾选复选框值
      tableSelectVal: [],
      timer: null,
      tableColumns: [
        { type: 'selection', width: 60, align: 'center' },
        {
          minWidth: 90,
          renderHeader: (h, params) => { return h('span', this.$t('Status')) },
          key: 'Status',
          render: (h, params) => {
            let state = params.row.Status
            switch (state) {
              case -1:
                return h('span', { style: { color: '#999999' } }, this.$t('unknown'))
              case 0:
                return h('span', { style: { color: 'red' } }, this.$t('error'))
              case 1:
                return h('span', this.$t('seeding'))
              case 2:
                return h('span', { style: { color: '#008000' } }, this.$t('downloading'))
              case 3:
                return h('span', { style: { color: '#B47676' } }, this.$t('paused'))
              case 4:
                return h('span', this.$t('stopped'))
              case 5:
                return h('span', this.$t('checking'))
              case 6:
                return h('span', this.$t('checking'))
              case 7:
                return h('span', { style: { color: '#008000' } }, this.$t('finished'))
            }
          }
        },
        { key: 'TypeName', minWidth: 120, renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
        { key: 'DisplayName', minWidth: 120, renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
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
          // render: (h, params) => {
          //   return h('span', `${parseInt((params.row.UpdateBytes / params.row.TotalBytes) * 100)}%`)
          // }
          render: (h, params) => {
            // return h[('div',[
            //   h('Progress',{
            //     percent:100
            //   })
            // ])
            console.log(parseInt((params.row.UpdateBytes / params.row.TotalBytes) * 100))
            return h('div', [
              h('Progress', {
                props: {
                  percent: parseInt((params.row.UpdateBytes / params.row.TotalBytes) * 100),
                  'stroke-width': 10
                }
              })
            ])
          }
        },
        { key: 'UpdateSpeed',
          minWidth: 110,
          renderHeader: (h, params) => { return h('span', this.$t('UpdateSpeed')) },
          render: (h, params) => {
            return h('span', formatSize(params.row.UpdateSpeed))
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
        page_index: 0
      },
      Pagelimit: 10
    }
  },
  created () {
    this.HandleGetLoadQueue(0, this.Pagelimit, 'name')
  },
  mounted () {
    this.Strat()
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },

  beforeRouteLeave (to, from, next) {
    clearTimeout(this.timer)
    this.timer = null
    next()
  },
  methods: {
    handleButtonRefesh () {
      this.HandleGetLoadQueue(0, this.Pagelimit, 'name')
    },
    fetch () {
      this.HandleGetLoadQueue(this.offset, this.Pagelimit, 'name')
    },
    Strat () {
      this.timer = setTimeout(() => {
        this.Strat()
        this.handleButtonRefesh()
      }, 2000)
    },
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
        // this.$Message.info({
        //   content: this.$t(response.data.error),
        //   closable: true
        // })
      })
    },
    handleCheckBox (data) {
      this.getCheckboxVal = data
    },
    handleTableSort () {},
    handleButtonStart () {
      if (this.getCheckboxVal.length !== 0) {
        this.getCheckboxVal.forEach(item => {
          resumeGame(item.CenterGameId).then((resp) => {
            this.getCheckboxVal = []
            this.$Message.success(this.$t(resp.data))
          }, error => {
            this.$Message.error(this.$t(error.data.error))
          }).finally(() => {
            this.HandleGetLoadQueue(0, this.Pagelimit, 'name')
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
      this.offset = (index - 1) * this.Pagelimit
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

