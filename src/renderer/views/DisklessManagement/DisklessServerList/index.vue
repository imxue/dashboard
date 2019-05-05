<template>
  <div>
     <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="topItem">
      <Input class="topColumn" v-model="searchVal" search :enter-button="$t('Search')" @on-search="handleSearch"  :placeholder="$t('pleaseInputServerIp')" style="width: 200px;" />
      <Button type="primary" class="topColumn" @click="handleButtonAdd" :disabled="loading">{{$t('AddServer')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonRefesh" :disabled="refesh">{{$t('Refresh')}}</Button>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonRemote">远程部署</Button> -->
    </div>
    <!-- table -->
    <Table :loading="loading" border stripe ref="selection" :columns="tableColumns" :data="serverList" @on-selection-change="handleCheckBox" @on-row-dblclick="handleSeeDetail" :no-data-text="this.$t('Nodata')"></Table>
    <Modal
      :title="$t('AddServer')"
      v-model="showPopup"
      width= "500"
      footer-hide>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem :label="$t('ServerIP')" prop="serverIP">
<<<<<<< HEAD
          <Input @on-change='ResetError' v-model="formValidate.serverIP" :placeholder="$t('pleaseInputServerIp')"  :disabled="loadingBtn"/>
=======
          <Input @on-change='ResetError' v-model="formValidate.serverIP" :placeholder="$t('pleaseInputServerIp')" />
>>>>>>> onlydiskLessy
        </FormItem>   
        
        <FormItem :label="$t('ServerPW')" prop="password">
            <div class="ivu-form-item-error-tip" v-if="NetWork">{{$t("NetworkError")}}</div>
          <Input type="password" v-model="formValidate.password" :placeholder="$t('pleaseInputServerPW')"  :disabled="loadingBtn" />
        </FormItem>
        <FormItem class="buttonList">
             <Button type="primary" @click="handleAddServer('formValidate')" :loading='loadingBtn'>{{$t("Save")}}</Button>
             <Button @click="handleAddReset('formValidate')" style="margin-left: 8px">{{$t("cancelText")}}</Button>
            
        </FormItem>
      </Form>
     </Modal>
    <Row style="margin-top:10px; ">
    </Row>
    <Modal
        v-model="modal4"
        title="this.$t('Theservermayalreadybelongtoanothernode')"
        ok-text="OK"
        @on-ok="remove"
        cancel-text="Cancel">
        <p>{{$t("Needtocleartheinformationcontinue")}}</p>
    </Modal>
  </div>
</template>

<script>
  import { addServersx, getServersNode, editServersNode, getServersx, deleteserverConfig } from '@/api/wupan'
  // import Cookies from 'js-cookie'
export default {
    name: 'subType1-1',
    data () {
      return {
        NetWork: false,
        spinShow: false,
        searchVal: '',
        modal4: false,
        loading: false,
        loadingBtn: false,
        showPopup: false,
        tempMasterServerIp: '',
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        tableColumns: [
          // { type: 'selection', width: 60, align: 'center' },
          {
            renderHeader: (h, params) => { return h('span', this.$t('CurrentStatus')) },
            key: 'online',
            render: (h, params) => {
              let type = params.row.online
              let isMaster = params.row.isMaster
              if (isMaster === '1') {
                switch (type) {
                  case '0':
                    return h('div', [h('span', { style: { color: '#999999' } }, this.$t('Offline')), h('Tag', { props: { color: 'red' } }, this.$t('MasterIp'))])
                  case '1':
                    return h('div', [h('span', { style: { color: '#0ecf1f' } }, this.$t('online')), h('Tag', { props: { color: 'red' },
                      style: {
                        marginLeft: '8px'
                      } }, this.$t('MasterIp'))])
                  case '2':
                    return h('div', [h('span', { style: { color: '#f90' } }, this.$t('OnlineException')), h('Tag', { props: { color: 'red' } }, this.$t('MasterIp'))])
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
          { key: 'dataVer', renderHeader: (h, params) => { return h('span', this.$t('ServiceVersion')) } },
          { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            key: 'operation',
            render: (h, params) => {
              let a = h('Button', {
                props: { type: 'info', ghost: true },
                on: { click: () => { this.handleSeeDetail(params.row) } }
              }, this.$t('View'))
              return a
            }
          }
        ],
        serverList: [],
        formValidate: { serverIP: '', password: '' },
        ruleValidate: {
          serverIP: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          password: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }]
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
        var arr = this.serverList
        setTimeout(() => {
          this.loading = false
          var newArr = arr.filter(item => item.serverIp === this.searchVal)
          // console.log('newArr::' + JSON.stringify(newArr))
          this.serverList = newArr
        }, 1000)
      },
      ResetError () {
        this.NetWork = false
      },
      /**
       * 清除服务器信息
      */
      remove () {
        deleteserverConfig(this.formValidate.serverIP).then(() => {
          this.modal4 = false
          this.handleAddServer('formValidate')
        })
      },
      /*
        获取列表
      */
      handleGetServerList () {
        this.loading = true
        let d = localStorage.getItem('masterip')
        if (d) {
          getServersx(d).then((a) => {
            this.spinShow = false
            var datalist = a.data.result.list
            if (datalist && a.data.error === null) {
              this.spinShow = false
              this.loading = false
              this.serverList = datalist
              this.loading = false
              this.handleGetCurrMasterServerIp(datalist)
            } else {
              localStorage.removeItem('masterip')
              this.$Message.error(a.data.Msg)
            }
          }, () => {
            let x = {
              'serverIp': localStorage.getItem('masterip'),
              'online': '0',
              'dataVer': '-'
            }
            this.serverList.push(x)
            this.loading = false
          })
        } else {
          this.loading = false
        }
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
      /**
       * 弹起添加服务器弹窗
       */
      handleButtonAdd (val) {
        this.showPopup = true
        this.NetWork = false
        this.loadingBtn = false
      },
      handleButtonRefesh (val) {
        this.spinShow = true
        this.handleGetServerList()
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
          path: 'DisklessServerDetail',
          query: { data: index, tempMasterServerIp: this.tempMasterServerIp }
        })
      },
      /**
       * 添加服务器
       */
      handleAddServer (name) {
        this.loadingBtn = true
        this.$refs[name].validate((valid) => {
          if (valid) {
            let cookiesMasterIp = localStorage.getItem('masterip')
            if (cookiesMasterIp) { // 本地保存
              getServersNode(this.formValidate.serverIP).then(res => {
                this.handleSubmitAddServer(res.data.result.guid, cookiesMasterIp, this.formValidate.serverIP)
              }, () => {
                this.loadingBtn = false
                this.NetWork = true
              })
              this.$store.dispatch('saveMaster', cookiesMasterIp)
            } else { // 没有
              getServersNode(this.formValidate.serverIP).then(res => {
                this.showPopup = false
  
                this.handleSubmitAddServer(res.data.result.guid, this.formValidate.serverIP, this.formValidate.serverIP)
              }, () => {
                this.loadingBtn = false
                this.NetWork = true
                this.showPopup = true
              })
              this.$store.dispatch('saveMaster', this.formValidate.serverIP)
            }
          } else {
            this.loadingBtn = false
          }
        })
      },
      handleSubmitAddServer (guid, masterIp, selfip) {
        // this.showPopup = false
        editServersNode(masterIp, selfip).then(() => {}, () => {
          this.$Message.sucess(this.$t('主服务器失效1'))
        }) // 设置主服务器
        addServersx(selfip, guid, masterIp).then((a) => {
          if (a.data.error === null) {
            this.loadingBtn = false
            localStorage.setItem('masterip', masterIp)
            this.showPopup = false
            this.handleGetServerList() // 刷新列表
            setTimeout(() => {
              this.handleGetServerList()
            }, 1000)
          } else {
            this.loadingBtn = false
            this.showPopup02 = true
            if (a.data.error.indexOf('重复添加') !== '-1') {
              this.modal4 = true
            }
          }
        }, () => {
          this.$Notice.error({
            title: '主服务器连接不上'
          })
          this.loadingBtn = false
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

