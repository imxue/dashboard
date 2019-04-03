<template>
  <div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="topItem">
      <Button class="topColumn" @click="handleButtonBack">返回列表</Button>

      <!-- <Button type="primary" class="topColumn" @click="handleButtonStandby">待机模试</Button>
      <Button type="primary" class="topColumn" @click="handleButtonWorking">施工模式</Button>
      <Divider type="vertical"/>
      <Button type="primary" class="topColumn" @click="handleButtonOff">关机</Button>
      <Button type="primary" class="topColumn" @click="handleButtonRestart">重启</Button>
      <Divider type="vertical"/>
      <Button type="primary" class="topColumn" @click="handleButtonRemote">远程</Button>
      <Button type="primary" class="topColumn" @click="handleButtonUpgrade">升级</Button> -->
      <!-- <Divider type="vertical"/> -->
      <!-- <Button type="error" class="topColumn" @click="handleButtonDelete(tempMasterServerIp)">删除</Button> -->
            <Button type="error" class="topColumn" @click="handleButtonDelete(ServerIp)">删除</Button>
      <Divider type="vertical"/>
      <Button type="primary" class="topColumn" @click="handleButtonSetSever">设置为主服务器</Button>
      <Button type="primary" class="topColumn" @click="handleButtonRefresh">刷新</Button>
    </div>
    <Table border :columns="tableColumns1" :data="tableData1"></Table>
    <Row style="margin:20px 0;">
      <h3>网卡设置</h3>
      <Divider />
      <Button type="primary" class="topColumn" @click="handleLoadNIC">设置负载网卡</Button>
      <!-- <Modal
        title="设置负载网卡"
        v-model="showPopup01"
        footer-hide
        width= "500"
        class-name="vertical-center-modal">
        <Row>
            <i-col span="3">请选择：</i-col>
            <i-col span="16">
              <Select v-model="dataload" clearable class="topColumn" style="width:200px;" placeholder="---请选择磁盘作用---">
                <Option value="启用"></Option>
                <Option value="禁用"></Option>
              </Select>
            </i-col>
          </Row>
          <div class="buttonList" style="margin-top:20px;">
              <Button type="primary" @click="handleSetCard">保存</Button>
              <Button @click="handleResetCard" style="margin-left: 8px">取消</Button>
          </div>
      </Modal> -->
    </Row>
    <Table border ref="selection" :columns="tableColumns2" :data="tableData2" @on-selection-change="handleCheckBox"></Table>
    <Row style="margin:20px 0;">
      <h3>磁盘设置</h3>
      <Divider />
      <!-- <Button type="primary" class="topColumn" @click="handleButtonAdd">设置磁盘作用</Button> -->
    </Row>
    <Row>
    <Table border :columns="tableColumns3" :data="tableData3"></Table>
    </Row>
    <div class="dig">
     <Modal
        v-model="modal6"
        :loading="loading"
        footer-hide
        :styles="{top: '400px'}"
        :closable="false"
        >
        <p class="textAlign">设置磁盘中</p>
    </Modal>
    </div>
    
      <Modal
        title="磁盘设置"
        v-model="showPopup02"
        width= "500"
        footer-hide>
          <Row class="rowlist">
            <i-col span="4">设备路径：</i-col>
            <i-col span="16">{{rowData.path}}</i-col>
          </Row>
          <Row class="rowlist">
            <i-col span="4">磁盘大小：</i-col>
            <i-col span="16">{{rowData.size}} KB</i-col>
          </Row>
          <Row class="rowlist">
            <i-col span="4">可用空间：</i-col>
            <i-col span="16">{{rowData.availableSize}} KB</i-col>
          </Row>
          <Row class="rowlist">
            <i-col span="4">磁盘作用：</i-col>
            <i-col span="20">
              <Select v-model="selecteDisk" @on-change="handleSelect" clearable class="topColumn" style="width:200px;" placeholder="---请选择负载网卡---">
                <Option value="imageDisk">镜像盘</Option>
                <Option value="dataDisk">数据盘</Option>
                <Option value="writebackDisk">回写盘</Option>
                <Option value="unUsed">未使用</Option>
              </Select>
            </i-col>
          </Row>
          <Row v-show="this.selecteDisk === 'writebackDisk' || this.selecteDisk === 'imageDisk'" class="rowlist">
            <i-col span="4">是否格式化：</i-col>
            <i-col span="20">
              <Select v-model="selecteFormatValue" clearable class="topColumn" style="width:200px;" placeholder="---请选择---">
                <Option value="yes">是</Option>
                <Option value="no">否</Option>
              </Select>
            </i-col>
          </Row>
          <Row v-show="this.selecteDisk === 'dataDisk'" class="rowlist">
            <i-col span="4">映射盘符：</i-col>
            <i-col span="20">
              <Select v-model="selecteDiskF" clearable class="topColumn" style="width:200px;" placeholder="---请选择---">
                <Option value="E">E</Option>
                <Option value="F">F</Option>
                <Option value="G">G</Option>
                <Option value="H">H</Option>
                <Option value="I">I</Option>
              </Select>
            </i-col>
          </Row>
          <div class="buttonList" style="margin-top:20px;">
              <Button type="primary" @click="handleSetCard" :loading="loading">保存</Button>
              <Button @click="handleResetCard" style="margin-left: 8px">取消</Button>
          </div>
      </Modal>
  </div>
