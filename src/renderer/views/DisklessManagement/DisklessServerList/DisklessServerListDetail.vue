<template>
  <div class="container">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="topItem">
      <Select style="width:200px; marginRight:10px;" v-model="currentPageServerip" @on-change="listTypeChange">
        <Option v-for="item in serverList"  v-bind:key="item.serverIp" :disabled='item.online !== "1"' :value="item.serverIp">{{item.serverIp}} <Tag v-if="item.isMaster === '1'" color="red">master</Tag></Option>
      </Select>
        
      <Button type="primary" class="topColumn" @click="handleButtonRefresh">{{$t('Refresh')}}</Button>

      <Divider type="vertical"/>
      <Button type="error" class="topColumn" @click="handleButtonDelete()">{{$t('Delete')}}</Button>
      <Divider v-show="isMaster !== '1'" type="vertical" />
      <Button type="error" class="topColumn" v-show="isMaster !== '1'" @click="HandlechangeMaster()">{{$t('setMaterIp')}}</Button>
    </div>

    <Table border :columns="tableColumns1" :data="CurrentPageserverInfo" ></Table>


    <Row style="margin:10px 0;">
      <span>{{$t('NetworkSetting')}}</span>
      <Divider/>
      <Button type="primary" class="topColumn" @click="handleLoadNICx">{{$t('SetTheLoadNetworkCard')}}</Button>
    </Row>
    <Table
      border
      ref="selection"
      :columns="tableColumns2"
      :data="tableData2"
      @on-selection-change="handleCheckBox"
    ></Table>
    <div style="margin:10px 0; ">
      <span >{{$t('DiskSetting')}}</span>
      <Divider/>
       <Button type="primary" @click="handleDisk">{{this.$t('SetUpDiskSoftConnection')}}</Button>
    </div>
      <Modal
        v-model="xxxx"
        footer-hide
        width="760"
        :styles="{top: '260px'}"
        :title="this.$t('SetUpDiskSoftConnection')">
        <Transfer
        :titles="[this.$t('ArrayMembersCanBeUsed'), this.$t('ArrayMemberAlreadyExists')]"
        :data="data1"
        :render-format="render3"
        :list-style="listStyle"
        :targetKeys="rightData"
        :operations="[this.$t('Remove'),this.$t('Create')]"
        @on-change="handleChange1"></Transfer>
         <Spin fix v-show="setspin"> <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon></Spin>
    </Modal>

    
      <Table border :columns="tableColumns3" :data="diskInfo" @on-row-dblclick="ShowDiskPlan"></Table>
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
    <Modal :title="this.$t('DiskSetting')" v-model="DiskSetDialog" width="600" footer-hide>
      <div class="wrapper">
      <div class="left">
      <Row class="rowlist">
        <i-col span="7">{{$t('DevicePath')}}：</i-col>
        <i-col span="16">{{rowData.path}}</i-col>
      </Row>
      <Row class="rowlist">
        <i-col span="7">{{$t('DiskSize')}}：</i-col>
        <i-col span="16">{{rowData.size}}</i-col>
      </Row>
      <Row class="rowlist">
        <i-col span="7">{{$t('AvailableSpace')}}：</i-col>
        <i-col span="16">{{rowData.availableSize}}</i-col>
      </Row>
      <Row class="rowlist">
        <i-col span="24">
          <i-col span='7'>{{$t('DiskEffect')}}：</i-col>
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
           <i-col span='7'>{{$t('isFormat')}}：</i-col>
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
      <Row v-show="this.selecteDisk !== 'unUsed'" class="rowlist">
        <i-col span="24" >
         <i-col span='7'>{{$t('MappingDiskSymbol')}}：</i-col> 
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
      <Row class="rowlist" v-show="this.selecteDisk === 'dataDisk'">
        <i-col span="24">
           <i-col span='7'>{{$t('ExtendedType')}}：</i-col>
          <Select
            v-model="ExtendedType"
            clearable
            class="topColumn"
            style="width:200px;"
            :placeholder="this.$t('pleaseInput')"
          >
            <Option value="0">{{$t('GameDisk')}}</Option>
            <Option value="1">{{$t('HotGameDisk')}}</Option>
            <Option value="2">{{$t('PrivateGameDisk')}}</Option>
          </Select>
        </i-col>
      </Row>
      </div>
      <div class="right">
        <span>{{this.$t(`ExtendedTypeTip.${0}`)}}</span>
        <ul>
          <span>{{this.$t(`ExtendedTypeTip.${1}`)}}</span>
          <li>{{this.$t(`ExtendedTypeTip.${2}`)}}</li>
          <li>{{this.$t(`ExtendedTypeTip.${3}`)}}</li>
        </ul>
     
        <span>{{this.$t(`ExtendedTypeTip.${4}`)}}</span>
        <ul>
          <li>{{this.$t(`ExtendedTypeTip.${5}`)}}</li>
          <li>{{this.$t(`ExtendedTypeTip.${6}`)}}</li>
        </ul>
        <span>{{this.$t(`ExtendedTypeTip.${7}`)}}</span>
        <ul>
          <li>{{this.$t(`ExtendedTypeTip.${8}`)}}</li>
          <li>{{this.$t(`ExtendedTypeTip.${9}`)}}</li>
        </ul>
      </div>
      </div>
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
  getServersx,
  editServersNode,
  deleteserverx,
  getNetworkx,
  getDiskStatusx,
  setVdiskEthernetx,
  deleteserverConfig,
  RaidCreate,
  RaidRemove
} from '@/api/wupan'
import { bytesToSize, bytesToRate } from '@/utils/index'
import { setDiskAttribute } from '@/api/sync'
export default {
  name: 'subType1-detail',
  data () {
    return {
      currentPageServerip: '',
      loading: '',
      xxxx: false, // 设置磁盘 穿
      rightData: [],

      setspin: false,
      serverList: '',
      DiskSettingDialog: false, // 磁盘设置中提示
      spinShow: false, // 加载动画
      MasterServerIp: '', // 主服务器Ip
      isMaster: '', // 是否为主服务器
      rowData: '',
      selecteDiskF: 'E',
      selecteDisk: 'imageDisk',
      getCheckboxVal: [], // 勾选复选框值
      DiskSetDialog: false, // 磁盘设置弹窗
      selecteFormatValue: 'no',
      ExtendedType: '0', // 扩展类型
      DiskData: {}, // 磁盘信息
      listStyle: {
        width: '300px',
        height: '300px'
      },
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
                return h('span', { style: { color: '#0ecf1f' } }, this.$t('online'))
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
                return h('span', { style: { color: '#999999' } }, this.$t('No'))
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
            return h('span', params.row.size)
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
              return h('span', params.row.availableSize)
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
        { title: '映射盘符',
          key: 'mountVol',
          minWidth: 120,
          renderHeader: (h, params) => { return h('span', this.$t('MappingDiskSymbol')) },
          render: (h, params) => {
            return h('span', params.row.mountVol || '----')
          } },
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
                    this.ShowDiskPlan(params.row)
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
      diskInfo: [], // 磁盘信息类别
      data1: []
    }
  },
  created () {
    this.MasterServerIp = this.$route.query.MasterServerIp
    this.serverList = this.$route.query.serverList
    this.handleGetCurrentPageServerInfo()
    this.handleGetNetworkx(this.currentPageServerip)
    this.handleGetDiskStatusx(this.currentPageServerip)
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    handleChange1 (data, x, selected) {
      this.setspin = true
      if (x === 'left') {
        let path
        selected.forEach(item => {
          path = item
          RaidRemove(path, this.currentPageServerip).then(() => {
            this.handleGetDiskStatusx(this.currentPageServerip)
          }, (error) => {
            this.$Message.success(this.$t(`kxLinuxErr.${error}`))
            this.handleGetDiskStatusx(this.currentPageServerip)
          }).finally(() => {
            this.setspin = false
          })
        })
      } else {
        if (selected.length === 1) {
          this.$Message.success(this.$t('AtLeastTwoDisks'))
          this.setspin = false
        } else {
          let y = []
          selected.forEach(item => {
            y.push(item)
          })
          RaidCreate(y, this.currentPageServerip).then(() => {
            this.handleGetDiskStatusx(this.currentPageServerip)
          }, (error) => {
            this.$Message.success(this.$t(`kxLinuxErr.${error}`))
            this.handleGetDiskStatusx(this.currentPageServerip)
          }).finally(() => {
            this.setspin = false
          })
        }
      }
    },
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
        var arr = resp.data.result.list
        arr.map(item => {
          if (item.vdiskSet === 'yes') {
            item['_checked'] = true
            this.getCheckboxVal = item
          }
        })
        this.tableData2 = arr
      })
    },
    /*
   获取磁盘信息
   */
    handleGetDiskStatusx (ip) {
      let that = this
      getDiskStatusx(ip).then(resp => {
        this.data1 = []
        this.diskInfo = resp.data.result.list || []
        console.log(this.diskInfo)
        this.diskInfo.forEach(item => {
          item.size = bytesToSize(item.size)
          item.availableSize = bytesToSize(item.availableSize)
          let f = {}
          if (item.fun === 'unUsed') {
            f['key'] = item.path
            f['label'] = item.path
            f['isRaid'] = item.isRaid
            f['capacity'] = item.size
            // if (item.isRaid === '0') {
            this.data1.push(f)
            // }
            if (item.isRaid === '1') {
              this.rightData.push(f.label)
            }
          }
        })
      })
      that.spinShow = false
    },
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
          deleteserverx(this.currentPageServerip, this.MasterServerIp).then((resp) => {
            deleteserverConfig(this.currentPageServerip)
            this.$Message.success(this.$t('DeleteSucess'))
            this.$router.push({
              path: 'DisklessServerList'
            })
            if (this.currentPageServerip === localStorage.getItem('masterip')) {
              localStorage.removeItem('masterip')
            }
          }, (resp) => {
            this.$Message.success(this.$t(`kxLinuxErr.${resp}`))
          })
        }
      })
    },
    handleEditServersNode () {
      editServersNode(
        this.MasterServerIp,
        this.rowData.serverIp,
        '1',
        '1'
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
      this.DiskSettingDialog = true
      this.spinShow = true
      this.DiskData = {
        path: this.rowData.path, // 设备路径
        fun: this.selecteDisk, // 磁盘作用
        cacheSize: '512',
        isFormat: this.selecteFormatValue,
        exttype: this.selecteDisk === 'dataDisk' ? this.ExtendedType : '',
        vol: this.selecteDiskF // 映射磁盘
      }
      setDiskFunctionx(this.DiskData, this.currentPageServerip).then(response => {
        this.DiskSetDialog = false
        this.DiskSettingDialog = false
        this.spinShow = false
        if (this.selecteDisk === 'dataDisk') {
          let info = {
            ip: this.currentPageServerip,
            devicePath: this.rowData.path,
            disk: this.selecteDiskF,
            extend: parseInt(this.ExtendedType)
          }
          setDiskAttribute(info).then((resp) => {
            this.$Message.error(this.$t(`ExtendedTypeSuccess`))
          }, () => {
            this.$Message.error(this.$t(`ExtendedTypeFail`))
          })
        }
      }, (response) => {
        this.spinShow = false
        this.DiskSettingDialog = false
        this.$Message.error(this.$t(`kxLinuxErr.${response}`))
      }).finally(() => {
        this.handleGetDiskStatusx(this.currentPageServerip)
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
        this.$Message.success(this.$t(`SetSucess`))
        this.handleGetNetworkx(this.currentPageServerip)
      }, (resp) => {
        this.$Message.error(this.$t(`kxLinuxErr.${resp}`))
      })
    },
    /**
     * 弹出设置面板
     */
    ShowDiskPlan (index) {
      this.rowData = index
      this.selecteDisk = this.rowData.fun
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
      getServersx(this.currentPageServerip).then((resp) => {
        this.serverList = resp.data.result.list
        this.CurrentPageserverInfo = resp.data.result.list.filter(item => { return item.serverIp === this.currentPageServerip })
        this.isMaster = this.CurrentPageserverInfo[0].isMaster
      }, (resp) => {
        this.$Message.error(this.$t(`kxLinuxErr.${resp}`))
      }).catch((error) => {
        console.log(error)
      })
      this.handleGetNetworkx(this.currentPageServerip)
      this.handleGetDiskStatusx(this.currentPageServerip)
    },
    /**
     * 切换主服务器
     */
    HandlechangeMaster () {
      let sucessflag = 0
      for (let i = 0; i < this.serverList.length; i++) {
        editServersNode(this.currentPageServerip, '1', '1', this.serverList[i].serverIp).then((resp) => {
          sucessflag++
        }, (error) => {
          console.log(error)
        })
      }
      if (sucessflag === this.serverList.length) {
        localStorage.setItem('masterip', this.currentPageServerip)
        sucessflag = 0
      }
      setTimeout(() => {
        this.handleButtonRefresh()
      }, 1000)
      this.handleButtonRefresh()
    },
    /*
    列表选择
    */
    listTypeChange (serverip) {
      getServersx(this.MasterServerIp).then((resp) => {
        this.CurrentPageserverInfo = resp.data.result.list.filter(item => { return item.serverIp === serverip })
        this.isMaster = this.CurrentPageserverInfo[0].isMaster
      })
      this.handleGetNetworkx(serverip)
      this.handleGetDiskStatusx(serverip)
    },
    handleDisk () {
      this.xxxx = true
    },
    render3 (item) {
      return item.label + ' - ' + item.capacity
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
span {
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
.wrapper{
  display: flex;
}
ul ,li {
  list-style: none;
}
li {
  margin-left: 10px;
}
.left {
  flex:1;
}
.ivu-divider-horizontal{
  margin:15px 0;
  font-weight: bold;
}
.right{
  background:#F8FCE5;
  border: 1px solid #ddd;
  padding:8px;
  max-width: 260px;
  font-size: 14px;
}
.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>

