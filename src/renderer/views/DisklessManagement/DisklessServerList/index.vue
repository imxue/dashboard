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
        :disabled="this.serverList.length === 0"
      >
        {{$t('Refresh')}}</Button>

        <Button
        type="primary"
        class="topColumn"
        @click="openMonute"
        :disabled="this.serverList.length === 0"
      >
        {{$t('Mount')}}</Button>
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
        <FormItem
          :label="$t('ServerIP')"
          prop="serverIP"
        >
          <Input
            ref="input"
            autofocus
            v-model="formValidate.serverIP"
            :placeholder="$t('pleaseInputServerIp')"
            :disabled="loadingBtn"
          />
        </FormItem>

        <FormItem
          :label="$t('ServerPW')"
          prop="password"
        >
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
    <Modal
        v-model="regModal"
        :title="this.$t('ObtainAuthorization')"
      >
    <div class="regWrapper">
  <Form :label-width="80">
    <FormItem  :label="this.$t('ID')" >
          <p style="font-size:14px"> 
          {{regInfo.id}}
          </p>
        </FormItem>
        <FormItem :label="this.$t('name')" >
          <p style="font-size:14px">
            {{regInfo.name}}
            </p>
        </FormItem>
        <FormItem  :label="this.$t('regType')">
          <p style="font-size:14px"> 
          {{regInfo.regType}}
          </p>
        </FormItem>
        <FormItem  :label="this.$t('pcCount')">
          <p style="font-size:14px"> 
          {{regInfo.pcCount}}
          </p>
        </FormItem>
        <!-- <FormItem label="hwid:" >
          <p style="font-size:14px"> 
          {{regInfo.hwid}}
          </p>
        </FormItem> -->
        <FormItem :label="this.$t('validDay')">
          <p style="font-size:14px">
          {{regInfo.validDay}}
          </p>
        </FormItem>
    </Form>
    </div>
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
  login,
  GetRegInfo
} from '@/api/wupan'
import { addMasterServer } from '@/api/localGame'
import { setValue, getMasterIp } from '@/api/common'
import { ipcRenderer } from 'electron'
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
      regInfo: '', // 注册信息
      spinShow: false,
      regModal: false,
      searchVal: '',
      modal4: false,
      loading: false,
      loadingBtn: false,
      serverPopup: false, // 服务器弹窗开关
      getCheckboxVal: [], // 勾选复选框值
      tableSelectVal: [],
      guid: '', // 服务器guid
      tempMasterIP: '',
      stateMpa: new Map(
        [['0', {
          text: this.$t('Offline'),
          color: '#999999'
        }], ['1', {
          text: this.$t('online'),
          color: '#0ecf1f'
        }], ['2', {
          text: this.$t('OnlineException'),
          color: '#f90'
        }]]
      ),
      tableColumns: [
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('CurrentStatus'))
          },
          key: 'online',
          maxWidth: 180,
          minWidth: 180,
          render: (h, params) => {
            let type = params.row.online
            let isMaster = params.row.isMaster
            if (isMaster === '1') {
              return h('div', [
                h('Tag', { props: { color: 'red' } }, this.$t('MasterIp')),
                h('span', { style: { color: this.stateMpa.get(type).color } }, this.stateMpa.get(type).text)
              ])
            }
            return h('span', { style: { color: this.stateMpa.get(type).color } }, this.stateMpa.get(type).text)
          }
        },
        {
          key: 'serverIp',
          maxWidth: 110,
          minWidth: 110,
          renderHeader: (h, params) => {
            return h('span', this.$t('ServerIP'))
          }
        },
        {
          key: 'dataVer',
          maxWidth: 140,
          minWidth: 140,
          renderHeader: (h, params) => {
            return h('span', this.$t('ServiceVersion'))
          }
        },
        {
          key: 'softVer',
          maxWidth: 110,
          minWidth: 110,
          renderHeader: (h, params) => {
            return h('span', this.$t('softVer'))
          }
        },
        {
          key: 'onlinePcs',
          maxWidth: 110,
          minWidth: 110,
          renderHeader: (h, params) => {
            return h('span', this.$t('onlinePcs'))
          },
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'text'
              },
              style: {
                color: 'green'
              },
              on: {
                click: () => {
                  this.HandleGoPc(params.row.serverIp)
                }

              }
            }, params.row.onlinePcs)
          }
        },
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('operation'))
          },
          key: 'operation',
          maxWidth: 500,
          minWidth: 500,
          render: (h, params) => {
            let a =
              h(
                'Button',
                {
                  props: { type: 'info' },
                  style: { marginRight: '10px' },
                  on: {
                    click: () => {
                      this.handleSeeDetail(params.row)
                    }
                  }
                },
                this.$t('View')
              )
            let b = h(
              'Button',
              {
                props: { type: 'info' },
                style: { marginLeft: '10px' },
                on: {
                  click: () => {
                    this.handleSeeRegInfo(params.row)
                  }
                }
              },
              this.$t('checkInfo')
            )
            let c = h(
              'Button',
              {
                props: { type: 'info' },
                on: {
                  click: () => {
                    this.handleSeeServeHanrdInfo(params.row)
                  }
                }
              },
              this.$t('ServerHardInfo')
            )
            if (params.row.isMaster === '1') {
              return [a, c, b]
            } else {
              return [a, c]
            }
          }
        },
        {
          key: '',
          title: ' '
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
      },
      RegInfo: {

      }
    }
  },
  created () {
    this.getTableData()
  },
  computed: {
    ...mapState({
      masterIp: state => state.app.masterip // 主服务器
    })
  },
  methods: {

    openMonute () {
      ipcRenderer.sendSync('cmd', { mount: 'diskmappingtools.exe' })
    },
    async  handleSeeServeHanrdInfo (row) {
      try {
        // let resp = await GetServerHardInfo(row.serverIp)
        this.$router.push({
          path: 'ServerHardInfo',
          query: { serverIp: row.serverIp }
        })
      } catch (error) {
        this.$Message.error({
          content: this.$t(error)
        })
      }
    },
    async handleSeeRegInfo () {
      this.regModal = true
      try {
        let barid = this.$store.state.app.barinfo.bar_id.toString()
        let resp = await GetRegInfo(barid, this.masterIp)

        if (resp.data.result.regStat === '1') {
          this.$store.dispatch('savereginfo', resp.data.result)
          this.regInfo = resp.data.result
        } else {
          this.$Message.warning({
            content: this.$t('ObtainAuthorizationFail')
          })
          this.$router.push({
            path: '/login'
          })
        }
      } catch (error) {
        this.$Message.warning({
          content: this.$t('ObtainAuthorizationFail')
        })
      }
    },
    async getTableData () {
      this.loading = true
      let ip = await this.HandleMasterIp()
      if (ip && ip !== -1) {
        await addMasterServer(ip)
        let isMasterip = await this.checkIpisMaster(ip)
        if (isMasterip !== -1) {
          if (isMasterip) {
            let List = await this.getMasterList(ip)
            if (List !== -1) {
              this.serverList = List
            } else {
              this.HandleAddServerx(ip, ip)
            }
          } else {
            let Masterip = await this.getMasteripByServerList(ip)
            if (Masterip !== -1 && Masterip) {
              this.$store.dispatch('SetMasterip', { key: 'masterip', value: Masterip })
              let List = await this.getMasterList(ip)
              if (List !== -1) {
                this.serverList = List
              } else {
                this.HandleAddServerx(Masterip, Masterip)
              }
            } else {
              await this.clearServerConfig(ip)
              this.HandleAddServerx(Masterip, Masterip)
              await addMasterServer(Masterip)
            }
          }
        } else {
          this.serverList = [
            {
              online: '0',
              serverIp: ip,
              isMaster: ''
            }
          ]
        }
      }
      this.loading = false
      await addMasterServer(ip)
    },

    /** 检查ip是否为主服务器
     * @returns true 是
     * @returns false 否
     * @returns -1 error
     */
    async checkIpisMaster (ip) {
      try {
        let resp = await getServersNode(ip)
        if (resp.data.result.isMaster === '1') {
          this.$store.dispatch('saveMaster', resp.data.result.masterIp || '')
          return Promise.resolve(true)
        } else {
          return Promise.resolve(false)
        }
      } catch (e) {
        return -1
      }
    },

    /**
     * @returns 主副器ip 空 为 ''
     * @returns -1 error
     */
    async HandleMasterIp () {
      try {
        let resp = await getMasterIp()
        // this.$store.dispatch('GetMasterip')
        return resp.data.value && Promise.resolve(resp.data.value)
      } catch (e) {
        return -1
      }
    },
    /** 清除服务器信息
     * @returns -1 error
     */
    async clearServerConfig (ip) {
      try {
        let resp = await deleteserverConfig(ip)
        return resp.data.value && Promise.resolve(resp.data.value)
      } catch (e) {
        return -1
      }
    },
    /** 获取主服务器列表
     * @returns -1 error
     */
    async getMasterList (ip) {
      try {
        let respList = await getServers(ip)
        let serverList = respList.data.result.list ? respList.data.result.list : []
        return Promise.resolve(serverList)
      } catch (e) {
        return -1
      }
    },
    /** 从当前服务器列表中获取主服务器ip
     * @returns -1 error
     */
    async getMasteripByServerList (ip) {
      try {
        let respList = await getServers(ip)
        let serverList = respList.data.result.list ? respList.data.result.list : []

        let MasterIp = serverList.filter(item => {
          return item.isMaster === '1' && item.serverIp
        })
        return Promise.resolve(MasterIp[0].serverIp)
      } catch (e) {
        return -1
      }
    },
    /**
     * 从主服务器获取列表
     */
    async getListByMasterip (ip) {
      try {
        let respList = await getServers(ip)
        let serverList = respList.data.result.list ? respList.data.result.list : []
        return Promise.resolve(serverList)
      } catch (e) {
        return -1
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
        return Promise.reject(error)
      }
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
        await addMasterServer(masterip)
        if (!this.$store.state.app.masterip) {
          let resp = await this.HandleSetCheck(masterip)
          console.log(resp)
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    /**

      持久化信息
    */
    async setCustomConfig (info) {
      setValue({ key: info.key, value: info.value }).then(res => {
        this.$store.dispatch('saveMaster', info.value)
        return Promise.resolve(true)
      })
    },
    handleSearch () {
      this.loading = true
      var arr = this.serverList
      this.searchVal && setTimeout(() => {
        this.loading = false
        var newArr = arr.filter(item => item.serverIp === this.searchVal)
        this.serverList = newArr
      }, 1000)
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
    handleButtonRefesh () {
      this.loading = true
      this.getTableData()
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
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.loadingBtn = true
          try {
            let OptServerip = this.formValidate.serverIP
            let optPassword = this.formValidate.password
            await this.HandleLogin(optPassword, OptServerip)

            var resplist = await this.HandleGetServerList(OptServerip)
            if (resplist.length === 0) {
              // 服务器没有额外的类表
              if (this.masterIp) {
                await addMasterServer(this.masterIp)
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
                await addMasterServer(this.masterIp)
                await this.HandleAddServerx(OptServerip, this.masterIp)
              } else {
                // 不存在主服务
                let masterServer = resplist.filter(item => { return item.isMaster === '1' })
                if (masterServer) {
                  await this.setCustomConfig({ key: 'master', value: masterServer[0].serverIp })
                  await addMasterServer(masterServer[0].serverIp)
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
      })

      this.loading = false
    },
    /**
        睡眠
    */
    sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time))
    },
    HandleGoPc (ip) {
      this.$router.push({
        path: '/ClientManagement',
        query: { ip }
      })
    },
    /**
        登录
    */
    async HandleLogin (password, ip) {
      try {
        await login(password, ip)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async HandleSetCheck (ip) {
      return new Promise(async (resolve, reject) => {
        try {
          let resp = await GetRegInfo(this.$store.state.app.barinfo.bar_id, ip)
          if (resp.data.result.regStat !== '1') {
            // eslint-disable-next-line prefer-promise-reject-errors
            return reject('99')
          } else {
          // 授权失败
            return resolve(resp)
          }
        } catch (error) {
          return reject(error)
        }
      })
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

<style lang="scss" scoped>
.regWrapper .ivu-form-item {
   margin-bottom: 0px !important;
}
.regWrapper .ivu-form-item-content {
   font-size: 14px !important;
}
.regWrapper  {
   font-size: 14px !important;
}
</style>