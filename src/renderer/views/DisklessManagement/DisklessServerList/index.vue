<template>
  <div>
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
        :disabled="this.serverList.length === 0">
      {{$t('Refresh')}}</Button>
    </div>
    <!-- table -->
    <Table
      :loading="loading"
      border
      stripe
      ref="selection"
      :columns="tableColumns"
      :data="serverList"
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
            v-model="formValidate.serverIP"
            :placeholder="$t('pleaseInputServerIp')"
            :disabled="loadingBtn"
          />
        </FormItem>

        <FormItem :label="$t('ServerPW')" prop="password">
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
import { mapState } from 'vuex'
import {
  addServersx,
  getServersNode,
  editServersNode,
  getServers,
  deleteserverConfig,
  login
} from '@/api/wupan'
import { setValue, getMasterIp } from '@/api/common'
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
      spinShow: false,
      searchVal: '',
      modal4: false,
      loading: false,
      loadingBtn: false,
      serverPopup: false, // 服务器弹窗开关
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
    this.HandleGetMaster()
    this.HandleGetServerListOrAdd(this.masterIp)
  },
  computed: {
    ...mapState({
      masterIp: state => state.app.masterip // 主服务器
    })
  },
  methods: {
    /**
      获取主服务器
    */
    async HandleGetMaster () {
      try {
        let resp = await getMasterIp()
        this.$store.dispatch('saveMaster', resp.data.value || '')
      } catch (e) {
        this.notifyUserOfDiskError(36873)
      }
    },
    /**
        获取服务器列表
    */
    async HandleGetServerList (ip) {
      if (!ip) return
      try {
        let respList = await getServers(ip)
        let serverList = respList.data.result.list ? respList.data.result.list : []
        return Promise.resolve(serverList)
      } catch (error) {
        console.log(error)
      }
    },
    /**
        获取服务器列表 如果为空 则添加
    */
    async HandleGetServerListOrAdd (ip) {
      if (!ip) return
      try {
        let serverList = await this.HandleGetServerList(ip) || []
        if (serverList.length === 0) {
          this.HandleAddServerx(ip, this.masterIp || ip)
        } else {
          this.serverList = serverList
        }
      } catch (error) {
        console.log(error)
        this.loading = false
      }
      this.loading = false
    },

    /**
          添加服务器
    */
    async HandleAddServerx (selfip, masterip) {
      try {
        let respGuid = await getServersNode(selfip)
        let guid = respGuid.data.result.guid
        await editServersNode(masterip, 1, 1, selfip)
        await addServersx(selfip, guid, masterip)
      } catch (error) {
        console.log(error)
        debugger
        return Promise.reject(error)
      }
    },
    /**

      持久化信息
    */
    async setCustomConfig (info) {
      let data = {
        key: info.key,
        value: info.value
      }
      setValue(data).then(res => {
        this.$store.dispatch('saveMaster', info.value)
        return Promise.resolve(true)
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
    /**
     * 清除服务器信息
     */
    removeAndServer () {
      deleteserverConfig(this.formValidate.serverIP).then(() => {
        this.modal4 = false
      })
    },
    /**
     * 弹起添加服务器弹窗
     */
    handleButtonAdd (val) {
      this.serverPopup = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    /**
      刷新页面
    */
    handleButtonRefesh (val) {
      this.loading = true
      this.HandleGetServerListOrAdd(this.masterIp)
    },
    /**

      跳转到服务器详细信息页面
    */
    handleSeeDetail (data) {
      this.$router.push({
        path: 'DisklessServerDetail',
        query: { data, serverList: this.serverList }
      })
    },
    /**
     * 添加服务器
     */
    async handleAddServer (name) {
      let fail
      this.$refs[name].validate(valid => { if (valid) { fail = true } else { fail = false } })
      if (fail) {
        this.loadingBtn = true
        try {
          let OptServerip = this.formValidate.serverIP
          let optPassword = this.formValidate.password
          await this.HandleLogin(optPassword, OptServerip)
          var resplist = await this.HandleGetServerList(OptServerip)
          if (resplist.length === 0) {
            // 服务器没有额外的类表
            if (this.masterIp) {
              await this.HandleAddServerx(OptServerip, this.masterIp)
            } else {
              await this.HandleAddServerx(OptServerip, OptServerip)
              await this.setCustomConfig({ key: 'master', value: OptServerip })
            }
            await this.sleep(800)
            this.serverList = await this.HandleGetServerList(this.masterIp)
          } else {
            // 服务器有额外的类表
            if (this.masterIp) {
              // 已经存在主服务器
              await this.HandleAddServerx(OptServerip, this.masterIp)
            } else {
              // 不存在主服务
              let masterServer = resplist.filter(item => { return item.isMaster === '1' })
              if (masterServer) {
                await this.setCustomConfig({ key: 'master', value: masterServer[0].serverIp })
              } else {
                this.modal4 = true
              }
            }
            await this.sleep(800)
            this.serverList = await this.HandleGetServerList(this.masterIp)
          }
          this.serverPopup = false
        } catch (error) {
          const isObject = obj => obj === Object(obj)
          if (isObject(error)) {
            this.notifyUserOfDiskError(36)
          } else {
            this.notifyUserOfDiskError(error)
          }
        }
        await this.sleep(500)
        this.loadingBtn = false
      }
      this.loading = false
    },
    /**
        睡眠
    */
    sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time))
    },
    /**
        登录
    */
    async HandleLogin (password, ip) {
      try {
        let resp = await login(password, ip)
        return Promise.resolve(resp)
      } catch (error) {
        return Promise.reject(error)
      }
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