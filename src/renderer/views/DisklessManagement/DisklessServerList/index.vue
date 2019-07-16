<template>
  <div>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="topItem">
      <Input
        class="topColumn"
        v-model="searchVal"
        search
        :enter-button="$t('Search')"
        @on-search="handleSearch"
        :placeholder="$t('pleaseInputServerIp')"
        style="width: 200px;"
      />
      <Button
        type="primary"
        class="topColumn"
        @click="handleButtonAdd"
        :disabled="loading"
      >{{$t('AddServer')}}</Button>
      <Button
        type="primary"
        class="topColumn"
        @click="handleButtonRefesh"
        :disabled="refesh"
      >{{$t('Refresh')}}</Button>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonRemote">远程部署</Button> -->
    </div>
    <!-- table -->
    <Table
      :loading="loading"
      border
      stripe
      ref="selection"
      :columns="tableColumns"
      :data="serverList"
      @on-selection-change="handleCheckBox"
      @on-row-dblclick="handleSeeDetail"
      :no-data-text="this.$t('Nodata')"
    ></Table>
    <!-- 添加服务器 -->
    <Modal
      :mask-closable="false"
      :title="$t('AddServer')"
      v-model="serverPopup"
      width="500"
      footer-hide
    >
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="100"
        @keydown.native.enter.prevent="handleAddServer('formValidate')"
      >
        <FormItem :label="$t('ServerIP')" prop="serverIP">
          <Input
            ref="input"
            autofocus
            @on-change="ResetError"
            v-model="formValidate.serverIP"
            :placeholder="$t('pleaseInputServerIp')"
            :disabled="loadingBtn"
          />
        </FormItem>

        <FormItem :label="$t('ServerPW')" prop="password">
          <div class="ivu-form-item-error-tip" v-if="NetWork">{{$t("NetworkError")}}</div>
          <Input
            type="password"
            s
            v-model="formValidate.password"
            :placeholder="$t('pleaseInputServerPW')"
            :disabled="loadingBtn"
          />
        </FormItem>
        <FormItem class="buttonList">
          <Button
            type="primary"
            @click="handleAddServer('formValidate')"
            :loading="loadingBtn"
          >{{$t("Save")}}</Button>
          <Button
            @click="handleAddReset('formValidate')"
            style="margin-left: 8px"
          >{{$t("cancelText")}}</Button>
        </FormItem>
      </Form>
    </Modal>
    
    <Modal
      v-model="modal4"
      :title="this.$t('Theservermayalreadybelongtoanothernode')"
      ok-text="OK"
      @on-ok="removeAndServer"
      cancel-text="Cancel"
    >
      <p>{{$t("Needtocleartheinformationcontinue")}} + {{tempMasterIP}}</p>
    </Modal>
  </div>
</template>

