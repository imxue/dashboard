<template>
  <div>
    <Modal v-model="DownloadGameUp" draggable scrollable title="下载游戏" footer-hide>
        <Form ref='Dg'  :model='Dg' label-position="left" :label-width="80" style="width: 300px">
          <FormItem label="请选择盘符">
            <Select v-model="Dg.data" placeholder="请选择盘符">
              <Option v-for='item in disk' v-bind:value='item' v-bind:key='item'>{{item}}</Option>
            </Select>
            </FormItem> 
              <FormItem>
            <Button type="primary" @click="handleSubmit('Dg')">下载游戏</Button>
            <Button @click="handleReset()" style="margin-left: 8px">取消</Button>
        </FormItem>
        </Form>
    </Modal>
    <div class="topItem">
      <Select v-model="model1"  class="topColumn" style="width:150px;">
        <Option v-for="item in gameList" :value="item.value" :key="item.value" placeholder="全部游戏类型">{{ item.label }}</Option>
      </Select>
      <Input class="topColumn" search enter-button="搜索" placeholder="请输入游戏首字母..." clearable style="width: 200px;" />
      <Button type="primary" class="topColumn" @click="handleButtonDW">下载</Button>
      <Button type="primary" class="topColumn" @click="handleButtonFixGame">修复</Button>
      <Button type="primary" class="topColumn" @click="handleButtonRemove">本地移除</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox"></Table>
    <Row style="margin-top:10px; ">
      <i-col span="4">资源：{{this.pageInfo.count}} &nbsp;&nbsp;&nbsp;&nbsp;已下载：{{DownLoadCount}}</i-col>
      <i-col span="20"><Page :total="this.pageInfo.count" :current="pageInfo.page_index" :page-size="2" @on-change="handleGetTableList" style=" float:right;"/></i-col>
    </Row>
  </div>
</template>

<script>
import { getAllGame, getLogicalDrives, downloadGame } from '@/api/localGame'
export default {
  name: 'allGame',
  data () {
    return {
      pageCount: '',
      disk: '',
      pageInfo: '',
      DownLoadCount: '0', // 已下载的数
      Dg: {
        data: ''
      },
      deleteid: '',
      DownloadGameUp: false,
      model1: '',
      getCheckboxVal: [], // 勾选复选框值
      tableSelectVal: [],
      gameList: [
        { Id: 0, value: '热门游戏', label: '热门游戏' },
        { Id: 1, value: '网络游戏', label: '网络游戏' },
        { Id: 2, value: '单机游戏', label: '单机游戏' },
        { Id: 3, value: '休闲游戏', label: '休闲游戏' },
        { Id: 4, value: '辅助游戏', label: '辅助游戏' }
      ],
      tableColumns: [
        { type: 'selection', width: 60, align: 'center' },
        {
          title: '当前状态',
          key: 'State',
          render: (h, params) => {
            let type = params.row.State
            switch (type) {
              case 0:
                return h('span', '未下载')
              case 1:
                return h('span', { style: { color: '#999999' } }, '待更新')
              case 2:
                return h('span', { style: { color: '#008000' } }, '更新中')
              case 3:
                return h('span', { style: { color: '#008000' } }, '最新版本')
              default:
                return '-'
            }
          }
        },
        { title: '游戏类型', key: 'TypeName' },
        { title: '游戏名称', key: 'Name' },
        { title: '当前热度', key: 'Popularity' },
        { title: '游戏大小', key: 'Size' },
        { title: '中心游戏版本', key: 'CenterVersion' },
        { title: '本地游戏版本', key: 'LocalVersion' },
        { title: '操作',
          key: 'operation',
          render: (h, params) => {
            let type = params.row.State
            let a = h('Button',
              { style: { color: '#2d8cf0', marginRight: '10px' },
                on: { click: () => { this.handleFixGame(params.row) } }
              }, '修复游戏')
            let b = h('Button', {
              style: { color: '#2d8cf0' },
              on: { click: () => { this.handleRemove(params.row) } }
            }, '本地移除')
            let c = h('Button', {
              style: { color: '#2d8cf0', textDecoration: 'underline' },
              on: { click: () => { this.handleDownGame(params.row.Id) } }
            }, '下载游戏')
            switch (type) {
              case 0:
                return h('div', [c])
              case 1:
                return h('span', [a, b])
              case 2:
                return h('span', [b])
              default:
                return '-'
            }
          }
        }
      ],
      tableData: []
    }
  },
  created () {
    this.handgetAllGame(0, 2, 'Name')
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    /**
     * 获取全部游戏
     */
    handgetAllGame (offset, limit, orderby) {
      getAllGame(offset, limit, orderby).then(response => {
        if (response.data.data instanceof Array) {
          this.tableData = response.data.data
          this.pageInfo = response.data.pageino
          this.DownLoadCount = this.tableData.filter(item => { return item.State !== 0 }).length
        }
      }, (e) => {
        this.$Notice.error({ desc: '' + e, duration: 0 })
      }).catch((e) => {
        this.$Notice.error({ desc: '' + e, duration: 0 })
      })
    },
    handleGetTableList (e) {
      this.handgetAllGame((e - 1) * 2, 2, 'Name')
    },
    handleButtonDW (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error('请至少选择列表中的一项')
      } else {
        this.$router.push({
          path: 'subtype1-download',
          query: { id: this.getCheckboxVal }
        })
      }
    },
    /**
     * 下载游戏
    */
    handleSubmit () {
      let info = { CenterGameId: this.deleteid, DiskSymbol: this.Dg.data + '\\' }
      downloadGame(info.CenterGameId, info.DiskSymbol).then(() => {
        this.DownloadGameUp = false
        getAllGame()
      }).catch((e) => {
        this.$Notice.error({ desc: '' + e, duration: 0 })
      })
    },
    /**
     * 下载游戏弹窗
    */
    handleDownGame (id) {
      this.DownloadGameUp = true
      this.deleteid = id
      getLogicalDrives().then(response => {
        this.disk = response.data
      }).catch(() => { this.$Message.info('获取磁盘信息错误') })
    },
    handleButtonFixGame (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error('请至少选择列表中的一项')
      } else {
        this.$Message.info('修复中，请耐心等待……')
      }
    },
    handleButtonRemove (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error('请至少选择列表中的一项')
      } else {
        this.$router.push({
          path: 'subtype1-remove',
          query: { id: this.getCheckboxVal }
        })
      }
    },
    test () {
      let matched = this.$route.matched.filter(item => item.name)
      console.log(matched)
    },
    handleReset () {
      this.DownloadGameUp = false
    },
    handleCheckBox (arr) {
      var data = arr
      var list = []
      for (var i in arr) {
        list.push(data[i].id)
      }
      this.getCheckboxVal = list.join(',')
      console.log(this.getCheckboxVal)
      return this.getCheckboxVal
    },
    handleTableDw (index) {
      this.getCheckboxVal = this.tableSelectVal.push(index.id)
      this.$router.push({
        path: 'subtype1-download',
        query: { id: this.getCheckboxVal }
      })
    },
    handleFixGame (index) {
      this.getCheckboxVal = this.tableSelectVal.push(index.id)
      this.$Message.info('id:' + this.getCheckboxVal + '修复中，请耐心等待……')
    },
    handleRemove (index) {
      this.getCheckboxVal = this.tableSelectVal.push(index.id)
      this.$router.push({
        path: 'subtype1-remove',
        query: { id: this.getCheckboxVal }
      })
    }
  }
}
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>

