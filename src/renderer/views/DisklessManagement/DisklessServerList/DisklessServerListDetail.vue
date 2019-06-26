<template>
  <div class="container">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="topItem">
      <Select style="width:200px; marginRight:10px;" v-model="currentPageServerip" @on-change="listTypeChange">
        <Option v-for="item in serverList"  v-bind:key="item.serverIp"  :value="item.serverIp">{{item.serverIp}}</Option>
      </Select>
        
      <Button type="primary" class="topColumn" @click="handleButtonRefresh">{{$t('Refresh')}}</Button>

      <Divider type="vertical"/>
      <Button type="error" class="topColumn" @click="handleButtonDelete()">{{$t('Delete')}}</Button>
    </div>

    <Table border :columns="tableColumns1" :data="CurrentPageserverInfo" :no-data-text="this.$t('Nodata')"></Table>


    <Row style="margin:10px 0;">
      <h3>{{$t('NetworkSetting')}}</h3>
      <Divider/>
      <Button type="primary" class="topColumn" @click="handleLoadNICx">{{$t('SetTheLoadNetworkCard')}}</Button>
    </Row>
    <Table
      border
      ref="selection"
      :columns="tableColumns2"
      :data="tableData2"
      @on-selection-change="handleCheckBox"
      :no-data-text="this.$t('Nodata')"
    ></Table>
    <div style="margin:10px 0; ">
      <h3>{{$t('DiskSetting')}}</h3>
      <Divider/>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonAdd">设置磁盘作用</Button> -->
    </div>
   
      <Table border :columns="tableColumns3" :data="tableData3" :no-data-text="this.$t('Nodata')" @on-row-dblclick="handleSetDisk"></Table>
    
    <div class="dig">
      <Modal
        v-model="DiskSettingDialog"
        :loading="loading"
        footer-hide
        :styles="{top: '400px'}"
        :closable="false"
      >
        <p class="textAlign">{{$t('DiskSetting')}}</p>
      </Modal>
    </div>
    <Modal :title="this.$t('DiskSetting')" v-model="DiskSetDialog" width="500" footer-hide>
      <Row class="rowlist">
        <i-col span="5">{{$t('DevicePath')}}：</i-col>
        <i-col span="16">{{rowData.path}}</i-col>
      </Row>
      <Row class="rowlist">
        <i-col span="5">{{$t('DiskSize')}}：</i-col>
        <i-col span="16">{{bytesToSize1(rowData.size)}}</i-col>
        <!-- <i-col span="16">{{rowData.size}} KB</i-col> -->
      </Row>
      <Row class="rowlist">
        <i-col span="5">{{$t('AvailableSpace')}}：</i-col>
        <i-col span="16">{{bytesToSize1(rowData.availableSize)}}</i-col>
      </Row>
      <Row class="rowlist">
        <i-col span="24">
          <i-col span='5'>{{$t('DiskEffect')}}：</i-col>
          <Select
            v-model="selecteDisk"
            @on-change="handleSelect"
            clearable
            class="topColumn"
            style="width:200px;"
          >
            <Option value="imageDisk">{{$t('MirrorDisk')}}</Option>
            <Option value="dataDisk">{{$t('DataDisk')}}</Option>
            <Option value="writebackDisk">{{$t('WriteBackDisk')}}</Option>
            <Option value="unUsed">{{$t('Unused')}}</Option>
          </Select>
        </i-col>
      </Row>
      <Row class="rowlist" v-show="this.selecteDisk !== 'unUsed'">
        <i-col span="24">
           <i-col span='5'>{{$t('isFormat')}}：</i-col>
          <Select
            v-model="selecteFormatValue"
            clearable
            class="topColumn"
            style="width:200px;"
            :placeholder="this.$t('pleaseInput')"
          >
            <Option value="yes">{{$t('Yes')}}</Option>
            <Option value="no">{{$t('No')}}</Option>
          </Select>
        </i-col>
      </Row>
      <Row v-show="this.selecteDisk === 'dataDisk'" class="rowlist">
        <i-col span="24" >
         <i-col span='5'>{{$t('MappingDiskSymbol')}}：</i-col> 
          <Select
            v-model="selecteDiskF"
            clearable
            class="topColumn"
            style="width:200px;"
            :placeholder="this.$t('pleaseInput')"
          >
            <Option value="E">E</Option>
            <Option value="F">F</Option>
            <Option value="G">G</Option>
            <Option value="H">H</Option>
            <Option value="I">I</Option>
          </Select>
        </i-col>
      </Row>
      <div class="buttonList" style="margin-top:20px;">
        <Button type="primary" @click="handleSetCard">{{$t('Save')}}</Button>
        <Button @click="handleResetCard" style="margin-left: 8px">{{$t('cancelText')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  setDiskFunctionx,
  addServers,
  getServersx,
  editServersNode,
  deleteserverx,
  getNetworkx,
  getDiskStatusx,
  setVdiskEthernetx,
  deleteserverConfig
} from '@/api/wupan'
import { bytesToSize, bytesToRate } from '@/utils/index'
export default {
  name: 'subType1-detail',
  data () {
    return {
      bytesToSize1: bytesToSize,
      currentPageServerip: '',
      loading: '',
      serverList: '',
      DiskSettingDialog: false, // 磁盘设置中提示
      spinShow: false, // 加载动画
      tempMasterServerIp: '', // 主服务器Ip
      isMaster: '', // 是否为主服务器
      rowData: '',
      ServerIp: '',
      selecteDiskF: '',
      selecteDisk: 'imageDisk',
      getCheckboxVal: [], // 勾选复选框值
      DiskSetDialog: false, // 磁盘设置弹窗
      selecteFormatValue: 'no',
      tableColumns1: [
        {
          renderHeader: (h, params) => { return h('span', this.$t('CurrentStatus')) },
          key: 'online',
          render: (h, params) => {
            let type = params.row.online
            let isMaster = params.row.isMaster
            if (isMaster === '1') {
              switch (type) {
                case '0':
                  return h('div', [
                    h('span', { style: { color: '#999999' } }, this.$t('Offline')),
                    h('Tag', { props: { color: 'red' } }, this.$t('MasterIp'))
                  ])
                case '1':
                  return h('div', [
                    h('span', { style: { color: '#0ecf1f' } }, this.$t('online')),
                    h(
                      'Tag',
                      {
                        props: { color: 'red' },
                        style: {
                          marginLeft: '8px'
                        }
                      },
                      this.$t('MasterIp')
                    )
                  ])
                case '2':
                  return h('div', [
                    h('span', { style: { color: '#f90' } }, this.$t('OnlineException')),
                    h('Tag', { props: { color: 'red' } }, this.$t('MasterIp'))
                  ])
                default:
                  return '-'
              }
            } else {
              switch (type) {
                case '0':
                  return h('span', { style: { color: '#999999' } }, this.$t('Offline'))
                case '1':
                  return h('span', { style: { color: '#0ecf1f' } }, this.$t('online'))
                case '2':
                  return h('span', { style: { color: '#f90' } }, this.$t('OnlineException'))
                default:
                  return '-'
              }
            }
          }
        },
        { key: 'serverIp', renderHeader: (h, params) => { return h('span', this.$t('ServerIP')) } },
        { key: 'dataVer', renderHeader: (h, params) => { return h('span', this.$t('ServiceVersion')) } }
      ],
      CurrentPageserverInfo: [],
      tableColumns2: [
        { type: 'selection', width: 60, align: 'center' },
        {
          renderHeader: (h, params) => { return h('span', this.$t('CurrentStatus')) },
          key: 'linkStatic',
          disabled: 'true',
          render: (h, params) => {
            let type = params.row.linkStatic
            switch (type) {
              case 'offline':
                return h('span', { style: { color: '#999999' } }, this.$t('Offline'))
              case 'online':
                return h('span', this.$t('online'))
              default:
                return '-'
            }
          }
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('DataLoad')) },
          key: 'vdiskSet',
          render: (h, params) => {
            let type = params.row.vdiskSet
            switch (type) {
              case 'yes':
                return h('span', { style: { color: '#f6521f' } }, this.$t('Yes'))
              case 'no':
                return h('span', this.$t('No'))
              default:
                return '-'
            }
          }
        },
        { key: 'name', renderHeader: (h, params) => { return h('span', this.$t('NetwokDeviceName')) } },
        { key: 'ip', renderHeader: (h, params) => { return h('span', this.$t('IPAddress')) } },
        {
          renderHeader: (h, params) => { return h('span', this.$t('NICSpeed')) },
          key: 'linkRate',
          render: (h, params) => {
            var a = params.row.linkRate / 1000 + ' G'
            return h('span', a)
          }
        }
      ],
      tableData2: [], // 网卡信息
      tableColumns3: [
        { key: 'path', minWidth: 90, renderHeader: (h, params) => { return h('span', this.$t('Device')) } },
        {
          renderHeader: (h, params) => { return h('span', this.$t('DiskSize')) },
          key: 'size',
          minWidth: 90,
          render: (h, params) => {
            return h('span', bytesToSize(params.row.size))
          }
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('AvailableSpace')) },
          key: 'availableSize',
          minWidth: 110,
          render: (h, params) => {
            var value = params.row.availableSize
            if (value === '0' || value === 'undefined' || value === 'null') {
              return h('span', '0')
            } else {
              return h('span', bytesToSize(params.row.availableSize))
            }
          }
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('Effect')) },
          key: 'fun',
          minWidth: 100,
          render: (h, params) => {
            let type = params.row.fun
            switch (type) {
              case 'osDisk':
                return h('span', this.$t('SystemDisk'))
              case 'imageDisk':
                return h('span', this.$t('MirrorDisk'))
              case 'dataDisk':
                return h('span', this.$t('DataDisk'))
              case 'writebackDisk':
                return h('span', this.$t('WriteBackDisk'))
              case 'unUsed':
                return h('span', this.$t('Unused'))
              case 'raidMember':
                return h('span', this.$t('ArrayMember'))
              default:
                return '-'
            }
          }
        },
        { title: '映射盘符', key: 'mountVol', minWidth: 120, renderHeader: (h, params) => { return h('span', this.$t('MappingDiskSymbol')) } },
        {
          renderHeader: (h, params) => { return h('span', this.$t('IOReadRate')) },
          key: 'readRate',
          minWidth: 110,
          render: (h, params) => {
            return h('span', bytesToRate(params.row.readRate))
          }
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('IOWriteRate')) },
          key: 'writeRate',
          minWidth: 110,
          render: (h, params) => {
            return h('span', bytesToRate(params.row.writeRate))
          }
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('CumulativeIORead')) },
          key: 'readTotal',
          minWidth: 100,
          render: (h, params) => {
            return h('span', bytesToSize(params.row.readTotal))
          }
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('CumulativeIOWrite')) },
          key: 'writeTotal',
          minWidth: 100,
          render: (h, params) => {
            return h('span', bytesToSize(Number(params.row.writeTotal)))
          }
        },
        { key: 'isHealth', minWidth: 90, renderHeader: (h, params) => { return h('span', this.$t('Health')) } },
        {
          renderHeader: (h, params) => { return h('span', this.$t('operation')) },
          key: 'operation',
          minWidth: 140,
          align: 'center',
          render: (h, params) => {
            let a = h(
              'Button',
              {
                props: { type: 'info', ghost: true },
                on: {
                  click: () => {
                    this.handleSetDisk(params.row)
                  }
                }
              },
              this.$t('SetDiskRole')
            )
            let b = h(
              'Button',
              {
                props: { type: 'info', disabled: true }
              },
              this.$t('SetDiskRole')
            )
            if (params.row.fun === 'osDisk') {
              return b
            } else {
              return a
            }
          }
        }
      ],
      tableData3: [] // 磁盘信息类别
    }
  },
  created () {
    this.tempMasterServerIp = this.$route.query.tempMasterServerIp
    this.serverList = this.$route.query.serverList
    this.handleGetCurrentPageServerInfo()
    this.handleGetNetworkx(this.currentPageServerip)
    let masterip = localStorage.getItem('masterip')
    if (masterip) {
      this.handleGetDiskStatusx(masterip)
    }
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    handleGetCurrentPageServerInfo () {
      var data = this.$route.query.data
      this.currentPageServerip = data.serverIp
      this.CurrentPageserverInfo.push(data)
      this.isMaster = this.CurrentPageserverInfo[0].isMaster
    },
    /**
     * 获取网卡信息
     */
    handleGetNetworkx (ip) {
      getNetworkx(ip).then(resp => {
        if (!resp.data.error) {
          var arr = resp.data.result.list
          arr.map(item => {
            if (item.vdiskSet === 'yes') {
              item['_checked'] = true
              this.getCheckboxVal = item
            }
          })
          this.tableData2 = arr
        }
      })
    },
    /*
   获取磁盘信息
   */
    handleGetDiskStatusx (ip) {
      let that = this
      getDiskStatusx(ip).then(resp => {
        if (!resp.data.error) {
          this.tableData3 = resp.data.result.list || []
        }
      })
      that.spinShow = false
    },
    handleButtonStandby () {},
    handleButtonWorking () {},
    handleButtonOff () {},
    handleButtonRestart () {},
    handleButtonRemote () {},
    handleButtonUpgrade () {},
    /**
     * 删除ip
     */
    handleSelect () {},
    handleButtonDelete () {
      this.$Modal.confirm({
        title: this.$t('DeleteTip'),
        content: this.$t('DeleteDec'),
        okText: this.$t('Delete'),
        cancelText: this.$t('cancelText'),
        onOk: () => {
          deleteserverx(this.currentPageServerip, this.tempMasterServerIp).then((resp) => {
            if (!resp.data.error) {
              this.$Message.success(this.$t('DeleteSucess'))
              this.$router.push({
                path: 'DisklessServerList'
              })
            }
          })
          if (this.currentPageServerip === localStorage.getItem('masterip')) {
            localStorage.removeItem('masterip')
            this.$router.push({
              path: 'DisklessServerList'
            })
          }
          deleteserverConfig(this.currentPageServerip)
          /**
           * 如果删除主服务器，其他附属服务器都删除
           */
          if (this.currentPageServerip === this.tempMasterServerIp) {
            this.serverList.forEach(element => {
              deleteserverConfig(element.serverIp).then((resp) => {
              }, () => {
                console.log(element.serverIp + '属性清除失败')
              })
            })
          }
        }
      })
    },
    handleButtonSetSever () {
      // 若当前服务器为主服务器， 提示'当前服务器为主服务器'
      if (
        this.$route.query.tempMasterServerIp &&
        this.tempMasterServerIp === this.rowData.serverIP
      ) {
        this.$Message.info(this.$t('masterismaster'))
      } else {
        // 提交data:
        // 1.先提交到 addServers，将当前serverIp设为mastServerIp， 然后再将之前的mastServerIp设置为从服务器 editServersNode
        // serverIp, guid
        addServers(this.rowData.serverIp, this.rowData.guid).then(a => {
          if (a.data.error === null) {
            this.handleEditServersNode(this.rowData.serverIp) // 将之前的主服务器serverIp设置 为从服务器
          } else {
            this.$Message.error(a.data.error)
          }
        })
      }
    },
    handleEditServersNode () {
      // masterIp, syncimg, auba
      editServersNode(
        this.tempMasterServerIp,
        '1',
        '1',
        this.rowData.serverIp
      ).then(a => {
        if (a.data.error === null) {
          this.$Message.sucess(this.$t('DeleteDec'))
        } else {
          this.$Message.error(a.data.error)
        }
      })
    },
    /**
     * 设置磁盘
     */
    handleSetCard () {
      // this.selecteFormatValue === 'yes' ?
      if (this.selecteFormatValue === 'yes') {
        this.$Modal.confirm({
          title: this.$t('DeleteClear'),
          content: this.$t('Clear'),
          okText: this.$t('Yes'),
          cancelText: this.$t('No'),
          onOk: () => {
            this.HandleSetDisk()
          },
          onCancel: () => {
            this.$Modal.remove()
          }
        })
      } else {
        this.HandleSetDisk()
      }
    },
    /**
     * 设置磁盘
     */
    HandleSetDisk () {
      this.DiskSetDialog = false
      this.DiskSettingDialog = true
      this.spinShow = true
      setDiskFunctionx(
        this.rowData.path,
        this.selecteDisk,
        '512',
        this.selecteFormatValue,
        this.selecteDiskF,
        this.currentPageServerip
      ).then(response => {
        if (!response.data.error) {
          this.handleGetDiskStatusx(this.currentPageServerip)
        } else {
          this.$Message.error(`kxLinuxErr.$t(response.data.error)`)
        }
        this.DiskSettingDialog = false
        this.spinShow = false
      })
    },
    handleResetCard () {
      this.DiskSetDialog = false
    },
    /**
     * 设置网卡
     */
    handleLoadNICx () {
      this.spanShow = true
      setVdiskEthernetx(this.getCheckboxVal, this.currentPageServerip).then((resp) => {
        this.spanShow = false
        if (!resp.data.error) {
          this.$Notice.success({
            title: this.$t('SetSucess')
          })
        }
        this.handleGetNetworkx(this.ServerIp)
      })
    },
    handleSetDisk (index) {
      this.rowData = index
      this.DiskSetDialog = true
    },
    /**
     * 获取网卡设置选项
     */
    handleCheckBox (arr) {
      var data = arr
      var list = []
      for (var i in arr) {
        list.push(data[i].name)
      }
      this.getCheckboxVal = list

      return this.getCheckboxVal
    },
    /*
      刷新
      */
    handleButtonRefresh () {
      this.spinShow = true
      this.handleGetNetworkx(this.ServerIp)
      this.handleGetDiskStatusx(this.ServerIp)
    },
    /*
    列表选择
    */
    listTypeChange (serverip) {
      this.serverIp = serverip
      getServersx(serverip).then((resp) => {
        if (!resp.data.error) {
          this.CurrentPageserverInfo = resp.data.result.list.filter(item => { return item.serverIp === serverip })
        }
      })
      this.handleGetNetworkx(serverip)
      this.handleGetDiskStatusx(serverip)
    }
  }
}
</script>

<style scoped>

.topColumn {
  float: none;
}
.ivu-divider-vertical {
  margin-left: -2px;
}
.ivu-divider {
  background-color: #b0b0b0;
}
.ivu-modal-body {
  padding-left: 50px;
}
h3 {
  margin-bottom: -20px;
}
.rowlist {
  height: 30px;
  line-height: 30px;
  width: 100%;
  margin-bottom: 10px;
}
.textAlign {
  text-align: center;
  font-size: 14px;
  margin: -10px;
}
</style>

