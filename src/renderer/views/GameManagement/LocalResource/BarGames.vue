<template>
  <div>
    <div class="topItem">
      <AutoComplete  icon="ios-search" class="topColumn"  :placeholder="$t('PleaseInputGameName')" style="width: 200px;" v-model="GameName" @on-change='handleDataByName' />
      <Button type="primary" class="topColumn" @click="handleButtonAdd">{{$t("Add")}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonSync">{{$t("Synchronize")}}</Button>
      <Button type="error" class="topColumn" @click="handleButtonDelete">{{$t("Delete")}}</Button>
    </div>
    <!-- table -->
    <Table
      border
      ref="selection"
      :columns="tableColumns"
      :data="tableData"
      @on-selection-change="handleCheckBox"
      @on-row-dblclick="handleTableEdit"
      stripe
    ></Table>
    <Row style="margin-top:10px; ">
      <i-col span="24">
        <Page
          :current="pageInfo.page_index + 1"
          :page-size="Pagelimit"
          :total="this.pageInfo.count"
          show-total
          style=" float:right;"
          @on-change="handleGetTableList"
        />
      </i-col>
    </Row>
  </div>
</template>

<script>
import {
  syncToServers,
  getAllLocalGames,
  deleteLocalGame,
  repairGame
} from '@/api/localGame'
import { bytesToSize3 } from '../../../utils/index'
export default {
  name: 'subType3-2',
  data () {
    return {
      GameName: '',
      searchVal: '',
      curroffset: 0,
      Pagelimit: 10,
      pageInfo: '',
      pageSize: 10, // 每页条数
      currentPage: 1,
      getCheckboxVal: [], // 勾选复选框值
      tableSelectVal: [],
      getCheckboxIds: [], // 勾选复选框值ids
      tableColumns: [
        { type: 'selection', width: 60, align: 'center' },
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('Icon'))
          },
          key: 'icon_url',
          minWidth: 120,
          render: (h, params) => {
            if (!params.row.icon_url) {
              return h('span', 'unused')
            }
            return h('img', {
              attrs: { src: params.row.icon_url },
              style: { width: '40px', height: '40px', display: 'flex' }
            })
          }
        },
        {
          key: 'display_name',
          minWidth: 120,
          renderHeader: (h, params) => {
            return h('span', this.$t('gameName'))
          }
        },
        {
          key: 'center_popularity',
          minWidth: 100,
          tooltip: true,
          renderHeader: (h, params) => {
            return h('span', this.$t('Popularity'))
          }
        },
        {
          key: 'local_path',
          minWidth: 120,
          tooltip: true,
          renderHeader: (h, params) => {
            return h('span', this.$t('ServerPath'))
          }
        },
        {
          key: 'run_exe',
          minWidth: 130,
          tooltip: true,
          renderHeader: (h, params) => {
            return h('span', this.$t('executableFile'))
          }
        },
        {
          key: 'size',
          minWidth: 80,
          renderHeader: (h, params) => {
            return h('span', this.$t('Size'))
          },
          render: (h, params) => {
            return h('span', bytesToSize3(params.row.size))
          }
        },
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('ServerSyncSet'))
          },
          key: 'is_enable_sync',
          minWidth: 130,
          render: (h, params) => {
            switch (params.row.is_enable_sync) {
              case 0:
                return h('span', this.$t('Enable'))
              case 1:
                return h('span', this.$t('Disable'))
            }
          }
        },
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('operation'))
          },
          key: 'operation',
          minWidth: 190,
          render: (h, params) => {
            let a = h('Button',
              { style: { marginRight: '5px', width: '70px' },
                props: { type: 'primary' },
                on: { click: () => { this.handleTableEdit(params.row) } }
              }, this.$t('Edit'))
            let b = h('Button',
              { style: { marginRight: '5px', width: '70px' },
                props: { type: 'error' },
                on: { click: () => { this.handleTableDelete(params.row) } }
              }, this.$t('Delete'))
            switch (params) {
              default:
                return h('span', [a, b])
            }
          }
        }
      ],
      tableData: [],
      formItem: {
        input: ''
      }
    }
  },
  created () {
    this.handgetAllGame(0, this.Pagelimit, 'Name', '')
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
    handleDataByName (data) {
      this.handgetAllGame(0, this.Pagelimit, 'Name', data)
    },
    handleGetTableList (e) {
      this.handgetAllGame((e - 1) * this.Pagelimit, this.Pagelimit, 'Name', '')
    },
    handgetAllGame (offset, limit, orderby, name) {
      getAllLocalGames(offset, limit, orderby, name)
        .then(e => {
          let data = e.data.data
          this.tableData = data.length === 0 ? [] : data
          this.pageInfo = e.data.pageino
        },
        (response) => {
          this.$Message.info({
            content: this.$t(response.data.error),
            closable: true
          })
        })
        .catch(() => {
          this.notifyUserOfDiskError(36873)
        })
    },
    handleCallBackVaild (res) {
      var code = res.data.Code
      if (code === 0 || res.data.state === 'OK') {
        this.$Message.success('操作成功')
      } else {
        this.$Message.error('操作失败：' + res.data.Msg)
      }
    },
    /*
    添加游戏
    */
    handleButtonAdd () {
      this.$router.push({ path: 'BarGameAdd' })
    },
    handleButtonEdit (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
      } else {
        this.$router.push({
          path: 'subtype3-2-edit',
          query: { id: this.getCheckboxVal, type: 'multiEdit' }
        })
      }
    },
    /**
     * 游戏同步任务
     */
    handleButtonSync () {
      let val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
      } else {
        let result = this.getCheckboxVal.map(item => { return item.id }).join(',')
        syncToServers(result).then(
          res => {
            this.$Message.success(this.$t('success'))
            this.handgetAllGame(0, this.Pagelimit, 'Name', '')
          },
          (error) => {
            this.$Message.error(error.data.error)
          }
        )
      }
    },
    handleButtonDelete (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
      } else {
        this.$Modal.confirm({
          title: this.$t('DeleteTip'),
          content: this.$t('DeleteCurrentData'),
          cancelText: this.$t('cancelText'),
          okText: this.$t('Confirm'),
          onOk: () => {
            this.getCheckboxVal.forEach(item => {
              deleteLocalGame(item.id).then(
                resp => {
                  this.handgetAllGame(0, this.Pagelimit, 'Name', '')
                },
                () => {
                  this.handgetAllGame(0, this.Pagelimit, 'Name', '')
                }
              )
            })
          },
          onCancel: () => {
            this.$Modal.remove()
          }
        })
      }
    },
    /*
      获取table中的值
      */
    handleCheckBox (arr) {
      this.getCheckboxVal = arr
      return this.getCheckboxVal
    },

    /**
     * 编辑游戏
     */
    handleTableEdit (data) {
      this.$router.push({
        path: 'BarGamesEdit',
        query: { data: data, type: 'edit' }
      })
    },
    /**
     * 删除游戏
     */
    handleTableDelete (index) {
      this.$Modal.confirm({
        title: this.$t('DeleteTip'),
        content: this.$t('DeleteCurrentData'),
        cancelText: this.$t('cancelText'),
        okText: this.$t('Confirm'),
        onOk: () => {
          deleteLocalGame(index.id).then(
            resp => {
              this.handgetAllGame(0, this.Pagelimit, 'Name', '')
            },
            () => {
              this.handgetAllGame(0, this.Pagelimit, 'Name', '')
            }
          )
        },
        onCancel: () => {
          this.$Modal.remove()
        }
      })
    },
    /**
     * 修复游戏
     */
    HandleRepairGame (id) {
      if (this.getCheckboxVal.length !== 0) {
        // repairGame(this.getCheckboxVal[0].Id).then((e) => {
        //   console.log(e)
        // })
        repairGame('02a6997c612f418790538f0ba8d70f48').then(e => {
          this.$Message.success(e.data)
        })
      } else {
        this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
      }
    }
  }
}
</script>

<style scoped>
.topItem {
  height: 60px;
}
.topColumn {
  float: left;
  margin-right: 10px;
}
.ivu-input-icon {
  right: 55px;
}
</style>

