<template>
  <div>
    <div class="topItem">
      <Select v-model="model1"  class="topColumn" style="width:150px;" :placeholder="$t('pleaseInput')" @on-change="serchByGameType">
        <Option v-for="item in gameList" :value="item.id" :key="item.id" >{{ item.dispaly_name }}</Option>
      </Select>
        <AutoComplete  icon="ios-search" class="topColumn"  :placeholder="$t('PleaseInputGameName')" style="width: 200px;" v-model="value1" :data="GameName" @on-change='ChangeValue'  />
      <Button type="primary" class="topColumn" @click="handleDownGame">{{$t("Download")}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonFixGame">{{$t("repair")}}</Button>
      <Button type="error" class="topColumn" @click="handleButtonRemove">{{$t("LocalRemoval")}}</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData"  @on-selection-change="handleCheckBox" stripe :no-data-text="this.$t('Nodata')"></Table>
    <Row style="margin-top:10px; ">
      <!-- <Col span="6">{{$t('Resource')}}：{{this.pageInfo.count}} {{$t('Downloaded')}}：{{DownLoadCount}}</Col> -->
      <Col span="24"><Page show-total :total="this.pageInfo.count" :current="pageInfo.page_index + 1 " :page-size="Pagelimit" @on-change="handleGetTableList" style=" float:right;"/></Col>
    </Row>
    <Modal v-model="DownloadGameUp" draggable scrollable :title="$t('DownloadGames')" footer-hide>
        <Form ref='Dg'  :model='Dg' label-position="left" :label-width="80" style="width: 300px">
          <FormItem :label="$t('DiskSymbol')" label-position="left">
            <Select v-model="Dg.data" :placeholder="$t('Search')" >
              <Option v-for='item in disk' v-bind:value='item.DeviceID' v-bind:key='item.DeviceID'>{{item.DeviceID}} \ {{$t('AvailableSpace')}} {{item.free_space}}</Option>
            </Select>
            </FormItem> 
              <FormItem>
            <Button type="primary" :loading="loadBtn" @click="handleSubmit('Dg')">{{$t('DownloadGames')}}</Button>
            <Button @click="DownloadGameUp = false" style="margin-left: 8px">{{$t('cancelText')}}</Button>
        </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
import { getTodayUpdateGames, repairGame, deleteGame, downloadGame, getLogicalDrives } from '@/api/localGame'
import { getAllCenterGameTypes } from '@/api/game'
import { bytesToSize2 } from '../../../utils/index'
export default {
  name: 'subType1-1',
  data () {
    return {
      modal1: false,
      pageInfo: '',
      Pagelimit: 10, // 每页显示数
      model1: '',
      DownloadGameUp: false,
      getCheckboxVal: [], // 勾选复选框值
      tableSelectVal: [],
      DownLoadCount: '',
      GameName: [], // 游戏名提示
      value1: '',
      Dg: {
        data: ''
      },
      disk: '',
      loadBtn: false,
      Downid: '', // 下载游戏Id
      temp: [],
      tempx: [],
      gameList: [],
      tableColumns: [
        { type: 'selection', width: 60, align: 'center' },
        {
          renderHeader: (h, params) => { return h('span', this.$t('CurrentStatus')) },
          key: 'State',
          minWidth: 110,
          maxWidth: 120,
          render: (h, params) => {
            let type = params.row.State
            switch (type) {
              case 0:
                return h('span', this.$t('Undownload'))
              case 1:
                return h('span', { style: { color: '#999999' } }, this.$t('PendingUpgrade'))
              case 2:
                return h('span', { style: { color: '#008000' } }, this.$t('Updating'))
              case 3:
                return h('span', { style: { color: '#008000' } }, this.$t('LatestVersion'))
              default:
                return '-'
            }
          }
        },
        { title: '游戏类型', minWidth: 120, key: 'TypeName', renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
        { title: '游戏名称', minWidth: 120, key: 'Name', renderHeader: (h, params) => { return h('span', this.$t('gameName')) } },
        { title: '当前热度', minWidth: 120, key: 'Popularity', renderHeader: (h, params) => { return h('span', this.$t('Popularity')) } },
        { title: '游戏大小',
          minWidth: 120,
          key: 'Size',
          renderHeader: (h, params) => { return h('span', this.$t('Size')) },
          render: (h, params) => {
            return h('span', bytesToSize2(params.row.Size))
          } },
        { title: '中心游戏版本', minWidth: 130, key: 'CenterVersion', renderHeader: (h, params) => { return h('span', this.$t('CenterVersion')) } },
        { title: '本地游戏版本', minWidth: 130, key: 'LocalVersion', renderHeader: (h, params) => { return h('span', this.$t('LocalVersion')) } },
        { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
          key: 'operation',
          minWidth: 190,
          render: (h, params) => {
            let type = params.row.State
            let a = h('Button',
              { style: { marginRight: '5px', width: '70px' },
                props: { type: 'primary', size: 'small' },
                on: { click: () => { this.handleFixGame(params.row) } }
              }, this.$t('RepairGame'))
            let b = h('Button', {
              style: { width: '70px' },
              props: { type: 'error', size: 'small' },
              on: { click: () => { this.handleRemove(params.row) } }
            }, this.$t('LocalRemoval'))
            let c = h('Button', {
              props: { type: 'primary', size: 'small' },
              style: { width: '70px' },
              on: { click: () => { this.handleDownGame(params.row.Id) } }
            }, this.$t('DownloadGames'))
            switch (type) {
              case 0:
                return h('div', [c])
              case 1:
                return h('span', [a])
              case 2:
                return h('span', [b])
              case 3:
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
    this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: '' })
    this.handleGetGameType()
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    async serchByGameType (type) {
      if (type === 0) {
        this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name' })
      } else {
        this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gametypeid: type })
      }
    },
    /**
     * 获取游戏类型
     */
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
    async handleGetGameList (obj) {
      let pageList = { gameList: [], pageInfo: [] }
      try {
        let resp = await getTodayUpdateGames(obj)
        this.tableData = resp.data.data
        this.pageInfo = resp.data.pageino
      } catch (error) {
        console.log(error)
      }
      return pageList
    },
    ChangeValue (data) {
      this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: data, gametypeid: '' })
    },
    /**
     * 获取选取的表格数据
    */
    handleCheckBox (arr) {
      this.getCheckboxVal = arr
      return this.getCheckboxVal
    },
    /**
     * 下载游戏
    */
    handleSubmit () {
      this.CenterId.forEach(item => {
        this.loadBtn = true
        let info = { CenterGameId: item.Id, DiskSymbol: this.Dg.data + '\\' }
        downloadGame(info.CenterGameId, info.DiskSymbol).then((response) => {
          this.DownloadGameUp = false
          this.$Message.success({
            content: this.$t(`${response.data}`),
            closable: true
          })
        }, (error) => {
          this.$Message.error(this.$t(`${error.data.error}`))
        }).catch((e) => {
          this.$Message.error({ desc: '' + e, duration: 0 })
        }).finally(() => {
          this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: '' })
          this.loadBtn = false
          this.getCheckboxVal = []
        })
      })
    },
    /*
     * 下载游戏弹窗
    */
    handleDownGame (id) {
      if (typeof id !== 'string' && this.getCheckboxVal.length === 0) {
        this.notifyUser('error', 'PleaseSelectAtLeastOneItemInTheList')
        return
      } else if (typeof id === 'string') {
        this.DownloadGameUp = true
        let x = [{ Id: id }]
        this.CenterId = x
      } else if (this.getCheckboxVal.length !== 0) {
        this.DownloadGameUp = true
        this.CenterId = this.getCheckboxVal
      }
      getLogicalDrives().then(response => {
        this.disk = response.data
        this.disk.map(item => {
          item.free_space = bytesToSize2(item.FreeSpace)
        })
        this.Dg.data = this.disk[0].DeviceID
      }, (error) => {
        this.$Message.error(this.$t(`${error.data.error}`))
      }).catch(() => {
        this.notifyUser('info', 'Getdiskinformationerror')
      })
    },
    handleGetTableList (e) {
      this.handleGetGameList({ offset: (e - 1) * this.Pagelimit, limit: this.Pagelimit, orderby: 'Name', gameName: this.GameName })
    },
    test () {
      let matched = this.$route.matched.filter(item => item.name)
      console.log(matched)
    },
    handleTableDw (index) {
      this.getCheckboxVal = this.tableSelectVal.push(index.id)
      // alert(this.getCheckboxVal)
      this.$router.push({
        path: 'subtype1-download',
        query: { id: this.getCheckboxVal }
      })
    },
    /**
     * 修复游戏
     */
    handleFixGame (index) {
      repairGame(index.Id).then((e) => {
        // this.$Message.success(this.$t('repairSucess'))
      }, () => {
        this.$Message.error(this.$t('FileNotFound'))
      }).catch((e) => {
        this.$Message.error({ desc: '' + e, duration: 0 })
      })
    },
    /**
     * 删除游戏
     */
    handleRemove (index) {
      this.$Modal.confirm({
        title: this.$t('DeleteTip'),
        content: this.$t('DeleteDec'),
        onOk: () => {
          deleteGame(index.Id).then((e) => {
            // this.$Message.success(this.$t('DeleteGameSucess'))
          }, () => {
            this.$Message.error(this.$t('FileNotFound'))
          }).catch(() => {
            this.$Message.error(this.$t('kxLinuxErr.10'))
          })
        }
      })
    },
    /**
     * 删除多个游戏
     */
    handleButtonRemove (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
      } else {
        if (this.getCheckboxVal.length > 1) {
          this.$Modal.confirm({
            title: this.$t('DeleteTip'),
            content: this.$t('DeleteCurrentData'),
            cancelText: this.$t('cancelText'),
            okText: this.$t('Confirm'),
            loading: true,
            onOk: () => {
              this.getCheckboxVal.forEach(item => {
                deleteGame(item.Id).then(
                  resp => {
                  },
                  (e) => {
                    this.notifyUser('error', `${e.data.error}`)
                    this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: '' })
                  }
                ).finally(() => {
                  this.$Modal.remove()
                })
              })
              this.handleGetGameList({ offset: 0, limit: this.Pagelimit, orderby: 'Name', gameName: '' })
            },
            onCancel: () => {
              this.$Modal.remove()
            }
          })
        } else {
          this.handleRemove(this.getCheckboxVal[0])
        }
      }
    },
    /**
     * 修复多个游戏
     */
    handleButtonFixGame () {
      let val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error(this.$t('PleaseSelectAtLeastOneItemInTheList'))
      } else {
        if (this.getCheckboxVal.length > 1) {
          this.getCheckboxVal.forEach((item) => {
            this.handleFixGame(item)
          })
        } else {
          this.handleFixGame(this.getCheckboxVal[0])
        }
      }
    }
  }
}
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>