</template>

<script>
  import { getNetwork, getDiskStatus, setDiskFunction, addServers, editServersNode, deleteserver, setVdiskEthernet } from '@/api/wupan'
  import { formatSize, bytesToSize, bytesToRate } from '@/utils/index'
  export default {
    name: 'subType1-detail',
    data () {
      return {
        modal6: false,
        spinShow: false, // 加载动画
        tempMasterServerIp: '', // 主服务器Ip
        isMaster: '', // 是否为主服务器
        rowData: '',
        ServerIp: '',
        selecteDiskF: '',
        selecteDisk: '',
        getCheckboxVal: [], // 勾选复选框值
        showPopup02: false,
        selecteFormatValue: 'no',
        tableColumns1: [
          // { type: 'selection', width: 60, align: 'center' },
          {
            title: '服务状态',
            key: 'online',
            render: (h, params) => {
              let type = params.row.online
              let isMaster = params.row.isMaster
              if (isMaster === '1') {
                switch (type) {
                  case '0':
                    return h('div', [h('span', { style: { color: '#999999' } }, '离线'), h('Tag', { props: { color: 'red' } }, '主服务器')])
                  case '1':
                    return h('div', [h('span', { style: { color: '#0ecf1f' } }, '在线'), h('Tag', { props: { color: 'red' },
                      style: {
                        marginLeft: '8px'
                      } }, '主服务器')])
                  case '2':
                    return h('div', [h('span', { style: { color: '#f90' } }, '在线异常'), h('Tag', { props: { color: 'red' } }, '主服务器')])
                  default:
                    return '-'
                }
              } else {
                switch (type) {
                  case '0':
                    return h('span', { style: { color: '#999999' } }, '离线')
                  case '1':
                    return h('span', { style: { color: '#0ecf1f' } }, '在线')
                  case '2':
                    return h('span', { style: { color: '#f90' } }, '在线异常')
                  default:
                    return '-'
                }
              }
            }
          },
          { title: '服务器IP', key: 'serverIp' },
          // { title: '模式', key: 'mode' },
          // { title: '当前带机数', key: 'number' },
          // { title: '系统负载', key: 'systemLoad' },
          // { title: '网卡状态', key: 'networkCard' },
          // { title: '硬盘状态', key: 'diskState' },
          // { title: '固件版本', key: 'firmwareVersion' },
          { title: '服务版本', key: 'dataVer' }
        ],
        tableData1: [],
        tableColumns2: [
          { type: 'selection', width: 60, align: 'center' },
          {
            title: '状态',
            key: 'linkStatic',
            disabled: 'true',
            render: (h, params) => {
              let type = params.row.linkStatic
              switch (type) {
                case 'offline':
                  return h('span', { style: { color: '#999999' } }, '离线')
                case 'online':
                  return h('span', '在线')
                default:
                  return '-'
              }
            }
          },
          {
            title: '数据负载',
            key: 'vdiskSet',
            render: (h, params) => {
              let type = params.row.vdiskSet
              switch (type) {
                case 'yes':
                  return h('span', { style: { color: '#f6521f' } }, '是')
                case 'no':
                  return h('span', '否')
                default:
                  return '-'
              }
            }
          },
          { title: '网络设备名', key: 'name' },
          { title: 'IP地址', key: 'ip' },
          // { title: '当前工况 MB/s', key: 'linkRate' },
          // { title: '上行流量 KB/s', key: 'sendRate' },
          // { title: '下行流量 KB/s', key: 'recvRate' },
          {
            title: '网卡速率',
            key: 'linkRate',
            render: (h, params) => {
              var a = params.row.linkRate / 1000 + ' G'
              return h('span', a)
            }
          },
          {
            title: '上行流量',
            key: 'sendRate',
            render: (h, params) => {
              var a = formatSize(params.row.sendRate)
              return h('span', a)
            }
          },
          {
            title: '下行流量',
            key: 'recvRate',
            render: (h, params) => {
              var a = formatSize(params.row.recvRate)
              console.log('下行流量')
              console.log(formatSize(params.row.recvRate))
              console.log('下行流量')
              return h('span', a)
            }
          },
          {
            title: '累计发送',
            key: 'sendTotal',
            render: (h, params) => {
              var a = formatSize(params.row.sendTotal)
              return h('span', a)
            }
          },
          {
            title: '累计接收',
            key: 'recvTotal',
            render: (h, params) => {
              var a = formatSize(params.row.recvTotal)
              return h('span', a)
            }
          }
        ],
        tableData2: [], // 网卡信息
        tableColumns3: [
          { title: '设备', key: 'path' },
          {
            title: '磁盘大小',
            key: 'size',
            render: (h, params) => {
              return h('span', bytesToSize(params.row.size))
            }
          },
          {
            title: '可用空间',
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
            title: '作用',
            key: 'fun',
            render: (h, params) => {
              let type = params.row.fun
              switch (type) {
                case 'osDisk':
                  return h('span', '系统盘')
                case 'imageDisk':
                  return h('span', '镜像盘')
                case 'dataDisk':
                  return h('span', '数据盘')
                case 'writebackDisk':
                  return h('span', '回写盘')
                case 'unUsed':
                  return h('span', '未使用')
                case 'raidMember':
                  return h('span', '阵列成员')
                default:
                  return '-'
              }
            }
          },
          { title: '映射盘符', key: 'mountVol' },
          {
            title: 'IO读速率',
            key: 'readRate',
            render: (h, params) => {
              return h('span', bytesToRate(params.row.readRate))
            }
          },
          {
            title: 'IO写速率',
            key: 'writeRate',
            render: (h, params) => {
              return h('span', bytesToRate(params.row.writeRate))
            }
          },
          {
            title: '累计IO读取',
            key: 'readTotal',
            render: (h, params) => {
              return h('span', bytesToSize(params.row.readTotal))
            }
          },
          {
            title: '累计IO写入',
            key: 'writeTotal',
            render: (h, params) => {
              //  return h('span', bytesToSize(params.row.writeRate))
              return h('span', bytesToSize(params.row.writeTotal))
            }
          },
          // { title: '累计IO写入', key: 'writeTotal' },
          { title: '健康度', key: 'isHealth' },
          { title: '操作',
            key: 'operation',
            width: 140,
            align: 'center',
            render: (h, params) => {
              let a = h('Button', {
                props: { type: 'info', ghost: true },
                on: { click: () => { this.handleSetDisk(params.row) } }
              }, '设置磁盘作用')
              let b = h('Button', {
                props: { type: 'info', disabled: true }
              }, '设置磁盘作用')
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
      this.handleGetNetwork()
      this.handleGetDiskStatus()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleGetServerInfo () {
        var data = this.$route.query.data
        //  this.tableData1.push(data)
        this.tableData1.push(data)
        this.isMaster = this.tableData1[0].isMaster
      },
      /**
       * 获取网卡信息
       */
      handleGetNetwork () {
        getNetwork().then((a) => {
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
      handleGetDiskStatus () {
        let that = this
        getDiskStatus().then((a) => {
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
          title: '删除警告',
          content: '<p>后果很严重</p>',
          okText: '删除',
          onOk: () => {
            this.$Message.info('Clicked ok')
            deleteserver(ip).then(() => {
              this.$Message.success('删除成功')
              this.$router.push({
                path: 'subType1-1'
              })
            })
          },
          cancelTexxt: '取消'
        })
      },
      handleButtonBack () {
        this.$router.push({
          path: 'subType1-1'
        })
      },
      handleButtonSetSever () {
        // 若当前服务器为主服务器， 提示'当前服务器为主服务器'

        if (this.$route.query.tempMasterServerIp && this.tempMasterServerIp === this.rowData.serverIP) {
          this.$Message.info('当前服务器为主服务器')
        } else {
          // 提交data:
          // 1.先提交到 addServers，将当前serverIp设为mastServerIp， 然后再将之前的mastServerIp设置为从服务器 editServersNode
          // serverIp, guid
          addServers(this.rowData.serverIp, this.rowData.guid).then((a) => {
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
        editServersNode(this.tempMasterServerIp, '1', '1', this.rowData.serverIp).then((a) => {
          if (a.data.error === null) {
            this.$Message.sucess('设置成功')
          } else {
            this.$Message.error(a.data.error)
          }
        })
      },
      handleSetCard () {
        this.showPopup02 = false
        this.modal6 = true
        this.spinShow = true
        // path, diskFunctionType, cacheSizeMB, isFormat, volume
        setDiskFunction(this.rowData.path, this.selecteDisk, '512', this.selecteFormatValue, this.selecteDiskF).then((a) => {
          // var result = a.data.result
          if (a.data.error === null) {
            this.modal6 = false
            this.handleGetDiskStatus() // 刷新列表
          } else {
            this.$Message.error(a.data.error)
          }
          this.spinShow = false
        })
      },
      handleResetCard () {
        this.showPopup02 = false
      },
      /**
       * 设置负载网卡
       */
      handleLoadNIC () {
        this.spanShow = true
        setVdiskEthernet(this.getCheckboxVal).then(() => {
          this.spanShow = false
          this.$Notice.success({
            title: '设置负载网卡成功'
          })
          this.handleGetNetwork()
        })
      },
      handleSetDisk (index) {
        this.$messager.alert({
          title: 'Info',
          icon: 'info',
          msg: 'Here is a info message!'
        })
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
        this.handleGetNetwork()
        this.handleGetDiskStatus()
      }
    }
  }
</script>

<style scoped>

  .topColumn{ float: none;}
  .ivu-divider-vertical{margin-left: -2px;}
  .ivu-divider{background-color: #b0b0b0;}
  .ivu-modal-body {padding-left: 50px;}
  h3{ margin-bottom:-20px;}
  .rowlist { height: 30px; line-height: 30px; width: 100%; margin-bottom: 10px;}
  .textAlign{
    text-align: center;
    font-size: 14px;
    margin:-10px;
  }
</style>