<script>
import {
  addServersx,
  getServersNode,
  editServersNode,
  getServersx,
  deleteserverConfig,
  login
} from '@/api/wupan'
import { setValue, getValue } from '@/api/common'
export default {
  name: 'subType1-1',
  data () {
    var checkIpformat = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('Thisfieldcannotbeempty')))
      } else {
        let reg = '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.' +
                  '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
                  '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
                  '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$'
        let regexp = new RegExp(reg)
        if (regexp.test(value)) {
          callback()
        } else {
          return callback(new Error(this.$t('IPAddressIsIncorrect')))
        }
      }
    }
    var checkpasswd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('Thisfieldcannotbeempty')))
      }
      callback()
    }
    return {
      NetWork: false,
      spinShow: false,
      searchVal: '',
      modal4: false,
      loading: false,
      loadingBtn: false,
      serverPopup: false, // 服务器弹窗开关
      MasterServerIp: '', // 主服务器
      getCheckboxVal: [], // 勾选复选框值
      tableSelectVal: [],
      guid: '', // 服务器guid
      tempMasterIP: '',
      tableColumns: [
        // { type: 'selection', width: 60, align: 'center' },
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('CurrentStatus'))
          },
          key: 'online',
          render: (h, params) => {
            let type = params.row.online
            let isMaster = params.row.isMaster
            if (isMaster === '1') {
              switch (type) {
                case '0':
                  return h('div', [
                    h(
                      'span',
                      { style: { color: '#999999' } },
                      this.$t('Offline')
                    ),
                    h('Tag', { props: { color: 'red' } }, this.$t('MasterIp'))
                  ])
                case '1':
                  return h('div', [
                    h(
                      'span',
                      { style: { color: '#0ecf1f' } },
                      this.$t('online')
                    ),
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
                    h(
                      'span',
                      { style: { color: '#f90' } },
                      this.$t('OnlineException')
                    ),
                    h('Tag', { props: { color: 'red' } }, this.$t('MasterIp'))
                  ])
                default:
                  return '-'
              }
            } else {
              switch (type) {
                case '0':
                  return h(
                    'span',
                    { style: { color: '#999999' } },
                    this.$t('Offline')
                  )
                case '1':
                  return h(
                    'span',
                    { style: { color: '#0ecf1f' } },
                    this.$t('online')
                  )
                case '2':
                  return h(
                    'span',
                    { style: { color: '#f90' } },
                    this.$t('OnlineException')
                  )
                default:
                  return '-'
              }
            }
          }
        },
        {
          key: 'serverIp',
          renderHeader: (h, params) => {
            return h('span', this.$t('ServerIP'))
          }
        },
        {
          key: 'dataVer',
          renderHeader: (h, params) => {
            return h('span', this.$t('ServiceVersion'))
          }
        },
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('operation'))
          },
          key: 'operation',
          render: (h, params) => {
            let a = h(
              'Button',
              {
                props: { type: 'info', ghost: true },
                on: {
                  click: () => {
                    this.handleSeeDetail(params.row)
                  }
                }
              },
              this.$t('View')
            )
            return a
          }
        }
      ],
      serverList: [],
      formValidate: { serverIP: '', password: '' },
      ruleValidate: {
        serverIP: [
          {
            validator: checkIpformat,
            trigger: 'blur'
          }
        ],
        password: [
          {
            // required: true,
            validator: checkpasswd,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.handleGetServerList()
    this.getCustomConfig()
  },
  computed: {
    refesh () {
      if (this.MasterServerIp) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    getCustomConfig () {
      let info = {}
      info.key = 'master'
      getValue(info).then(resp => {
        this.$store.dispatch('saveMaster', resp.data.value || '') // 设置主服务器
      })
    },
    setCustomConfig (info) {
      let data = {
        key: info.key,
        value: info.value
      }
      setValue(data).then(res => {
        this.$store.dispatch('saveMaster', info.value)
      })
    },
    handleSearch () {
      this.loading = true
      var arr = this.serverList
      if (this.searchVal) {
        setTimeout(() => {
          this.loading = false
          var newArr = arr.filter(item => item.serverIp === this.searchVal)
          this.serverList = newArr
        }, 1000)
      }
    },
    ResetError () {
      this.NetWork = false
    },
    /**
     * 清除服务器信息
     */
    removeAndServer () {
      deleteserverConfig(this.formValidate.serverIP).then(() => {
        this.modal4 = false
        this.handleSubmitAddServer(this.guid, this.formValidate.serverIP, this.formValidate.serverIP)
      })
    },
    /**
     * 获取服务器列表
     */
    handleGetServerList () {
      let masterip = this.$store.state.app.masterip || ''
      if (!masterip) return
      this.loading = true
      let Serverinfo = {
        serverIp: masterip,
        online: '0',
        dataVer: '-'
      }
      getServersx(masterip).then(resp => {
        this.serverList = resp.data.result.list ? resp.data.result.list : ''
        if (this.serverList) {
          this.MasterServerIp = this.serverList.filter(item => {
            return item.isMaster === '1'
          })
          this.MasterServerIp = this.MasterServerIp[0].serverIp
        } else {
          getServersNode(this.$store.state.app.masterip).then(resp => {
            let guid = resp.data.result.guid
            this.handleSubmitAddServer(guid, this.$store.state.app.masterip, this.$store.state.app.masterip)
          })
        }
      }, () => {
        this.serverList.push(Serverinfo)
        this.$Notice.error({
          desc: this.$t(`kxLinuxErr.${44}`)
        })
      })
        .finally(() => {
          this.loading = false
          this.serverPopup = false
        })

      this.loading = false
    },
    /**
     * 弹起添加服务器弹窗
     */
    handleButtonAdd (val) {
      this.serverPopup = true
      this.NetWork = false
      this.loadingBtn = false
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
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
      return this.getCheckboxVal
    },
    handleSeeDetail (index) {
      this.$router.push({
        path: 'DisklessServerDetail',
        query: { data: index, MasterServerIp: this.MasterServerIp, serverList: this.serverList }
      })
    },
    /**
     * 添加服务器
     */
    handleAddServer (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.loadingBtn = true
          login(this.formValidate.password, this.formValidate.serverIP).then(resp => {
            this.HandleGetServerNode()
          }, (error) => {
            this.$Notice.error({
              desc: this.$t(`kxLinuxErr.${error}`)
            })
          }).finally(() => {
            this.loadingBtn = false
          })
        }
      })
    },
    /**
     * 获取服务器信息
     */
    HandleGetServerNode () {
      let localMasterIp = this.$store.state.app.masterip || ''
      let currentIp = this.formValidate.serverIP // 添加的服务器ip
      getServersNode(currentIp).then((resp) => {
        let guid = resp.data.result.guid
        let serverMasterIp = resp.data.result.masterIp // 该服务器的主服务ip
        this.guid = guid
        if (serverMasterIp) {
          if (serverMasterIp === currentIp) {
            if (localMasterIp) {
              this.handleSubmitAddServer(guid, localMasterIp, currentIp)
            } else {
              let info = {
                key: 'master',
                value: currentIp
              }
              this.setCustomConfig(info)
              this.serverPopup = false
              this.handleGetServerList()
            }
          } else {
            this.modal4 = true
          }
        } else {
          let masterip = localMasterIp || currentIp
          this.handleSubmitAddServer(guid, masterip, currentIp)
        }
      }, () => {
        this.$Notice.error({
          desc: this.$t(`获取服务器信息失败`)
        })
      })
    },
    /**
     * 设置服务器节点，并添加
     */
    handleSubmitAddServer (guid, masterIp, selfip) {
      // 设置服务器节点
      editServersNode(masterIp, 1, 1, selfip).then(
        (resp) => {
          addServersx(selfip, guid, masterIp).then(
            resp => {
              this.loadingBtn = false
              this.serverPopup = false
              this.$store.dispatch('saveMaster', masterIp || '')
              this.handleGetServerList()
              setTimeout(() => {
                this.handleGetServerList()
              }, 1000)
            }, error => {
              this.loadingBtn = false
              this.$Notice.error({
                desc: this.$t(`kxLinuxErr.${error}`)
              })
            }
          ).finally(() => {
            this.loadingBtn = false
            this.spinShow = false
          })
        }, (error) => {
          this.$Notice.error({
            desc: this.$t(`kxLinuxErr.${error}`)
          })
        }
      )
    },
    handleAddReset (name) {
      this.serverPopup = false
      this.$refs[name].resetFields()
      this.error = false
      this.$Modal.remove()
    }
  }
}
</script>

<style scoped>

.topColumn {
  float: left;
  margin-right: 10px;
}

/* .demo-spin-icon-load {
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
.demo-spin-col {
  height: 100px;
  position: absolute;
  top: 50px;
  left: 223px;
  z-index: 8;
  width: 84%;
  height: 100%;
} */
</style>

