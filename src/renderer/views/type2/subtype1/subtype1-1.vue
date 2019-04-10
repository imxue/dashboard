<template>
  <div>
     <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="topItem">
      <Input class="topColumn" v-model="searchVal" search enter-button="搜索" @on-search="handleSearch" placeholder="请输入服务器IP..." style="width: 200px;" />
      <Button type="primary" class="topColumn" @click="handleButtonAdd">添加服务器</Button>
      <Button type="primary" class="topColumn" @click="handleButtonRefesh" :disabled="refesh">刷新</Button>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonRemote">远程部署</Button> -->
    </div>
    <!-- table -->
    <Table :loading="loading" border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox" @on-row-dblclick="handleSeeDetail"></Table>
    <Modal
      title="添加服务器"
      v-model="showPopup"
      width= "500"
      footer-hide
      class-name="vertical-center-modal">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="服务器IP:" prop="serverIP">
          <Input v-model="formValidate.serverIP" placeholder="请输入服务器IP"  />
        </FormItem>
        <FormItem label="服务器标识:" prop="password">
          <Input v-model="formValidate.password" placeholder="请输入服务器标识"  />
        </FormItem>
        <FormItem class="buttonList">
             <Button type="primary" @click="handleAddServer('formValidate')">保存</Button>
             <Button @click="handleAddReset('formValidate')" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
     </Modal>
    <Row style="margin-top:10px; ">
      <!-- <i-col span="4">资源：3000 &nbsp;&nbsp;&nbsp;&nbsp;已下载：1000</i-col> -->
      <!-- <i-col span="24"><Page :total="100"  style=" float:right;"/></i-col> -->
    </Row>
  </div>
</template>

<script>
  import { addServersx, getServersNode, editServersNode, getServersx } from '@/api/wupan'
  import Cookies from 'js-cookie'
export default {
    name: 'subType1-1',
    data () {
      return {
        spinShow: false,
        searchVal: '',
        loading: false,
        showPopup: false,
        tempMasterServerIp: '',
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        tableColumns: [
          // { type: 'selection', width: 60, align: 'center' },
          {
            title: '状态',
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
          { title: '服务版本', key: 'dataVer' },
          { title: '操作',
            key: 'operation',
            render: (h, params) => {
              let a = h('Button', {
                props: { type: 'info', ghost: true },
                on: { click: () => { this.handleSeeDetail(params.row) } }
              }, '查看')
              return a
            }
          }
        ],
        tableData: [],
        formValidate: { serverIP: '', password: '' },
        ruleValidate: {
          serverIP: [{ required: true, message: '不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '不能为空', trigger: 'blur' }]
        }
      }
    },
    created () {
      this.handleGetServerList()
    },
    computed: {
      refesh () {
        if (this.tempMasterServerIp) {
          return false
        } else {
          return true
        }
      }
    },
    methods: {
      handleSearch () {
        this.loading = true
        var arr = this.tableData
        setTimeout(() => {
          this.loading = false
          var newArr = arr.filter(item => item.serverIp === this.searchVal)
          // console.log('newArr::' + JSON.stringify(newArr))
          this.tableData = newArr
        }, 1000)
      },
      handleGetServerList () {
        let d = Cookies.get('masterip')
        getServersx(d).then((a) => {
          this.spinShow = false
          var datalist = a.data.result.list
          if (a.data.error === null) {
            this.tableData = a.data.result.list
            this.handleGetCurrMasterServerIp(datalist)
          } else {
            this.data = null
            this.$Message.error(a.data.Msg)
          }
        })
      },
      handleGetCurrMasterServerIp (data) {
        if (data === null) {
          this.tempMasterServerIp = ''
        } else {
          var arr = data.filter(item => item.isMaster === '1')
          this.tempMasterServerIp = arr[0].serverIp
        }
        this.spinShow = false
      },
      handleButtonAdd (val) {
        this.showPopup = true
      },
      handleButtonRefesh (val) {
        this.spinShow = true
        this.handleGetServerList()
        this.spinShow = false
      },
      handleButtonRemote (val) {
        alert('暂无')
      },
      handleCheckBox (arr) {
        var data = arr
        var list = []
        for (var i in arr) {
          list.push(data[i].id)
        }
        this.getCheckboxVal = list.join(',')
        // console.log(this.getCheckboxVal)
        return this.getCheckboxVal
      },
      handleSeeDetail (index) {
        this.$router.push({
          path: 'subType1-detail',
          query: { data: index, tempMasterServerIp: this.tempMasterServerIp }
        })
      },
      /**
       * 添加服务器
       */
      handleAddServer (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let cookiesMasterIp = Cookies.get('masterip')
            debugger
            if (cookiesMasterIp) {
              debugger
              getServersNode(this.formValidate.serverIP).then(res => {
                this.handleSubmitAddServer(res.data.result.guid, cookiesMasterIp, this.formValidate.serverIP)
              })
              return
            }
            // 获取服务器类别
            getServersx(this.formValidate.serverIP).then(res => {
              var datalist = res.data.result.list
              if (datalist) {
                let master = datalist.filter(item => { return item.isMaster === '1' })
                if (master.length !== 0) {
                  Cookies.set('masterip', master[0].serverIp)
                  getServersNode(this.formValidate.serverIP).then(res => {
                    this.handleSubmitAddServer(res.data.result.guid, master[0].serverIp, this.formValidate.serverIP)
                  })
                } else {
                  this.tempMasterServerIp = this.formValidate.serverIP
                  Cookies.set('masterip', this.tempMasterServerIp)
                  getServersNode(this.formValidate.serverIP).then(res => {
                    this.handleSubmitAddServer(res.data.result.guid, this.formValidate.serverIP, this.formValidate.serverIP)
                  })
                }
              } else {
                // 没有找到主服务器
                this.showPopup = false
                Cookies.set('masterip', this.formValidate.serverIP)
                getServersNode(this.formValidate.serverIP).then(res => {
                  this.handleSubmitAddServer(res.data.result.guid, this.formValidate.serverIP, this.formValidate.serverIP)
                })
              }
            })
          } else {
            this.showPopup = true
            this.$Message.error('验证失败')
          }
        })
      },
      handleSubmitAddServer (guid, masterIp, selfip) {
        // this.showPopup = false
        editServersNode(masterIp, selfip) // 设置主服务器
        addServersx(selfip, guid, masterIp).then((a) => {
          if (a.data.error === null) {
            this.$Message.success('添加成功')
            this.showPopup = false
            this.handleGetServerList() // 刷新列表
          } else {
            this.showPopup02 = true
            this.$Message.error(a.data.error)
          }
        })
      },
      handleAddReset (name) {
        this.showPopup = false
        this.$refs[name].resetFields()
      }
    }
  }
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
  .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: absolute;
        top: 50px;
        left: 223px;
        z-index: 8;
        width: 84%;
        height: 100%;
    }
</style>

