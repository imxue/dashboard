<template>
  <div>
    <Row class="header">
      <Col span="12">
        <AutoComplete
          icon="ios-search"
          class="topColumn"
          :placeholder="$t('pleaseInput') + $t('MachineName') + $t('-ip')"
          style="width: 200px;"
          @on-change="ChangeValue"
        />
        <Button type="primary" class="topColumn" @click="handleButtonRefresh">{{
          $t("Refresh")
        }}</Button>
        <Button type="primary" class="topColumn" @click="handleButtonAdd">{{
          $t("Add")
        }}</Button>
        <Button type="primary" class="topColumn" @click="handleButtonEdit">{{
          $t("Edit")
        }}</Button>
        <Button type="error" class="topColumn" @click="handAllDetele">{{
          $t("Delete")
        }}</Button>
      </Col>
    </Row>

    <!-- table -->
    <div class="footer">
      <Divider />
      <h4 style="margin-bottom:5px;">{{ $t("SuperWorkstation") }}</h4>
      <Table
        v-if="show"
        border
        :data="currentSuper"
        :columns="currentSuperCol"
        :loading="loading"
       
      ></Table>
      <Table
        v-if="!show"
        border
        :data="currentSuper"
        :columns="tableColumns1"
        :loading="loading"
      ></Table>
    </div>
    <h4 style="margin-bottom:5px;">{{ $t("ClientList") }}</h4>
    <div style="display:flex;flex-direction:column">
      <div style="display:flex;margin-bottom:10px;">
        <Button
          type="primary"
          class="topColumn"
          @click="handleButtonwakeup"
          :loading="loadingwakeup"
          >{{ $t("wakeup") }}</Button
        >
        <Button
          type="primary"
          class="topColumn"
          @click="handleButtonShutdown"
          :loading="loadingshoudown"
          >{{ $t("shoudown") }}</Button
        >
        <Button
          type="primary"
          class="topColumn"
          @click="handleButtonRestart"
          :loading="loadingRestart"
          >{{ $t("Restart") }}</Button
        >
      </div>
      <div ref="viewTable" class="box">
                <Table
          border
          stripe
          highlight-row
          ref="demox"
          :columns="tableColumns"
          :data="tableData"
          @on-sort-change="handleSort"
          @on-select="onSelect"
          @on-select-all="onSelectAll"
          @on-select-all-cancel="onSelectAllCancel"
          @on-select-cancel="onSelectCancel"
          @on-selection-change="onSelectionChange"
          :loading="loading"
        ></Table>
        <div ref="divScroll" id="divScroll"></div>
      </div>
    </div>

    <!-- 删除提示 -->
    <Modal
      v-model="showDeleteBox"
      :title="this.$t('DeleteTip')"
      @on-cancel="this.showDeleteBox = false"
    >
      <p>{{ $t("DeleteCurrentData") }}</p>
    </Modal>
    <Modal
      :title="this.$t('SetSuperWorkstation')"
      v-model="adddetail"
      footer-hide
      width="500"
    >
      <Form
        ref="formValidatex"
        :model="formValidatex"
        :rules="ruleValidatex"
        :label-width="100"
      >
        <FormItem :label="this.$t('Mirror')" prop="imglist">
          <Select
            v-model="formValidatex.imglist"
            :placeholder="this.$t('pleaseInput')"
          >
            <Option
              v-for="item in imglist"
              :value="item.name"
              :key="item.name"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem :label="this.$t('Configure')" prop="profileList">
          <Select
            v-model="formValidatex.profileList"
            :placeholder="this.$t('pleaseInput')"
          >
            <template v-if="profileList">
              <Option
                v-for="item in profileList"
                :value="item.name"
                :key="item.name"
                >{{ item.name }}</Option
              >
            </template>
          </Select>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            @click="handleSubmitx('formValidatex')"
            :loading="loadBtnSuper"
            >{{ $t("SetSuperWorkstation") }}</Button
          >
        </FormItem>
      </Form>
    </Modal>
    <Modal
      :title="this.$t('CancleSuperS')"
      v-model="cancleup"
      footer-hide
      :styles="{ top: '220px' }"
    >
      <Form
        ref="formValidate1"
        :model="formValidate1"
        :rules="ruleValidatex1"
        :label-width="100"
      >
        <FormItem :label="this.$t('operation')" prop="action">
          <Select v-model="formValidate1.action" @on-change="changeCommon">
            <Option value="apply">{{ $t("apply") }}</Option>
            <Option value="discard">{{ $t("cancelText") }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="this.$t('comment')" prop="comment" v-if="u">
          <Input v-model="formValidate1.comment" type="text" />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            @click="handleCancelaction('formValidate1')"
            :loading="loadBtnCancel"
            >{{ $t("Save") }}</Button
          >
          <Button
            @click="handleReset('formValidate1')"
            style="margin-left: 8px"
            >{{ $t("cancelText") }}</Button
          >
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="superEdit"
      :title="this.$t('ClientSetting')"
      @on-visible-change="test"
      footer-hide
    >
      <edit
        v-if="temp"
        v-bind:data1="xx"
        v-bind:clientMac="clientMacSet"
        v-bind:flag1="flag"
        v-bind:clientIp1="Iptemp"
        v-bind:pc1="PCtemp"
        v-on:childByValue="childByValue"
      />
    </Modal>
    <Modal
      v-model="EditModel"
      :title="this.$t('ClientSetting')"
      @on-ok="batchEdit"
    >
      <Form ref="formInline" :model="formInline">
        <FormItem :label="this.$t('Enable')" prop="disable" :label-width="110">
          <Select v-model="formInline.disable" :placeholder="$t('pleaseInput')">
            <Option
              v-for="item in enableList"
              :value="item.value"
              :key="item.label"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem
          :label="this.$t('StartupScenario')"
          prop="pcGp"
          :label-width="110"
        >
          <Select v-model="formInline.pcGp" :placeholder="$t('pleaseInput')">
            <Option
              v-for="item in pcGpList"
              :value="item.name"
              :key="item.label"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {
  setSuper,
  getSuper,
  setCancelSuper,
  batchSetPcConf
} from '@/api/client'
import {
  getPcListConfig,
  getImageListx,
  deletePcsConfigx,
  getPcGroupx,
  PcRemote,
  CtrlPcsConf
} from '@/api/wupan'
import edit from './ClientListAdd'
import { getMasterIp } from '@/api/common'
import { CreateAt, OnScroll } from '@/utils/index'
const { ipcRenderer } = require('electron')
export default {
  name: 'ClientList',
  // inject: ['reload'],
  data () {
    return {
      loadBtnSuper: false,
      loadBtnCancel: false,
      clientArray: '',
      clientList: [],
      flag: '',
      Pagelimit: 11,
      pageInfo: {
        count: 0,
        page_index: 1
      },
      pcGpList: '',
      EditModel: false,
      u: true,
      loading: false,
      selectMac: [],
      macArray: [], // 选择的mac地址
      clientIp: [], // 客户机ip
      Iptemp: '',
      PCtemp: '',
      clientMacSet: [], // mac 地址
      pc: [],
      show: false,
      xx: '', // temp
      list: [],
      exclientIp: [], // temp
      temp: false, //
      superEdit: false,
      modal1: false,
      currentSuperip: '',
      imglist: '',
      addedip: '',
      canceledip: '',
      max: 20000,
      selecteFormatValue: '',
      adddetail: false,
      popupVal: '',
      curroffset: 0,
      currlimit: 5,
      totalPageNumber: 0,
      pageSize: 10,
      currentPage: 1,
      cancleup: false,
      tableListPage: true,
      showPopup: false,
      showDeleteBox: false,
      getCheckboxVal: [], // 勾选复选框值
      tableSelectVal: [],
      tableData: [],
      tableDataList: [], // 批量编辑时，传值到下一页
      currentSuper: [], // 超级工作站
      currentSuperCol: [
        {
          key: 'ip',
          renderHeader: (h, params) => {
            return h('span', this.$t('IP'))
          }
        },
        {
          key: 'image',
          renderHeader: (h, params) => {
            return h('span', this.$t('MirrorName'))
          }
        },
        {
          key: 'profile',
          renderHeader: (h, params) => {
            return h('span', this.$t('StartUpPlan'))
          }
        },
        {
          key: 'super',
          renderHeader: (h, params) => {
            return h('span', this.$t('operation'))
          },
          render: (h, params) => {
            let a = h(
              'Button',
              {
                props: { type: 'error' },
                on: {
                  click: () => {
                    this.setcancle(params.row)
                  }
                }
              },
              this.$t('cancelText')
            )

            return [a]
          }
        }
      ],
      tableColumns: [
        { type: 'selection', width: 50, align: 'center' },
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('Status'))
          },
          key: 'stat',
          minWidth: 70,
          maxWidth: 80,
          render: (h, params) => {
            let a = ''
            switch (params.row.stat) {
              case '1':
                a = h('Icon', {
                  props: { type: 'md-desktop', size: '20', color: '#33AFFF' }
                })
                break
              case '0':
                a = h('Icon', {
                  props: { type: 'md-desktop', size: '20', color: '#B5B6BE' }
                })
                break
            }
            return a
          }
        },
        {
          key: 'ip',
          minWidth: 130,
          maxWidth: 120,
          sortable: 'custom',
          renderHeader: (h, params) => {
            return h('span', this.$t('ClientIP'))
          }
        },
        {
          key: 'pc',
          minWidth: 100,
          maxWidth: 110,
          sortable: true,
          renderHeader: (h, params) => {
            return h('span', this.$t('MachineName'))
          }
        },
        {
          key: 'mac',
          minWidth: 135,
          maxWidth: 150,
          renderHeader: (h, params) => {
            return h('span', this.$t('ClientMAC'))
          }
        },
        {
          key: 'pcGp',
          minWidth: 100,
          maxWidth: 130,
          renderHeader: (h, params) => {
            return h('span', this.$t('StartUpPlan'))
          }
        },
        {
          key: 'curImg',
          minWidth: 110,
          maxWidth: 130,
          renderHeader: (h, params) => {
            return h('span', this.$t('MirrorName'))
          }
        },
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('operation'))
          },
          key: 'super',
          minWidth: 380,
          render: (h, params) => {
            let that = this
            let a = ''
            if (that.currentSuper.length > 0) {
              a = h('div', [
                h(
                  'Button',
                  {
                    props: { type: 'dashed' },
                    style: { marginLeft: '10px' },
                    on: {
                      click: () => {
                        this.handleTableEdit(params.row)
                      }
                    }
                  },
                  this.$t('Edit')
                ),
                h(
                  'Button',
                  {
                    props: { type: 'dashed' },
                    style: { marginLeft: '10px' },
                    on: {
                      click: () => {
                        this.handDetele(params.row)
                      }
                    }
                  },
                  this.$t('Delete')
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'info',
                      disabled: params.row.stat !== '1',
                      ghost: true
                    },
                    style: { marginLeft: '10px' },
                    on: {
                      click: () => {
                        this.handleButtonRemoth(params.row)
                      }
                    }
                  },
                  this.$t('Remote')
                )
              ])
            } else {
              a = h('div', [
                h(
                  'Button',
                  {
                    props: { type: 'primary', ghost: true },
                    on: {
                      click: () => {
                        this.setSuperList(params.row)
                      }
                    }
                  },
                  this.$t('SetSuperWorkstation')
                ),
                h(
                  'Button',
                  {
                    props: { type: 'primary', ghost: true },
                    style: { marginLeft: '10px' },
                    on: {
                      click: () => {
                        this.handleTableEdit(params.row)
                      }
                    }
                  },
                  this.$t('Edit')
                ),
                h(
                  'Button',
                  {
                    props: { type: 'error', ghost: true },
                    style: { marginLeft: '10px' },
                    on: {
                      click: () => {
                        this.handDetele(params.row)
                      }
                    }
                  },
                  this.$t('Delete')
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'info',
                      disabled: params.row.stat !== '1',
                      ghost: true
                    },
                    style: { marginLeft: '10px' },
                    on: {
                      click: () => {
                        this.handleButtonRemoth(params.row)
                      }
                    }
                  },
                  this.$t('Remote')
                )
              ])
            }

            return a
          }
        }
      ],
      tableColumns1: [
        // { type: 'selection', width: 50, align: 'center' },
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('Status'))
          },
          key: 'stat',
          minWidth: 70,
          maxWidth: 80,
          render: (h, params) => {
            let a = ''
            switch (params.row.stat) {
              case '1':
                a = h('Icon', {
                  props: { type: 'md-desktop', size: '20', color: '#33AFFF' }
                })
                break
              case '0':
                a = h('Icon', {
                  props: { type: 'md-desktop', size: '20', color: '#B5B6BE' }
                })
                break
            }
            return a
          }
        },
        {
          key: 'ip',
          minWidth: 80,
          maxWidth: 120,
          renderHeader: (h, params) => {
            return h('span', this.$t('ClientIP'))
          }
        },
        {
          key: 'pc',
          minWidth: 120,
          maxWidth: 160,
          renderHeader: (h, params) => {
            return h('span', this.$t('MachineName'))
          }
        },
        {
          key: 'mac',
          minWidth: 100,
          maxWidth: 140,
          renderHeader: (h, params) => {
            return h('span', this.$t('ClientMAC'))
          }
        },
        {
          key: 'pcGp',
          minWidth: 100,
          maxWidth: 130,
          renderHeader: (h, params) => {
            return h('span', this.$t('StartUpPlan'))
          }
        },
        {
          key: 'curImg',
          minWidth: 100,
          maxWidth: 130,
          renderHeader: (h, params) => {
            return h('span', this.$t('MirrorName'))
          }
        },
        {
          key: 'super',
          renderHeader: (h, params) => {
            return h('span', this.$t('operation'))
          },
          render: (h, params) => {
            // let a = h(
            //   'Button',
            //   {
            //     props: { type: 'error' },
            //     on: {
            //       click: () => {
            //         this.setcancle(params.row)
            //       }
            //     }
            //   },
            //   this.$t('cancelText')
            // )
            // return [a]
            let a = h('div', [
              h(
                'Button',
                {
                  props: { type: 'error' },
                  on: {
                    click: () => {
                      this.setcancle(params.row)
                    }
                  }
                },
                this.$t('cancelText')
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    disabled: params.row.stat !== '1',
                    ghost: true
                  },
                  style: { marginLeft: '10px' },
                  on: {
                    click: () => {
                      this.handleButtonRemoth(params.row)
                    }
                  }
                },
                this.$t('Remote')
              )
            ])
            return a
          }
        }
      ],
      tempx: [],
      srcLis: [],
      nameList: [],
      formValidate: { nameVal: '' },
      formValidatex: {
        imglist: '',
        profileList: ''
      },
      formValidate1: {
        action: 'apply',
        comment: 'SAVE DATA'
      },
      formInline: {
        disable: '0',
        pcGp: ''
      },
      enableList: [
        { value: '0', label: this.$t('Enable') },
        { value: '1', label: this.$t('Disable') }
      ],
      ruleValidatex: {
        imglist: [
          {
            required: true,
            message: this.$t('ChooseAtLeastOne'),
            trigger: 'blur'
          }
        ],
        profileList: [
          {
            required: true,
            message: this.$t('ChooseAtLeastOne'),
            trigger: 'blur'
          }
        ]
      },
      ruleValidatex1: {
        action: [
          {
            required: true,
            message: this.$t('ChooseAtLeastOne'),
            trigger: 'blur'
          }
        ],
        comment: [
          {
            required: true,
            message: this.$t('ChooseAtLeastOne'),
            trigger: 'blur'
          }
        ]
      },
      loadingwakeup: false,
      loadingshoudown: false,
      loadingRestart: false,
      timer: null
    }
  },
  async created () {
    await this.HandleGetMaster() // 获取主服务器
    this.handgetClienList() // 获取客户机列表
  },
  mounted () {
    this.$refs.viewTable.addEventListener('mousewheel', (e) => {
      let offset = 0
      if (e.deltaY < 0) {
        this.bar.scrollTop -= 48
      } else {
        this.bar.scrollTop += 48
      }
      OnScroll.call(this, this.$refs.divScroll, offset)
    }, true)
    this.$refs.divScroll.addEventListener('scroll', (e) => {
      this.scrollTop = this.bar.scrollTop
      console.log(parseInt(this.bar.scrollTop / 48), this.bar.scrollTop / 48 + this.Pagelimit)
      this.tableData = this.list.slice(
        parseInt(this.bar.scrollTop / 48), this.bar.scrollTop / 48 + this.Pagelimit
      )
    }, true)
  },
  computed: {
    profileList () {
      if (this.imglist && this.formValidatex.imglist) {
        let xx = this.imglist.filter(item => {
          return item.name === this.formValidatex.imglist
        })
        this.formValidatex.profileList = xx[0].profileList[0].name
        return xx[0].profileList
      }
    },
    masterip () {
      return this.$store.state.app.masterip
    }
  },

  components: {
    edit
  },
  beforeRouteLeave (to, from, next) {
    clearTimeout(this.timer)
    next()
  },
  methods: {
    onSelectAll () {
      this.list.forEach(item => {
        item._checked = true
      })
      this.clientArray = this.list
    },
    onSelectAllCancel () {
      this.list.forEach(item => {
        item._checked = false
      })
      this.clientArray = []
    },
    onSelectionChange (e) {
      if (e.length === 0) {
        this.list.forEach(item => {
          item._checked = false
        })
      } else {
        e.forEach(item => {
          this.list.forEach(itemx => {
            if (item.ip === itemx.ip) {
              itemx._checked = true
            }
          })
        })
      }
    },
    // 取消某一项
    onSelectCancel (selected, cancel) {
      this.list.forEach(item => {
        if (cancel.ip === item.ip) {
          item._checked = false
        }
      })
      this.clientArray = selected
    },
    // 选择某一项
    onSelect (selected, now) {
      this.list.forEach(item => {
        if (now.ip === item.ip) {
          item._checked = true
        }
      })
      this.clientArray = selected
    },
    start () {
      this.timer = setTimeout(() => {
        this.handgetClienList()
        this.start()
      }, 2000)
    },
    async handleButtonRemoth (obj) {
      try {
        let resp = await PcRemote(
          { mac: obj.mac, ip: obj.ip, pwd: obj.passwd },
          this.masterip
        )
        console.log(resp)
        ipcRenderer.send('cmd', { ip: obj.ip, password: obj.passwd })
        ipcRenderer.on('cmd', (event, arg) => {
          console.log(arg)
        })
      } catch (error) {
        this.$Message.error(this.$t(`kxLinuxErr.${error}`))
      }
    },
    async handleSort ({ columns, key, order }) {
      if (key === 'ip' && order === 'asc') {
        this.list.sort((a, b) => {
          let arr1 = a.ip.split('.')
          let arr2 = b.ip.split('.')
          for (let i = 0; i < 4; i++) {
            if (arr1[i] > arr2[i]) {
              return 1
            } else if (arr1[i] < arr2[i]) {
              return -1
            }
          }
        })
      } else if (key === 'ip' && order === 'desc') {
        this.list.sort((a, b) => {
          let arr1 = a.ip.split('.')
          let arr2 = b.ip.split('.')
          for (let i = 0; i < 4; i++) {
            if (arr1[i] < arr2[i]) {
              return 1
            } else if (arr1[i] > arr2[i]) {
              return -1
            }
          }
        })
      } else if (key === 'pc' && order === 'asc') {
        let shuzi = this.list.filter(item => { return (parseInt(item.pc)) })
        shuzi.forEach(item => {
          item.pc = parseInt(item.pc)
        })
        let zimu = this.list.filter(item => { return (!Number(item.pc)) })
        this.list = shuzi.sort().concat(zimu.sort())
      } else if (key === 'pc' && order === 'desc') {
        this.list.reverse()
      }

      this.tableData = this.list.slice(
        parseInt(this.bar.scrollTop / 48), this.bar.scrollTop / 48 + this.Pagelimit
      )
    },
    /**
      获取主服务器
    */
    async HandleGetMaster () {
      return new Promise(async (resolve, reject) => {
        try {
          let resp = await getMasterIp()
          this.$store.dispatch('saveMaster', resp.data.value || '')
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    ChangeValue (value) {
      if (!value) {
        this.handgetClienList()
        return
      }
      this.tempx = []
      this.srcList.forEach(item => {
        if (
          item.pc.indexOf(value) !== -1 ||
          item.ip.indexOf(value) !== -1 ||
          item.mac.indexOf(value) !== -1 ||
          item.pcGp.indexOf(value) !== -1
        ) {
          this.tempx.push(item)
        }
      })
      this.tableData = this.tempx.slice(0, 10)
      if (this.tempx) {
        this.pageInfo.count = this.tempx.length
        this.list = this.tempx
      }
    },
    test (hide) {
      // this.handgetClienList()
      if (!hide) {
        setTimeout(() => {
          this.temp = false
        }, 200)
      }
    },
    changeCommon (x) {
      if (x === 'discard') {
        this.u = false
      } else {
        this.u = true
      }
    },
    /**
        刷新
    */
    handleButtonRefresh () {
      this.loading = true
      this.handgetClienList()
      this.HandleSuper()
      this.clientArray = []
    },

    /** 唤醒 */
    handleButtonwakeup () {
      this.formatFunction('4')
    },
    /** 关机 */
    handleButtonShutdown () {
      this.formatFunction('1')
    },
    /** 重启 */
    handleButtonRestart () {
      this.formatFunction('2')
    },
    async formatFunction (opt) {
      if (this.clientArray.length !== 0) {
        let a = []
        this.clientArray.forEach(item => {
          a.push({ mac: item.mac, ip: item.ip, pc: item.pc })
        })
        try {
          await CtrlPcsConf({ macList: a, operate: opt }, this.masterip)
        } catch (error) {
          console.log(error)
        } finally {
          this.handgetClienList()
          this.HandleSuper()
        }
      }
    },

    /**
     * 获取客户机列表
     */
    async handgetClienList () {
      this.clientMac = []
      let superip = await getSuper(this.masterip)
      let client = await getPcListConfig(this.masterip)
      let clientList = client.data.result && (client.data.result.list || [])
      clientList.forEach(item => {
        this.clientMac.push(item.mac)
      })
      clientList.forEach(item => {
        this.exclientIp.push(item.ip)
      })
      clientList.forEach(item => {
        this.pc.push(item.pc)
      })
      this.srcList = clientList // 保存原数组
      if (clientList) {
        this.pageInfo.count = clientList.length
      }
      this.loading = false
      if (superip.data.result) {
        if (clientList.length > 0) {
          let flag = true
          this.list = clientList.filter(item => {
            if (superip.data.result.ip === item.ip) {
              this.show = false
              flag = false
              this.currentSuper = [item]
            }
            return superip.data.result.ip !== item.ip
          })
          CreateAt.call(this, this.$refs.divScroll, this.Pagelimit * 48, this.list.length * 48)
          this.list.sort((a, b) => {
            return b.stat - a.stat
          })
          this.tableData = this.list.slice(
            parseInt(this.bar.scrollTop / 48), this.bar.scrollTop / 48 + this.Pagelimit
          )
          if (flag) {
            this.show = true
            this.currentSuper = [superip.data.result]
          }
        }
      } else {
        this.list = clientList
        CreateAt.call(this, this.$refs.divScroll, this.Pagelimit * 48, this.list.length * 48)
        this.list.sort((a, b) => {
          return b.stat - a.stat
        })
        this.tableData = this.list.slice(
          parseInt(this.bar.scrollTop / 48), this.bar.scrollTop / 48 + this.Pagelimit
        )
      }
      return this.list
    },
    async HandleSuper () {
      let resp = await getSuper(this.masterip)
      let respx = resp.data.result || ''
      if (respx) {
        this.currentSuper = [respx]
      } else {
        this.currentSuper = []
      }
    },
    /*
    设置超级工作站弹窗
    */
    async setSuperList (data) {
      this.adddetail = true
      if (!this.masterip) return
      let resp = await getImageListx(this.masterip)
      this.imglist = resp.data.result && (resp.data.result.list || [])
      this.formValidatex.imglist = this.imglist[0].name
      this.addedip = data.ip // 客户机ip
    },
    /**
     * 取消
     */
    setcancle (data) {
      this.cancleup = true
      this.canceledip = data.ip
    },
    /*
    取消超级工作站
    */
    handleCancelaction (name) {
      this.loadBtnCancel = true
      let that = this
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = {
            ip: this.canceledip,
            action: this.formValidate1.action,
            comment: this.formValidate1.comment
          }
          setCancelSuper(data, this.masterip).then(
            response => {
              this.handleButtonRefresh()
              that.loadBtnCancel = false
              this.cancleup = false
            },
            e => {
              that.loadBtnCancel = false
              that.$Message.error(this.$t(`kxLinuxErr.${e.data.error}`))
            }
          )
        }
      })
    },
    /**
     * 删除客户机
     */
    handDetele (data) {
      this.$Modal.confirm({
        title: this.$t('DeleteTip'),
        content: this.$t('DeleteCurrentData'),
        onOk: async () => {
          try {
            await deletePcsConfigx([data.mac], this.masterip)
            this.handgetClienList()
          } catch (error) {
            console.log(error)
          }
        }
      })
    },
    /**
     * 删除客户机
     */
    handAllDetele (data) {
      if (this.clientArray.length === 0) return
      let client = []
      this.clientArray.forEach(item => {
        client.push(item.mac)
      })
      this.$Modal.confirm({
        title: this.$t('DeleteTip'),
        // content: this.$t('DeleteCurrentData'),
        // content: `${this.$t('Delete')} 【${this.clientArray.length > 2 ? x.slice(0, 2) + ' ...' : x}】 ${this.$t('Client')} `,
        content: `${this.$t('Delete')}${this.clientArray.length} ${this.$t(
          'Client'
        )} `,
        onOk: async () => {
          try {
            await deletePcsConfigx(client, this.masterip)
            this.clientArray = []
            this.handgetClienList()
          } catch (error) {
            console.log(error)
          }
        }
      })
    },
    // /**
    //  * 选择客户机
    //  */
    // handleCheckBox (arr) {
    //   this.clientArray = arr
    //   this.macArray = []
    //   if (!arr) return ''
    //   arr.forEach(item => {
    //     this.macArray.push(item.mac)
    //   })
    // },
    /**
     * 获取客户机启动方案
     */
    handleButtonEdit () {
      if (this.clientArray.length < 1) {
        return
      }
      this.EditModel = true
      getPcGroupx(this.masterip).then(
        e => {
          this.pcGpList = e.data.result.list
          this.formInline.pcGp = this.pcGpList[0].name
        },
        e => {
          this.$Message.error(e.data.error)
        }
      )
    },
    /**
     * 批量修改客户
     */
    batchEdit () {
      if (this.clientArray.length < 1) {
        return
      }
      this.clientArray.forEach(item => {
        this.clientList.push({
          mac: item.mac,
          ip: item.ip,
          pc: item.pc
        })
      })
      const data = {
        macList: this.clientList,
        property: this.formInline
      }
      batchSetPcConf(data, this.masterip).then(res => {
        this.clientArray = []
        this.clientList = []
        this.handgetClienList()
      })
    },
    /**
     * 添加
     */
    handleButtonAdd (val) {
      this.xx = {}
      this.flag = 'Add'
      this.clientArray = []
      this.clientMacSet = new Set()
      this.Iptemp = new Set()
      this.PCtemp = new Set()
      for (let item of this.clientMac) {
        this.clientMacSet.add(item)
      }
      for (let item of this.exclientIp) {
        this.Iptemp.add(item)
      }
      for (let item of this.pc) {
        this.PCtemp.add(item)
      }
      this.temp = true
      this.superEdit = true
    },
    /**
     * 编辑
     */
    handleTableEdit (data) {
      this.temp = true
      this.xx = data // temp
      this.flag = 'Edit'
      this.Iptemp = new Set()
      this.PCtemp = new Set()
      for (let item of this.exclientIp) {
        if (item !== data.ip) {
          this.Iptemp.add(item)
        }
      }
      for (let item of this.pc) {
        if (item !== data.pc) {
          this.PCtemp.add(item)
        }
      }
      this.superEdit = true
    },
    /*
    设置为超级工作站
    */
    handleSubmitx (name) {
      this.loadBtnSuper = true
      var self = this
      self.$refs[name].validate(valid => {
        if (valid) {
          let cookiesMasterIp = this.masterip
          setSuper(
            {
              ip: self.addedip,
              image: self.formValidatex.imglist,
              profile: self.formValidatex.profileList
            },
            cookiesMasterIp
          ).then(
            response => {
              if (response.data.error) {
                self.$Message.error(
                  this.$t(`kxLinuxErr.${response.data.error}`)
                )
                this.loadBtnSuper = false
              } else {
                self.adddetail = false
                this.loadBtnSuper = false
                self.currentSuperip = response.data.result.vdiskInfo.serverIp
                this.handleButtonRefresh()
              }
            },
            err => {
              self.$Message.error(this.$t(`kxLinuxErr.${err.data.error}`))
            }
          )
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      this.showPopup = false
      this.cancleup = false
    },
    childByValue () {
      this.superEdit = false
      this.handgetClienList() // 获取客户机列表
      this.HandleSuper() // 获取超级工作站
      setTimeout(() => {
        this.temp = false
      }, 200)
    }
  }
}
</script>

<style scoped>
.header {
  margin-bottom: 20px;
}
.footer {
  /* margin-top:20px; */
  margin-bottom: 10px;
}
  .box{
      display: flex;
    }
  #divScroll{
    margin-top:42px;
    position: relative;
    right: 20px;
  }
</style>
