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
          minWidth: 110,
          renderHeader: (h, params) => { return h('span', this.$t('Status')) },
          key: 'Status',
          render: (h, params) => {
            if (params.row.TaskStatus === 2 && params.row.UpdateBytes === 0) {
              return h('span', '正在分配磁盘空间')
            } else {
              let operate = {
                1: '下载',
                2: '上传',
                3: '做种',
                4: '停止上传',
                5: '删除游戏'
              }
              let state = {
                1: '等待中',
                2: '中',
                3: '成功',
                4: '失败'
              }
              switch (params.row.OperateType) {
                case 1:
                  return h('div', [
                    h('Icon', {
                      props: {
                        type: 'md-arrow-down',
                        color: 'green',
                        size: '20'
                      }
                    }),
                    h(
                      'span',
                      operate[params.row.OperateType] +
                        state[params.row.TaskStatus]
                    )
                  ])
                case 2:
                  return h('div', [
                    h('Icon', {
                      props: {
                        type: 'md-arrow-up',
                        color: 'green',
                        size: '20'
                      }
                    }),
                    h(
                      'span',
                      operate[params.row.OperateType] +
                        state[params.row.TaskStatus]
                    )
                  ])

                case 4:
                  return h('div', [
                    h('Icon', {
                      props: {
                        type: 'ios-pause-outline',
                        color: 'green',
                        size: '20'
                      }
                    }),
                    h(
                      'span',
                      operate[params.row.OperateType] +
                        state[params.row.TaskStatus]
                    )
                  ])
                default:
                  return h('div', [
                    h('Icon', {
                      props: {
                        type: 'ios-arrow-round-up',
                        color: 'green',
                        size: '20'
                      }
                    }),
                    h('span', operate[params.row.OperateType]),
                    h('span', state[params.row.TaskStatus])
                  ])
              }
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
          render: (h, params) => {
            // if (params.row.UpdateBytes === 0) {
            //   return h('span', '正在对比文件')
            // } else {
            return h('div', [
              h('Progress', {
                props: {
                  percent: parseInt((params.row.UpdateBytes / params.row.TotalBytes) * 100) || 0,
                  'stroke-width': 10
                }
              })
            ])
            // }
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
        },
        {
          key: '',
          title: ' '
        }

      ],
      tableData: [], // 队列数据
      pageinfo: {
        count: 0,
        page_index: 0
      },
      offset: 0,
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
      this.HandleGetLoadQueue(this.offset, this.Pagelimit, 'name')
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
        if (response.status !== 403) {
          window.clearTimeout(this.timer)
        }
        this.tableData = []
        this.pageinfo = { count: 0, page_index: 0 }
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

