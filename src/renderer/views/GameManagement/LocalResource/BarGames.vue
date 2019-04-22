<template>
  <div>
    <div class="topItem">
      <Input
        class="topColumn"
        v-model="searchVal"
        search
        enter-button="搜索"
        placeholder="请输入游戏首字母..."
        clearable
        style="width: 200px;"
      />
      <Button type="primary" class="topColumn" @click="handleButtonAdd">添加</Button>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonEdit">编辑</Button> -->
      <Button type="primary" class="topColumn" @click="handleButtonSync">同步</Button>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonMore">批量操作</Button> -->
      <Button type="primary" class="topColumn" @click="handleButtonDelete">修复</Button>
      <Button type="error" class="topColumn" @click="handleButtonDelete">删除</Button>
    </div>
    <!-- table -->
    <Table
      border
      ref="selection"
      :columns="tableColumns"
      :data="tableData"
      @on-selection-change="handleCheckBox"
    ></Table>
    <Row style="margin-top:10px; ">
      <i-col span="24">
        <Page
          :current="pageInfo.page_index"
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
  deleteLocalGame
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
          title: '图标',
          key: 'IconUrl',
          render: (h, params) => {
            return h('img', { attrs: { src: params.row.IconUrl }, style: { width: '40px', height: '40px', display: 'flex' } })
          }
        },
        { title: '游戏名称', key: 'DisplayName' },
        { title: '游戏热度', key: 'CenterPopularity' },
        { title: '服务器路径', key: 'LocalPath' },
        { title: '执行文件', key: 'RunExe' },
        { title: '客户机执行文件', key: 'Size' },
        {
          title: '服务器同步',
          key: 'IsEnableSync',
          render: (h, params) => {
            switch (params.row.IsEnableSync) {
              case 0:
                return h('span', '禁用')
              case 1:
                return h('span', '启用')
            }
          }
        },
        {
          title: '操作',
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
              '编辑'
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
              '删除'
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
          console.log(e.data.data)
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
    handleButtonAdd () {
      this.$router.push({ path: 'subtype3-2-add' })
      // val = this.getCheckboxVal.length
      // if (val === 0) {
      //   this.$Message.error('请至少选择列表中的一项')
      // } else {
      //   this.$router.push({
      //     path: 'subtype3-2-add',
      //     query: { id: this.getCheckboxVal }
      //   })
      // }
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

      console.log(this.getCheckboxVal)
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
        title: '删除提示',
        content: '确定嘛',
        cancelText: '取消',
        okText: '确定',
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

