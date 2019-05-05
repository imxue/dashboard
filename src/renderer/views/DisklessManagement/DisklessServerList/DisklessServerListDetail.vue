<template>
  <div class="container">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="topItem">
      <Select style="width:200px; marginRight:10px;" v-model="model1" @on-change="listTypeChange">
        <Option v-for="item in serverList"  v-bind:key="item.serverIp"  :value="item.serverIp">{{item.serverIp}}</Option>
      </Select>
        
      <Button type="primary" class="topColumn" @click="handleButtonRefresh">{{$t('Refresh')}}</Button>

      <Divider type="vertical"/>
      <Button type="error" class="topColumn" @click="handleButtonDelete(ServerIp)">{{$t('Delete')}}</Button>
    </div>

    <Table border :columns="tableColumns1" :data="tableData1" :no-data-text="this.$t('Nodata')"></Table>


    <Row style="margin:20px 0;">
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
    <Row style="margin:20px 0;">
      <h3>{{$t('DiskSetting')}}</h3>
      <Divider/>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonAdd">设置磁盘作用</Button> -->
    </Row>
    <Row>
      <Table border :columns="tableColumns3" :data="tableData3" :no-data-text="this.$t('Nodata')"></Table>
    </Row>
    <div class="dig">
      <Modal
        v-model="modal6"
        :loading="loading"
        footer-hide
        :styles="{top: '400px'}"
        :closable="false"
      >
        <p class="textAlign">{{$t('DiskSetting')}}</p>
      </Modal>
    </div>
    <Modal :title="this.$t('DiskSetting')" v-model="showPopup02" width="500" footer-hide>
      <Row class="rowlist">
        <i-col span="5">{{$t('DevicePath')}}：</i-col>
        <i-col span="16">{{rowData.path}}</i-col>
      </Row>
      <Row class="rowlist">
        <i-col span="5">{{$t('DiskSize')}}：</i-col>
        <i-col span="16">{{rowData.size}} KB</i-col>
      </Row>
      <Row class="rowlist">
        <i-col span="5">{{$t('AvailableSpace')}}：</i-col>
        <i-col span="16">{{rowData.availableSize}} KB</i-col>
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
            placeholder="---请选择负载网卡---"
          >
            <Option value="imageDisk">{{$t('MirrorDisk')}}</Option>
            <Option value="dataDisk">{{$t('DataDisk')}}</Option>
            <Option value="writebackDisk">{{$t('WriteBackDisk')}}</Option>
            <Option value="unUsed">{{$t('Unused')}}</Option>
          </Select>
        </i-col>
      </Row>
      <Row class="rowlist">
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
  editServersNode,
  deleteserverx,
  getServersx,
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
      model1: '',
      loading: '',
      serverList: '',
      modal6: false,
      spinShow: false, // 加载动画
      tempMasterServerIp: '', // 主服务器Ip
      isMaster: '', // 是否为主服务器
      rowData: '',
      ServerIp: '',
      selecteDiskF: '',
      selecteDisk: 'imageDisk',
      getCheckboxVal: [], // 勾选复选框值
      showPopup02: false,
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
      tableData1: [],
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
        { key: 'path', renderHeader: (h, params) => { return h('span', this.$t('Device')) } },
        {
          renderHeader: (h, params) => { return h('span', this.$t('DiskSize')) },
          key: 'size',
          render: (h, params) => {
            return h('span', bytesToSize(params.row.size))
          }
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('AvailableSpace')) },
          key: 'availableSize',
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
          width: 140,
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
        { title: '映射盘符', key: 'mountVol', renderHeader: (h, params) => { return h('span', this.$t('MappingDiskSymbol')) } },
        {
          renderHeader: (h, params) => { return h('span', this.$t('IOReadRate')) },
          key: 'readRate',
          render: (h, params) => {
            return h('span', bytesToRate(params.row.readRate))
          }
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('IOWriteRate')) },
          key: 'writeRate',
          render: (h, params) => {
            return h('span', bytesToRate(params.row.writeRate))
          }
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('CumulativeIORead')) },
          key: 'readTotal',
          render: (h, params) => {
            return h('span', bytesToSize(params.row.readTotal))
          }
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('CumulativeIOWrite')) },
          key: 'writeTotal',
          render: (h, params) => {
            return h('span', bytesToSize(Number(params.row.writeTotal)))
          }
        },
        { key: 'isHealth', renderHeader: (h, params) => { return h('span', this.$t('Health')) } },
        {
          renderHeader: (h, params) => { return h('span', this.$t('operation')) },
          key: 'operation',
          width: 140,
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
    this.ServerIp = this.$route.query.data.serverIp
    this.handleGetServerInfo()
    this.GetServerList()
    this.handleGetNetworkx(this.ServerIp)
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
    GetServerList () {
      let that = this
      let ip = localStorage.getItem('masterip')
      if (ip) {
        getServersx(ip).then(response => {
          if (response.data.error === null) {
            that.serverList = response.data.result.list
          }
          console.log(that.serverList)
        })
      }
    },
    handleGetServerInfo () {
      var data = this.$route.query.data
      this.model1 = data.serverIp
      this.tableData1.push(data)
      this.isMaster = this.tableData1[0].isMaster
    },
    /**
     * 获取网卡信息
     */
    handleGetNetworkx (ip) {
      getNetworkx(ip).then(a => {
        var arr = a.data.result.list
        if (a.data.error === null && arr !== null) {
          arr.map(item => {
            if (item.vdiskSet === 'yes') {
              item['_checked'] = true
              this.getCheckboxVal = item
            }
          })
          this.tableData2 = arr
        } else {
          this.$Message.error(a.data.error)
        }
      })
    },
    /*
   获取磁盘信息
   */
    handleGetDiskStatusx (ip) {
      let that = this
      getDiskStatusx(ip).then(a => {
        var arr = a.data.result.list
        if (a.data.error === null && arr !== null) {
          this.tableData3 = arr
        } else {
          this.$Message.error(a.data.error)
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
    handleButtonDelete (ip) {
      this.$Modal.confirm({
        title: this.$t('DeleteTip'),
        content: this.$t('DeleteDec'),
        okText: this.$t('Delete'),
        cancelText: this.$t('cancelText'),
        onOk: () => {
          deleteserverx(ip, this.tempMasterServerIp).then(() => {
            this.$Message.success(this.$t('DeleteSucess'))
            this.$router.push({
              path: 'DisklessServerList'
            })
          })
          if (ip === localStorage.getItem('masterip')) {
            localStorage.removeItem('masterip')
            this.$router.push({
              path: 'DisklessServerList'
            })
          }
          deleteserverConfig(ip)
        },
        cancelTexxt: this.$t('cancelText')
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
    handleSetCard () {
      if (this.selecteFormatValue === 'yes') {
        this.$Modal.confirm({
          title: this.$t('DeleteClear'),
          content: this.$t('Clear'),
          okText: this.$t('Yes'),
          cancelText: this.$t('No'),
          onOk: () => {
            this.showPopup02 = false
            this.modal6 = true
            this.spinShow = true
            setDiskFunctionx(
              this.rowData.path,
              this.selecteDisk,
              '512',
              this.selecteFormatValue,
              this.selecteDiskF,
              this.ServerIp
            ).then(a => {
              // var result = a.data.result
              if (a.data.error === null) {
                this.modal6 = false
                this.spinShow = false
                this.handleGetDiskStatusx(this.ServerIp) // 刷新列表
              } else {
                this.$Message.error(a.data.error)
              }
              this.spinShow = false
            }, e => {
              console.log(e)
            })
          },
          onCancel: () => {
            this.$Modal.remove()
          }
        })
      } else {
        this.showPopup02 = false
        this.modal6 = true
        this.spinShow = true
        setDiskFunctionx(
          this.rowData.path,
          this.selecteDisk,
          '512',
          this.selecteFormatValue,
          this.selecteDiskF,
          this.ServerIp
        ).then(a => {
          if (a.data.error === null) {
            this.modal6 = false
            this.spinShow = false
            this.handleGetDiskStatusx(this.ServerIp) // 刷新列表
          } else {
            this.$Message.error(a.data.error)
          }
          this.spinShow = false
        })
      }
    },
    handleResetCard () {
      this.showPopup02 = false
    },
    /*
设置网卡
*/
    handleLoadNICx () {
      this.spanShow = true
      setVdiskEthernetx(this.getCheckboxVal, this.ServerIp).then(() => {
        this.spanShow = false
        this.$Notice.success({
          title: this.$t('SetSucess')
        })
        this.handleGetNetwork()
      })
    },
    handleSetDisk (index) {
      this.rowData = index
      this.showPopup02 = true
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
    test () {
      let matched = this.$route.matched.filter(item => item.name)
      console.log(matched)
    },
    handleSelect () {
      // alert(this.selecteDisk)
      // if ( this.selecteDisk === '无作用') {
      //   this.showState = true
      // }
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
    listTypeChange () {
      this.tableData1 = this.serverList.filter(item => {
        return item.serverIp === this.model1
      })
      this.handleGetNetworkx(this.model1)
      this.handleGetDiskStatusx(this.model1)
    }
  }
}
</script>

<style scoped>
.container{
  min-width: 1200px;
}
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

