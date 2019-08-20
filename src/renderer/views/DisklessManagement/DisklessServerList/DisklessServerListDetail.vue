<template>
  <div class="container">
    <Spin
      size="large"
      fix
      v-if="spinShow"
    ></Spin>
    <div class="topItem">
      <Select
        style="width:200px; marginRight:10px;"
        v-model="currentPageServerip"
        @on-change="listTypeChange"
      >
        <Option
          v-for="item in serverList"
          v-bind:key="item.serverIp"
          :disabled='item.online !== "1"'
          :value="item.serverIp"
        >{{item.serverIp}}
        </Option>
      </Select>

      <Button
        type="primary"
        class="topColumn"
        @click="handleButtonRefresh"
      >{{$t('Refresh')}}</Button>

      <Divider type="vertical" />
      <Button
        type="error"
        class="topColumn"
        @click="handleButtonDelete()"
      >{{$t('Delete')}}</Button>
      <Divider
        v-show="isMaster !== '1'"
        type="vertical"
      />
      <Button
        type="error"
        class="topColumn"
        v-show="isMaster !== '1' && isonline === '1'"
        @click="HandlechangeMaster()"
      >{{$t('setMaterIp')}}</Button>
    </div>

    <Table
      border
      :columns="serverTableStructure"
      :data="CurrentPageserverInfo"
    ></Table>

    <Row style="margin:10px 0;">
      <span>{{$t('NetworkSetting')}}</span>
      <Divider />
      <Button
        type="primary"
        class="topColumn"
        @click="handleLoadNICx"
      >{{$t('SetTheLoadNetworkCard')}}</Button>
    </Row>
    <Table
      border
      ref="selection"
      :columns="tableColumns2"
      :data="tableData2"
      @on-selection-change="handleCheckBox"
    ></Table>
    <div style="margin:10px 0; ">
      <span>{{$t('DiskSetting')}}</span>
      <Divider />
      <Button
        type="primary"
        @click="handleDisk"
      >{{this.$t('SetUpDiskSoftConnection')}}</Button>
    </div>
    <Modal
      v-model="softConnectionShowup"
      footer-hide
      width="760"
      :mask-closable="false"
      :styles="{top: '260px'}"
      :title="this.$t('SetUpDiskSoftConnection')"
    >
      <Transfer
        :titles="[this.$t('ArrayMembersCanBeUsed'), this.$t('ArrayMemberAlreadyExists')]"
        :data="matrix"
        :render-format="render3"
        :list-style="listStyle"
        :targetKeys="ExistsMatrixMember"
        :operations="[this.$t('Remove'),this.$t('Create')]"
        @on-change="handleChange1"
      ></Transfer>
      <Spin fix v-show="setspin">
        <Icon
          type="ios-loading"
          size=18
          class="demo-spin-icon-load"></Icon>
      </Spin>
    </Modal>

    <Table
      border
      :columns="tableColumns3"
      :data="diskInfo"
      @on-row-dblclick="ShowDiskPlan"></Table>
    <div class="dig">
      <Modal
        v-model="DiskSettingDialog"
        :loading="loading"
        footer-hide
        :styles="{top: '400px'}"
        :closable="false" >
        <p class="textAlign">{{$t('DiskSetting')}}</p>
      </Modal>
    </div>
    <Modal
      :title="this.$t('DiskSetting')"
      v-model="DiskSetDialog"
      width="600"
      footer-hide>
      <div class="wrapper">
        <div class="left">
          <Row class="rowlist">
            <Col span="7">{{$t('DevicePath')}}：</Col>
            <Col span="16">{{selectedDisk.path}}</Col>
          </Row>
          <Row class="rowlist">
            <Col span="7">{{$t('DiskSize')}}：</Col>
            <Col span="16">{{selectedDisk.size}}</Col>
          </Row>
          <Row class="rowlist">
            <Col span="7">{{$t('AvailableSpace')}}：</Col>
            <Col span="16">{{selectedDisk.availableSize}}</Col>
          </Row>
          <Row class="rowlist">
            <Col span="24">
              <Col span='7'>{{$t('DiskEffect')}}：</Col>
              <Select
                v-model="selecteDisk"
                @on-change="handleSelect"
                class="topColumn"
                style="width:200px;"
              >
                <Option value="imageDisk">{{$t('MirrorDisk')}}</Option>
                <Option value="dataDisk">{{$t('DataDisk')}}</Option>
                <Option value="writebackDisk">{{$t('WriteBackDisk')}}</Option>
                <Option value="userDisk">{{$t('userDisk')}}</Option>
                <Option value="unUsed">{{$t('Unused')}}</Option>
              </Select>
            </Col>
          </Row>
          <Row
            class="rowlist"
            v-show="this.selecteDisk !== 'unUsed'"
          >
            <Col span="24">
              <Col span='7'>{{$t('isFormat')}}：</Col>
              <Select
                v-model="selecteFormatValue"
                class="topColumn"
                style="width:200px;"
                :placeholder="this.$t('pleaseInput')"
              >
                <Option value="yes">{{$t('Yes')}}</Option>
                <Option value="no">{{$t('No')}}</Option>
              </Select>
            </Col>
          </Row>
          <Row
            v-show="this.selecteDisk === 'dataDisk'"
            class="rowlist"
          >
            <Col span="24">
              <Col span='7'>{{$t('MappingDiskSymbol')}}：</Col>
              <Select
                v-model="selecteDiskF"
                class="topColumn"
                style="width:200px;"
                :placeholder="this.$t('pleaseInput')"
              >
                <Option v-for="item in DiskSymbolList" :value="item.diskSymbol"   :key="item.value" :disabled="item.exist">
                      {{item.diskSymbol}}
                </Option>
              </Select>
            </Col>
          </Row>
          <Row
            class="rowlist"
            v-show="this.selecteDisk === 'dataDisk'"
          >
            <Col span="24">
              <Col span='7'>{{$t('ExtendedType')}}：</Col>
              <Select
                v-model="ExtendedType"
                class="topColumn"
                style="width:200px;"
                :placeholder="this.$t('pleaseInput')"
              >
                <Option value="0">{{$t('GameDisk')}}</Option>
                <Option value="1">{{$t('HotGameDisk')}}</Option>
                <Option value="2">{{$t('PrivateGameDisk')}}</Option>
              </Select>
            </Col>
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
      <div style="margin-top:20px;" >
        <Button type="primary" @click="handleSetCard" >{{$t('Save')}}</Button>
        <Button @click="handleResetCard" style="margin-left: 8px" >{{$t('cancelText')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  setDiskFunctionx,
  getServers,
  editServersNode,
  deleteserverx,
  getNetworkx,
  getDiskStatusx,
  setVdiskEthernetx,
  deleteserverConfig,
  RaidCreate,
  RaidRemove } from '@/api/wupan'
import { bytesToSize, bytesToRate } from '@/utils/index'
import { setDiskAttribute } from '@/api/sync'
import { setValue } from '@/api/common'
export default {
  name: 'DisklessServerListDetail',
  data () {
    return {
      masterIp: this.$store.state.app.masterip || '', // 服务器存储的
      currentPageServerip: '', // 当前页服务器ip
      CurrentPageserverInfo: [], // 当前页服务器信息
      loading: '', // 磁盘设置loading
      softConnectionShowup: false, // 打开软连接界面
      ExistsMatrixMember: [], // 已存在阵列成员列表
      matrix: [], // 阵列信息
      setspin: false, // 设置阵列成员的loading
      serverList: [], // 服务器列表
      DiskSettingDialog: false, // 磁盘设置中提示
      spinShow: false, // 加载动画
      isMaster: '', // 是否为主服务器
      isonline: '',
      selectedDisk: '', // 选择的磁盘信息
      selecteDiskF: '', // 映射盘符
      DiskSymbolList: [
        { diskSymbol: 'C:', value: '1' },
        { diskSymbol: 'D:', value: '2' },
        { diskSymbol: 'E:', value: '3' },
        { diskSymbol: 'F:', value: '4' },
        { diskSymbol: 'G:', value: '5' },
        { diskSymbol: 'H:', value: '6' },
        { diskSymbol: 'I:', value: '7' },
        { diskSymbol: 'J:', value: '8' },
        { diskSymbol: 'K:', value: '9' }
      ], // 盘符列表
      vol: [], // 已存在磁盘
      selecteDisk: 'imageDisk', // 选择的磁盘功能
      getCheckboxVal: [], // 勾选复选框值
      DiskSetDialog: false, // 磁盘设置弹窗
      selecteFormatValue: 'no', // 是否格式化
      ExtendedType: '0', // 扩展类型
      DiskData: {}, // 磁盘信息
      listStyle: { // 穿梭框样式
        width: '300px',
        height: '300px'
      },
      serverTableStructure: [ // 服务器表格结构
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
              case 'userDisk':
                return h('span', this.$t('userDisk'))
              case 'raidMember':
                return h('span', this.$t('ArrayMember'))
              default:
                return '-'
            }
          }
        },
        { title: '映射盘符',
          key: 'vol',
          align: 'center',
          minWidth: 80,
          renderHeader: (h, params) => { return h('span', this.$t('MappingDiskSymbol')) },
          render: (h, params) => {
            return h('span', params.row.vol || '-')
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
      diskInfo: [] // 磁盘信息类别
    }
  },
  created () {
    this.serverList = this.$route.query.serverList
    this.handleGetCurrentPageServerInfo()
    this.handleGetNetworkx(this.currentPageServerip)
    this.handleGetDiskStatusx(this.currentPageServerip)
  },
  methods: {
    handleChange1 (data, x, selected) {
      let _this = this
      let flagTip; let flag = false
      if (x === 'left') {
        flag = true
        flagTip = '将移除该阵列，请知晓您的操作'
      } else {
        flagTip = '将合并选择的成员，请知晓您的操作'
      }

      if (flag) {
        this.$Modal.confirm({
          title: this.$t('operationTip'),
          content: flagTip,
          onOk () {
            _this.$Modal.remove()
            _this.setspin = true
            let path
            selected.forEach(item => {
              path = item
              RaidRemove(path, _this.currentPageServerip).then(() => {
                _this.handleGetDiskStatusx(_this.currentPageServerip)
              }, (error) => {
                _this.$Message.success(_this.$t(`kxLinuxErr.${error}`))
                _this.handleGetDiskStatusx(_this.currentPageServerip)
              })
                .catch(() => {
                  _this.setspin = false
                })
                .finally(() => {
                  this.flag = false
                  _this.setspin = false
                })
            })
          }
        })
      } else {
        if (selected.length === 1) {
          _this.$Message.success(this.$t('AtLeastTwoDisks'))
          _this.setspin = false
        } else {
          this.$Modal.confirm({
            title: this.$t('operationTip'),
            content: flagTip,
            onOk () {
              _this.$Modal.remove()
              _this.setspin = true
              let y = []
              selected.forEach(item => {
                y.push(item)
              })
              RaidCreate(y, _this.currentPageServerip).then(() => {
                _this.handleGetDiskStatusx(_this.currentPageServerip)
              }, (error) => {
                _this.$Message.success(_this.$t(`kxLinuxErr.${error}`))
                _this.handleGetDiskStatusx(_this.currentPageServerip)
              }).finally(() => {
                _this.setspin = false
              })
            }
          })
        }
      }
    },
    /**
     * 获取映射盘符
     */
    handleGetAllServerDisks () {
      this.vol.forEach(item => {
        this.DiskSymbolList.forEach(itemx => {
          if (itemx.diskSymbol === item) {
            itemx.exist = true
          }
        })
      })
    },
    handleGetCurrentPageServerInfo () {
      var data = this.$route.query.data
      this.currentPageServerip = data.serverIp
      this.CurrentPageserverInfo.push(data)
      this.isMaster = this.CurrentPageserverInfo[0].isMaster
      this.isonline = this.CurrentPageserverInfo[0].online
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
        this.matrix = []
        this.diskInfo = resp.data.result.list || []
        this.vol = []
        this.diskInfo.forEach(item => {
          if (item.vol) {
            this.vol.push(item.vol)
          }
          item.size = bytesToSize(item.size)
          item.availableSize = bytesToSize(item.availableSize)
          let f = {}
          if (item.fun === 'unUsed') {
            f['key'] = item.path
            f['label'] = item.path
            f['isRaid'] = item.isRaid
            f['capacity'] = item.size
            // if (item.isRaid === '0') {
            this.matrix.push(f)
            // }
            if (item.isRaid === '1') {
              this.ExistsMatrixMember.push(f.label)
            }
          }
        })
      })
      that.spinShow = false
    },
    /**
     * 删除ip
     */
    handleSelect (data) {
      if (data === 'dataDisk') {
        let x = []
        x = this.DiskSymbolList.filter(item => {
          return !item.exist
        })
        if (x[0]) {
          this.selecteDiskF = x[0].diskSymbol
        }
        this.ExtendedType = '0'
      }
    },
    handleButtonDelete () {
      this.$Modal.confirm({
        title: this.$t('DeleteTip'),
        content: this.$t('DeleteDec'),
        okText: this.$t('Delete'),
        cancelText: this.$t('cancelText'),
        onOk: () => {
          deleteserverx(this.currentPageServerip, this.masterIp).then((resp) => {
            deleteserverConfig(this.currentPageServerip)
            this.$Message.success(this.$t('DeleteSucess'))
            this.$router.push({
              path: 'DisklessServerList'
            })
            if (this.currentPageServerip === this.masterIp) {
              let info = {
                key: 'master',
                value: ''
              }
              this.setCustomConfig(info)
            }
          }, (resp) => {
            this.$Message.success(this.$t(`kxLinuxErr.${resp}`))
          })
        }
      })
    },
    /**
     * 设置磁盘
     */
    handleSetCard () {
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
        path: this.selectedDisk.path, // 设备路径
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
            devicePath: this.selectedDisk.path,
            disk: this.selecteDiskF,
            extend: parseInt(this.ExtendedType)
          }
          setDiskAttribute(info).then((resp) => {
            this.$Message.success(this.$t(`ExtendedTypeSuccess`))
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
    ShowDiskPlan (data) {
      this.selectedDisk = data
      this.handleGetAllServerDisks() // 获取映射盘符
      this.selecteDiskF = data.vol
      this.ExtendedType = data.exttype
      this.selecteDisk = data.fun
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
      getServers(this.currentPageServerip).then((resp) => {
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
    async HandlechangeMaster () {
      let sucessflag = true
      for (let i = 0; i < this.serverList.length; i++) {
        await editServersNode(this.currentPageServerip, '1', '1', this.serverList[i].serverIp).then((resp) => {
          sucessflag = true
        }, (error) => {
          sucessflag = false
          console.log(error)
        })
      }
      if (sucessflag) {
        let info = {
          key: 'master',
          value: this.currentPageServerip
        }
        this.setCustomConfig(info)
        this.$store.dispatch('saveMaster', this.currentPageServerip || '')
        sucessflag = 0
      }
      setTimeout(() => {
        this.handleButtonRefresh()
      }, 1000)
      this.handleButtonRefresh()
    },
    /**
    记录主服务器ip
     */
    setCustomConfig (info) {
      let data = {
        key: info.key,
        value: info.value
      }
      setValue(data).then(res => {
        this.$store.dispatch('saveMaster', info.value)
      })
    },
    /*
    列表选择
    */
    listTypeChange (serverip) {
      getServers(this.masterIp).then((resp) => {
        this.CurrentPageserverInfo = resp.data.result.list.filter(item => { return item.serverIp === serverip })
        this.isMaster = this.CurrentPageserverInfo[0].isMaster
      })
      this.handleGetNetworkx(serverip)
      this.handleGetDiskStatusx(serverip)
    },
    handleDisk () {
      this.softConnectionShowup = true
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
.wrapper {
  display: flex;
}
ul,
li {
  list-style: none;
}
li {
  margin-left: 10px;
}
.left {
  flex: 1;
}
.ivu-divider-horizontal {
  margin: 15px 0;
  font-weight: bold;
}
.right {
  background: #f8fce5;
  border: 1px solid #ddd;
  padding: 8px;
  max-width: 260px;
  font-size: 14px;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>