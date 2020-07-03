<template>
  <div>
    <div class="topItem">
      <Row>
        <i-col span="24">
          <Select v-model="model1" clearable :placeholder="$t('TypeName')"  class="topColumn" style="width:160px;"  @on-change="handleSelectChange" :not-found-text="this.$t('Nodata')">
            <Option v-for="item in gameList" :value="item.id" :key="item.value">{{ $t(item.dispaly_name) }}</Option>
          </Select>
            <AutoComplete  icon="ios-search" class="topColumn"  :placeholder="$t('PleaseInputGameName')" style="width: 200px;" v-model="GameName" @on-change='ChangeValue' />
          <Button type="primary" class="topColumn" @click="handleButtonSync">{{$t('SyncToServer')}}</Button>
        </i-col>
        <i-col span="2" >
          <!-- <Button type="primary" class="topColumn" @click="handleButtonDelete">{{$t('Delete')}}</Button> -->
        </i-col>
      </Row>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" @on-row-dblclick="handleTableEdit" stripe :no-data-text="this.$t('Nodata')"></Table>
    <Row style="margin-top:10px;">
      <i-col span="24">
        <Page :current="pageinfo.page_index + 1" :page-size="Pagelimit" :total="pageinfo.count" show-total style=" float:right;" @on-change="hanbleChangePage"/></i-col>
    </Row>
  </div>
</template>

<script>
  import { getDownloadedGames, deleteGame, syncToServers, repairGame } from '@/api/localGame'
  import { getAllCenterGameTypes } from '@/api/game'
  import { bytesToSize3 } from '../../../utils/index'
  export default {
    name: 'subType3-1',
    data () {
      return {
        model1: '',
        optionVal: 0,
        GameName: '',
        searchVal: '',
        curroffset: 0,
        Pagelimit: 10,
        pageinfo: '',
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        gameList: [],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          {
            renderHeader: (h, params) => { return h('span', this.$t('Status')) },
            key: 'State',
            render: (h, params) => {
              let type = params.row.State
              switch (type) {
                case 0:
                  // return h('span', this.$t('NotUpdated'))
                  return h('span', '存在更新')
                case 1:
                  // return h('span', { style: { color: '#008000' } }, this.$t('Updated'))
                  return h('span', '正常')
                default:
                  return '-'
              }
            }
          },
          { key: 'DisplayName', renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
          {
            key: `TypeName`,
            renderHeader: (h, params) => { return h('span', this.$t('TypeName')) }
          },
          {
            renderHeader: (h, params) => { return h('span', this.$t('UpdateMode')) },
            key: 'UpdateMode',
            width: 120,
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
          { key: 'Popularity', renderHeader: (h, params) => { return h('span', this.$t('Popularity')) } },
          { key: 'Size',
            renderHeader: (h, params) => { return h('span', this.$t('Size')) },
            render: (h, params) => {
              return h('span', bytesToSize3(params.row.Size))
            }
          },
          { renderHeader: (h, params) => { return h('span', this.$t('ServerStoragePath')) },
            key: 'LocalPath',
            minWidth: 32,
            tooltip: true
          },
          { key: 'ExePath', tooltip: true, renderHeader: (h, params) => { return h('span', this.$t('ExecuteProgram')) } },
          { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            key: 'operation',
            minWidth: 100,
            render: (h, params) => {
              return h('div', [
                h('Button', { style: { marginRight: '5px', width: '70px' },
                  props: { type: 'info', disabled: params.row.State === 1 },
                  on: { click: () => { this.handleTableRapir(params.row) } }
                }, '修复'),
                h('Button', { style: { marginRight: '5px', width: '70px' },
                  props: { type: 'error' },
                  on: { click: () => { this.handleTableDelete(params.row) } }
                }, '删除')
              ])
            }
          }
        ],
        tableData: []
      }
    },
    created () {
      this.handleGetTableList({ offset: 0, limit: this.Pagelimit, orderby: 'Name' })
      this.handleGetGameType()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      /**
     *  搜索游戏
     *
    */
      ChangeValue (data) {
        this.handleGetTableList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: data })
      },
      /**
     * 获取游戏类型
     */
      async handleGetGameType () {
        try {
          let resp = await getAllCenterGameTypes()
          this.gameList = [
            { id: 0, dispaly_name: this.$t('AllGame') }
          ]
          if (resp.data.lenght !== 0) {
            resp.data.forEach(item => {
              this.gameList.push(item)
            })
          }
          this.model1 = this.gameList[0].id
        } catch (error) {
          console.log(this.error)
        }
      },
      handleSelectChange (id) {
        if (id === 0) {
          this.handleGetTableList({ offset: 0, limit: this.Pagelimit, orderby: 'Name' })
        } else {
          this.handleGetTableList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gametypeid: id })
        }
      },
      async handleTableRapir (row) {
        try {
          await repairGame(row.Id)
          this.$Message.success(this.$t('修复成功'))
        } catch (error) {
          this.$Message.error(error)
        }
      },
      /**
       * 获取已下载游戏
      */
      handleGetTableList (obj) {
        getDownloadedGames(obj).then((response) => {
          this.tableData = response.data.data
          this.pageinfo = response.data.pageino
        }, () => {
          this.notifyUserOfError('RequestErrorPleaseTryAgainLater')
        }).catch((e) => {
          this.notifyUserOfDiskError(36873)
        })
      },
      hanbleChangePage (num) {
        if (num === 1) {
          num = 0
        } else {
          num = (this.Pagelimit * num) - this.Pagelimit
        }
        this.handleGetTableList({ offset: num, limit: this.Pagelimit, orderby: '' })
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
          this.getCheckboxVal.forEach(item => {
            syncToServers(item).then((res) => {
              this.$Message.success(this.$t('success'))
            }, () => {
              this.$Message.error(this.$t('RequestErrorPleaseTryAgainLater'))
            }).finally(() => {
              this.handleGetTableList()
            })
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
          loading: true,
          onOk: () => {
            deleteGame(index.Id).then(
              resp => {
                this.$Message.success(this.$t(`${resp.data}`))
                // this.handgetAllGame(0, this.Pagelimit, 'CenterPopularity')
              },
              (e) => {
                this.$Message.error(this.$t('NotDeleteCenterGame'))
              }
            ).finally(() => {
              this.handleGetTableList({ offset: 0, limit: this.Pagelimit, orderby: 'Name' })
              this.$Modal.remove()
            })
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

