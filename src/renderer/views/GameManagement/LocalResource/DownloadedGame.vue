<template>
  <div>
    <div class="topItem">
      <Row>
        <i-col span="10">
          <Select v-model="optionVal" clearable :placeholder="$t('TypeName')"  class="topColumn" style="width:150px;"  @on-change="handleSelectChange" :not-found-text="this.$t('Nodata')">
            <Option v-for="item in gameList" :value="item.Id" :key="item.Name" >{{ item.Name }}</Option>
          </Select>
           <Input class="topColumn" search :enter-button="$t('Search')" :placeholder="$t('PleaseInputGameName')" clearable style="width: 200px;" />
        </i-col>
        <i-col span="2" offset="10">
          <Button type="primary" class="topColumn" @click="handleButtonSync">{{$t('Synchronize')}}</Button>
          <!-- <Button type="primary" class="topColumn" @click="handleButtonDelete">{{$t('Delete')}}</Button> -->
        </i-col>
      </Row>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" @on-row-dblclick="handleTableEdit" stripe :no-data-text="this.$t('Nodata')"></Table>
    <Row style="margin-top:10px; ">
      <i-col span="24"><Page :current="currentPage" :page-size="pageSize" :total="totalPageNumber" show-total style=" float:right;" @on-change="hanbleChangePage"/></i-col>
    </Row>
  </div>
</template>

<script>
  import { localMultiSync, getDownloadedGames, deleteLocalGame } from '@/api/localGame'
  // import { getDrivers } from '@/api/sync'
  export default {
    name: 'subType3-1',
    data () {
      return {
        optionVal: 0,
        searchVal: '',
        curroffset: 0,
        currlimit: 10,
        totalPageNumber: 0,
        pageSize: 10,
        currentPage: 1,
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        gameList: [],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          {
            renderHeader: (h, params) => { return h('span', this.$t('Status')) },
            key: 'State',
            minWidth: 120,
            render: (h, params) => {
              let type = params.row.State
              switch (type) {
                case 0:
                  return h('span', this.$t('NotUpdated'))
                case 1:
                  return h('span', { style: { color: '#008000' } }, this.$t('Updated'))
                default:
                  return '-'
              }
            }
          },
          { key: 'Name', minWidth: 110, renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
          {
            key: `TypeName`,
            minWidth: 110,
            renderHeader: (h, params) => { return h('span', this.$t('TypeName')) },
            render: (h, params) => {
              let type = params.row.UpdateMode
              switch (type) {
                case '':
                  return h('span', this.$t('OnlineGame'))
                case 1:
                  return h('span', this.$t('AutoUpdate'))
                default:
                  return '-'
              }
            }
          },
          {
            renderHeader: (h, params) => { return h('span', this.$t('UpdateMode')) },
            key: 'UpdateMode',
            minWidth: 120,
            render: (h, params) => {
              let type = params.row.UpdateMode
              switch (type) {
                case 0:
                  return h('span', this.$t('ManualUpdate'))
                case 1:
                  return h('span', this.$t('AutoUpdate'))
                default:
                  return '-'
              }
            }
          },
          { key: 'Popularity', minWidth: 100, renderHeader: (h, params) => { return h('span', this.$t('Popularity')) } },
          { key: 'Size', minWidth: 80, renderHeader: (h, params) => { return h('span', this.$t('Size')) } },
          { renderHeader: (h, params) => { return h('span', this.$t('ServerStoragePath')) },
            key: 'SavePath',
            tooltip: true,
            minWidth: 130
          },
          { key: 'ExePath', minWidth: 110, renderHeader: (h, params) => { return h('span', this.$t('ExecuteProgram')) } },
          { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            key: 'operation',
            minWidth: 180,
            fixed: 'right',
            render: (h, params) => {
              let a = h('Button', {
                props: { type: 'primary', size: 'small' },
                style: { 'margin-right': '10px' },
                on: { click: () => { this.handleTableEdit(params.row) } }
              }, this.$t('Edit'))
              let b = h('Button', {
                props: { type: 'error', size: 'small' },
                on: { click: () => { this.handleTableDelete(params.row) } }
              }, this.$t('Delete'))
              switch (params) {
                default:
                  return h('span', [a, b])
              }
            }
          }
        ],
        tableData: []
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
      // handleGetDrivers () {
      //   getDrivers().then((res) => {
      //     debugger
      //     if (res.data.Code === 0) {
      //       var arr = res.data.Data.TypeIds
      //       if (arr === null) {
      //         this.gameList = null // 全部游戏类型
      //       } else {
      //         this.gameList = arr
      //         // console.log('gameTypeList::' + JSON.stringify(this.gameTypeList))
      //       }
      //     } else {
      //       this.$Message.error(res.data.Msg)
      //     }
      //   }, () => {
      //     this.$Message.error(this.$t('RequestErrorPleaseTryAgainLater'))
      //   })
      // },
      handleSelectChange (index) {
        this.optionVal = index
      },
      handleButtonSearch () {
        if (this.optionVal === undefined) {
          this.optionVal = 0
        }
        this.handleGetTableList(this.curroffset, this.currlimit)
      },
      /**
       * 获取已下载游戏
      */
      handleGetTableList () {
        getDownloadedGames(0, 10, 'name').then((response) => {
          this.tableData = response.data.data.data
        }, () => {
          this.$Message.error(this.$t('RequestErrorPleaseTryAgainLater'))
        }).catch((e) => {
          this.$Notice.error({ desc: '' + e, duration: 0 })
        })
      },
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
          this.$Message.success(this.$t('RequestErrorPleaseTryAgainLater'))
        } else {
          this.$Message.error('操作失败：' + res.data.Msg)
        }
      },
      handleButtonSync (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          localMultiSync(this.getCheckboxVal).then((res) => {
            this.handleCallBackVaild(res)
          }, () => {
            this.$Message.error(this.$t('RequestErrorPleaseTryAgainLater'))
          })
        }
      },
      handleButtonDelete (val) {
        val = this.getCheckboxVal.length
        if (val === 0) {
          this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
        } else {
          this.$router.push({
            path: 'subtype3-delete',
            query: { ids: this.getCheckboxVal }
          })
        }
      },
      handleCheckBox (arr) {
        var data = arr
        var list = []
        for (var i in arr) {
          list.push(data[i].Id)
        }
        this.getCheckboxVal = list
        return this.getCheckboxVal
      },
      /**
       * 编辑游戏
      */
      handleTableEdit (index) {
        console.log(index)
        this.$router.push({
          path: 'DownloadedGameEdit',
          query: { data: index }
        })
      },
      handleTableFix (index) {
        this.getCheckboxVal = this.tableSelectVal.push(index.Id)
        // alert(this.getCheckboxVal)
        this.$router.push({
          path: 'subtype3-1-fix',
          query: { id: this.getCheckboxVal }
        })
      },
      handleTableDelete (index) {
        this.$Modal.confirm({
          title: this.$t('DeleteTip'),
          content: this.$t('DeleteCurrentData'),
          onOk: () => {
            deleteLocalGame(index.Id).then(
              resp => {
                this.handgetAllGame(0, this.currlimit, 'CenterPopularity')
              },
              (e) => {
                this.$Message.error(this.$t('NotDeleteCenterGame'))
              }
            )
          },
          onCancel: () => {
            this.$Modal.remove()
          }

        })
      }
    }
  }
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
  .ivu-tooltip {
    white-space: nowrap
  }
  .ivu-tooltip-rel{
    white-space: nowrap
  }
</style>

