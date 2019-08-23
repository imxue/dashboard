<template>
  <div>
    <div class="topItem">
      <Row>
        <i-col span="10">
          <Select v-model="model1" clearable :placeholder="$t('TypeName')"  class="topColumn" style="width:150px;"  @on-change="handleSelectChange" :not-found-text="this.$t('Nodata')">
            <Option v-for="item in gameList" :value="item.id" :key="item.value">{{ $t(item.dispaly_name) }}</Option>
          </Select>
            <AutoComplete  icon="ios-search" class="topColumn"  :placeholder="$t('PleaseInputGameName')" style="width: 200px;" v-model="GameName" @on-change='ChangeValue' />
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
      <i-col span="24"><Page :current="pageinfo.page_index + 1" :page-size="Pagelimit" :total="pageinfo.count" show-total style=" float:right;" @on-change="hanbleChangePage"/></i-col>
    </Row>
  </div>
</template>

<script>
  import { localMultiSync, getDownloadedGames, deleteGame } from '@/api/localGame'
  import { getAllCenterGameTypes } from '@/api/game'
  import { bytesToSize2 } from '../../../utils/index'
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
            maxWidth: 110,
            minWidth: 110,
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
            renderHeader: (h, params) => { return h('span', this.$t('TypeName')) }
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
          { key: 'Size',
            minWidth: 80,
            renderHeader: (h, params) => { return h('span', this.$t('Size')) },
            render: (h, params) => {
              return h('span', bytesToSize2(params.row.Size))
            }
          },
          { renderHeader: (h, params) => { return h('span', this.$t('ServerStoragePath')) },
            key: 'LocalPath',
            tooltip: true,
            minWidth: 130
          },
          { key: 'ExePath', minWidth: 110, renderHeader: (h, params) => { return h('span', this.$t('ExecuteProgram')) } },
          { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            key: 'operation',
            minWidth: 190,
            render: (h, params) => {
              // let a = h('Button', {
              //   props: { type: 'primary', size: 'small' },
              //   style: { 'margin-right': '10px' },
              //   on: { click: () => { this.handleTableEdit(params.row) } }
              // }, this.$t('Edit'))
              // let b = h('Button', {
              //   props: { type: 'error', size: 'small' },
              //   on: { click: () => { this.handleTableDelete(params.row) } }
              // }, this.$t('Delete'))
              let a = h('Button',
                { style: { marginRight: '5px', width: '70px' },
                  props: { type: 'primary', size: 'small' },
                  on: { click: () => { this.handleTableEdit(params.row) } }
                }, this.$t('Edit'))
              let b = h('Button',
                { style: { marginRight: '5px', width: '70px' },
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
          this.gameList = resp.data
        } catch (error) {
          console.log(this.error)
        }
      },
      handleSelectChange (index) {
        this.optionVal = index
      },
      handleButtonSearch () {
        if (this.optionVal === undefined) {
          this.optionVal = 0
        }
        this.handleGetTableList(this.curroffset, this.Pagelimit)
      },
      /**
       * 获取已下载游戏
      */
      handleGetTableList () {
        getDownloadedGames({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: '' }).then((response) => {
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
        this.handleGetTableList(num, this.Pagelimit)
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
            deleteGame(index.Id).then(
              resp => {
                this.$Message.success(this.$t(`${resp.data}`))
                this.handgetAllGame(0, this.Pagelimit, 'CenterPopularity')
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

