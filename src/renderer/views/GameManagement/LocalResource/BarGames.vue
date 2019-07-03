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
          renderHeader: (h, params) => {
            return h('span', this.$t('Popularity'))
          }
        },
        {
          key: 'local_path',
          minWidth: 120,
          renderHeader: (h, params) => {
            return h('span', this.$t('ServerPath'))
          }
        },
        {
          key: 'run_exe',
          minWidth: 130,
          renderHeader: (h, params) => {
            return h('span', this.$t('executableFile'))
          }
        },
        {
          key: 'size',
          minWidth: 80,
          renderHeader: (h, params) => {
            return h('span', this.$t('Size'))
          }
        },
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('ServerSyncSet'))
          },
          key: 'is_auto_update',
          minWidth: 130,
          render: (h, params) => {
            switch (params.row.is_auto_update) {
              case 0:
                return h('span', this.$t('Disable'))
              case 1:
                return h('span', this.$t('Enable'))
            }
          }
        },
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('operation'))
          },
          key: 'operation',
          minWidth: 180,
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
    this.handgetAllGame(0, 10, 'Name')
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    handleGetTableList (e) {
      this.handgetAllGame((e - 1) * 10, 10, 'Name')
    },
    handgetAllGame (offset, limit, orderby) {
      getAllLocalGames(offset, limit, orderby)
        .then(e => {
          let data = e.data.data
          this.tableData = data.length === 0 ? [] : data
          this.pageInfo = e.data.pageino
        },
        () => {}
        )
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
      this.$router.push({ path: 'BarGameAddMain' })
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
    handleButtonSync (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
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
        this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
      } else {
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
        okText: this.$t('Confirm'),
        onOk: () => {
          deleteLocalGame(index.id).then(
            resp => {
              this.handgetAllGame(0, this.currlimit, 'Name')
            },
            () => {
              this.handgetAllGame(0, this.currlimit, 'Name')
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

