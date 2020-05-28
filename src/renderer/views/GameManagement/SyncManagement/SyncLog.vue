<template>
  <div class="container">
    <Row :gutter="16">
      <Col span='4'>
          <AutoComplete  icon="ios-search" class="topColumn"  :placeholder="$t('SupportGameInit')"  @on-change='ChangeValue'  />
         </Col>
        
        <Col span='3'>
           <Select v-model="gameType" @on-change="handleGetGameByTypeName" :placeholder="$t('PleaseInputGameType')">
             <Option v-for="item in gameList" :value="item.id" :key="item.id">{{ $t(item.name) }}</Option>
           </Select>
        </Col>
          <Col span='3'>
          <!-- <Button  type="primary" @click="handleTableResync">重新同步</Button> -->
         </Col>
    </Row>
    <!-- table -->
    <div class="main">
    <Table border ref="selection" :columns="tableColumns" :data="tableData" stripe :no-data-text="this.$t('Nodata')"></Table>
    <Row style="margin-top:10px; ">
      <Page :current="this.pageinfo.page_index" :total="this.pageinfo.count" :page-size="this.Pagelimit" show-total  @on-change="hanbleChangePage" style=" float:right;"/>
    </Row>
    </div>
    
  </div>
</template>

<script>
  import { getAllSyncGameLogs, resync } from '@/api/sync'
  import { getAllCenterGameTypes } from '@/api/game'
  // import { formatTime1 } from '@/utils/index'
  export default {
    name: 'subType4-3',
    data () {
      return {
        gameType: 0,
        gameList: [
          { id: 0, name: 'AllGame' }
        ],
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        tableColumns: [
          // { type: 'selection', width: 60, align: 'center' },
          {
            renderHeader: (h, params) => { return h('span', this.$t('result')) },
            maxWidth: 96,
            minWidth: 95,
            key: 'sync_result',
            align: 'center',
            render: (h, params) => {
              let type = params.row.sync_result
              switch (type) {
                case 0:
                  return h('span', { style: { color: '#25da30' } }, this.$t('NotInitiated'))
                case 1:
                  return h('span', { style: { color: '#19be6b' } }, this.$t('success'))
                case 2:
                  return h('span', { style: { color: '#ff0000' } }, this.$t('fail'))
              }
            }
          },
          { maxWidth: 107, minWidth: 107, tooltip: true, key: 'display_name', renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
          { maxWidth: 105, minWidth: 106, tooltip: true, key: 'game_type', renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
          { maxWidth: 100, minWidth: 100, key: 'popularity', align: 'center', renderHeader: (h, params) => { return h('span', this.$t('Popularity')) } },
          { maxWidth: 160, minWidth: 114, key: 'server_ip', renderHeader: (h, params) => { return h('span', this.$t('TargetServerAddress')) } },
          { key: 'src_dir', tooltip: true, maxWidth: 120, minWidth: 110, renderHeader: (h, params) => { return h('span', this.$t('SourcePath')) } },
          { key: 'dst_dir', maxWidth: 105, minWidth: 106, tooltip: true, renderHeader: (h, params) => { return h('span', this.$t('TargetPath')) } },
          { maxWidth: 200, minWidth: 90, tooltip: true, key: 'end_time', renderHeader: (h, params) => { return h('span', this.$t('EndTime')) } },
          { minWidth: 100, tooltip: true, key: 'error', renderHeader: (h, params) => { return h('span', this.$t('ErrorMessage')) } }
        ],
        tableData: [],
        pageinfo: {
          count: 0,
          page_index: 0
        },
        Pagelimit: 10
      }
    },
    created () {
      this.handleGetTableList(0, this.Pagelimit)
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
      handleGetGameByTypeName (value) {
        this.handleGetTableList(0, this.Pagelimit, value)
      },
      /**
       * 通过游戏类型查询游戏
       */
      handleGameType (value) {
        getAllCenterGameTypes().then(res => {
          res.data.forEach(item => {
            this.gameList.push(item)
          })
        })
      },
      /**
       * 根据游戏名首字母查询
       */
      ChangeValue (value) {
        this.handleGetTableList(0, this.Pagelimit, this.gameType, value)
      },
      /**
       * 获取游戏日志
       */
      handleGetTableList (offset, limit, gametypeid = '', letter = '') {
        let info = {
          offset: offset,
          limit: limit,
          pagetypeid: gametypeid === 0 ? '' : gametypeid,
          letter
        }
        getAllSyncGameLogs(info).then((resp) => {
          this.tableData = resp.data.data
          this.tableData.forEach(item => {
            item.end_time = this.formatTime(item.end_time)
          })
          this.pageinfo = resp.data.pageino
          this.pageinfo.page_index++
        }, () => {
          this.$Message.error(this.$t('RequestErrorPleaseTryAgainLater'))
        })
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
      handleTableResync (index) { // 重新同步
        resync(index.Id).then((res) => {
          this.handleCallBackVaild(res)
        }, () => {
          this.$Message.error(this.$t('RequestErrorPleaseTryAgainLater'))
        })
      },
      formatTime (item) {
        let date = new Date(item)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        month = month.toString()
        if (('' + month) && month.length < 2) {
          month = '0' + month
        }
        let day = date.getDate()
        let houters = date.getHours()
        let Minutes = date.getMinutes()
        Minutes = Minutes.toString()
        if (('' + Minutes) && Minutes.length < 2) {
          Minutes = '0' + Minutes
        }
        let Seconds = date.getSeconds()
        Seconds = Seconds.toString()
        if (('' + Seconds) && Seconds.length < 2) {
          Seconds = '0' + Seconds
        }
        return `${year}-${month}-${day} ${houters}:${Minutes}:${Seconds}`
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
  .container{
    display: flex;
    flex-direction: column;
  }
  .main{
    margin-top:20px;
  }
</style>

