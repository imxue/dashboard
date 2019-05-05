<template>
  <div>
    <div class="topItem">
      <Input
        class="topColumn"
        v-model="searchVal"
        search
        :enter-button="$t('Search')"
        :placeholder="this.$t('PleaseInputGameName')"
        clearable
        style="width: 200px;"
      />
      <Button type="primary" class="topColumn" @click="handleButtonAdd">{{$t("Add")}}</Button>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonEdit">编辑</Button> -->
      <Button type="primary" class="topColumn" @click="handleButtonSync">{{$t("Synchronize")}}</Button>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonMore">批量操作</Button> -->
      <Button type="primary" class="topColumn" @click="HandleRepairGame">{{$t("repair")}}</Button>
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
      :no-data-text="this.$t('Nodata')"
    ></Table>
    <Row style="margin-top:10px; ">
      <i-col span="24">
        <Page
          :current="pageInfo.page_size"
          :page-size="10"
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
  netbarMultiSync,
  getAllLocalGames,
  deleteLocalGame,
  repairGame
} from '@/api/localGame'

export default {
  name: 'subType3-2',
  data () {
    return {
      searchVal: '',
      curroffset: 0,
      currlimit: 10,
      pageInfo: '',
      pageSize: 10, // 每页条数
      currentPage: 1,
      getCheckboxVal: [], // 勾选复选框值
      tableSelectVal: [],
      getCheckboxIds: [], // 勾选复选框值ids
      tableColumns: [
        { type: 'selection', width: 60, align: 'center' },
        {
          renderHeader: (h, params) => { return h('span', this.$t('Icon')) },
          key: 'IconUrl',
          render: (h, params) => {
            if (!params.row.IconUrl) { return h('span', 'unused') }
            return h('img', { attrs: { src: params.row.IconUrl }, style: { width: '40px', height: '40px', display: 'flex' } })
          }
        },
        { key: 'DisplayName', renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
        { key: 'CenterPopularity', renderHeader: (h, params) => { return h('span', this.$t('Popularity')) } },
        { key: 'LocalPath', renderHeader: (h, params) => { return h('span', this.$t('ServerPath')) } },
        { key: 'RunExe', renderHeader: (h, params) => { return h('span', this.$t('executableFile')) } },
        { key: 'Size', renderHeader: (h, params) => { return h('span', this.$t('Size')) } },
        {
          renderHeader: (h, params) => { return h('span', this.$t('ServerSyncSet')) },
          key: 'IsEnableSync',
          render: (h, params) => {
            switch (params.row.IsEnableSync) {
              case 0:
                return h('span', this.$t('Disable'))
              case 1:
                return h('span', this.$t('Enable'))
            }
          }
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('operation')) },
          key: 'operation',
          render: (h, params) => {
            let a = h(
              'Button',
              {
                props: { type: 'primary', size: 'small' },
                style: { marginRight: '10px' },
                on: {
                  click: () => {
                    this.handleTableEdit(params.row)
                  }
                }
              },
              this.$t('Edit')
            )
            let b = h(
              'Button',
              {
                props: { type: 'error', size: 'small' },
                on: {
                  click: () => {
                    this.handleTableDelete(params.row)
                  }
                }
              },
              this.$t('Delete')
            )
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
    this.handgetAllGame(0, 10, 'CenterPopularity')
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    handleGetTableList (e) {
      this.handgetAllGame((e - 1) * 10, 10, 'CenterPopularity')
    },
    handgetAllGame (offset, limit, orderby) {
      getAllLocalGames(offset, limit, orderby)
        .then(e => {
          this.tableData = e.data.data
          this.pageInfo = e.data.pageino
          console.log(this.pageInfo)
        })
        .catch(error => {
          this.$Notice.open({
            title: '错误',
            desc: '' + error,
            duration: 0
          })
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
      this.$router.push({ path: 'subtype3-2-add' })
    },
    handleButtonEdit (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error('请至少选择列表中的一项')
      } else {
        this.$router.push({
          path: 'subtype3-2-edit',
          query: { id: this.getCheckboxVal, type: 'multiEdit' }
        })
      }
    },
    handleButtonSync (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error('请至少选择列表中的一项')
      } else {
        netbarMultiSync(this.getCheckboxVal).then(
          res => {
            this.handleCallBackVaild(res)
          },
          () => {
            this.$Message.error('请求出错，请稍后再试')
          }
        )
      }
    },
    handleButtonDelete (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error('请至少选择列表中的一项')
      } else {
        // this.handleGetIds()
        this.$router.push({
          path: 'subtype3-delete',
          query: { ids: this.getCheckboxVal }
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
        path: 'BarGamesEditMain',
        query: { data: data, type: 'edit' }
      })
    },
    handleTableFix (index) {
      this.getCheckboxVal = this.tableSelectVal.push(index.id)
      this.$router.push({
        path: 'subtype3-2-fix',
        query: { id: this.getCheckboxVal }
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
        okText: this.$t('confirm'),
        onOk: () => {
          deleteLocalGame(index.Id).then(
            resp => {
              this.handgetAllGame(0, this.currlimit, 'CenterPopularity')
            },
            () => {
              this.handgetAllGame(0, this.currlimit, 'CenterPopularity')
              this.$Message.error('请求出错，请稍后再试')
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
        repairGame('02a6997c612f418790538f0ba8d70f48').then((e) => {
          this.$Message.success(e.data)
        })
      } else {
        this.$Message.error('请至少选择列表中的一项')
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

