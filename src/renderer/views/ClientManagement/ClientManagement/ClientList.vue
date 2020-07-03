<template>
  <div>
    <div style="marginBottom:10px;display:flex;">
         <Input v-model="searchVal" @on-search="ChangeValue" style="width:200px;margin-right:10px;" search enter-button :placeholder="$t('pleaseInput') + $t('MachineName') + '-ip'" />
        <Button style="margin-right:10px;" type="primary"  @click="handleButtonRefresh">{{
          $t("Refresh")
        }}</Button>
        
    </div>

    <!-- table -->
    <div class="footer">
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
      <div
        style="display:flex;margin-bottom:10px;justify-content:space-between;"
      >
        <div>
          <Button style="margin-right:10px;" type="primary" @click="handleButtonAdd">{{
          $t("Add")
        }}</Button>
        <Button style="margin-right:10px;" type="primary" @click="handleButtonEdit">{{
          $t("Edit")
        }}</Button>
        <Button  style="margin-right:10px;" type="error" @click="handAllDetele">{{
          $t("Delete")
        }}</Button>
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
        <div style="float:right">
          <label>{{ $t("ClientCount") }}：</label>
          <span>
            {{ this.list.length }}
          </span>
          <label>{{ $t("Station") }}</label>

          <label style="margin-left:10px;">{{ $t("onlineClientCount") }}：</label>
          <span>
            {{ this.statCount }}
          </span>
          <label>{{ $t("Station") }}</label>


        </div>
      </div>
      <div ref="viewTable" class="box  ggggg">
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
        <div ref="scroll" id="scroll">
          <div ref="content" id="content">
            <div ref="all" id="all"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除提示 -->
    <Modal
      v-model="showDeleteBox"
      :title="this.$t('DeleteTip')"
      :mask-closable="false"
      @on-visible-change="HandleVisibleChange"
      @on-cancel="this.showDeleteBox = false"
    >
      <p>{{ $t("DeleteCurrentData") }}</p>
    </Modal>
    <Modal
      :title="this.$t('SetSuperWorkstation')"
      v-model="adddetail"
      footer-hide
      width="500"
       :mask-closable="false"
      @on-visible-change="HandleVisibleChange"
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
       :mask-closable="false"
      @on-visible-change="HandleVisibleChange"
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
       :mask-closable="false"
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
       :mask-closable="false"
      @on-visible-change="HandleVisibleChange"
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
  CtrlPcsConf,
  getServers
} from '@/api/wupan'
import edit from './ClientListAdd'
import { getMasterIp } from '@/api/common'
// OnScroll, CreateAt,
import { CreateScroll, bytesToSize, formatSize } from '@/utils/index'
const { ipcRenderer } = require('electron')
export default {
  name: 'ClientList',
  // inject: ['reload'],
  data () {
    return {
      searchVal: '',
      loadBtnSuper: false,
      loadBtnCancel: false,
      clientArray: '',
      clientList: [],
      flag: '',
      Pagelimit: 15,

      pcGpList: '',
      EditModel: false,
      u: true,
      loading: false,
      selectMac: [],
      macArray: [], // 选择的mac地址
      clientIp: [], // 客户机ip
      Iptemp: '',
      PCtemp: '',
      clientMacSet: new Set(), // mac 地址
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
      elementScroll: {
        scrollTop: 0
      },
      fiterPcGp: '', // 已选择的客户机启动方案
      filtercurDasc: '', // 所在服务器
      currentSuperCol: [
        { type: 'selection', width: 50, align: 'center' },
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

      tableColumns1: [
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
          minWidth: 90,
          maxWidth: 90,
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
          maxWidth: 100,
          renderHeader: (h, params) => {
            return h('span', this.$t('StartUpPlan'))
          }
        },
        {
          key: 'curImg',
          minWidth: 110,
          maxWidth: 110,
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
            let a = h('div', [
              h(
                'Button',
                {
                  props: { type: 'error' },
                  style: { marginRight: '10px' },
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
                  props: { type: 'info', disabled: params.row.stat !== '0' },
                  style: { marginRihgt: '10px' },
                  on: {
                    click: () => {
                      this.WarkSuper(params.row)
                    }
                  }
                },
                this.$t('wakeup')
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    disabled: params.row.stat !== '1'
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
      statCount: 0,
      tempx: [],
      pcdesc: false,
      pcasc: true,
      ipasc: false,
      ipdesc: false,
      srcLis: [],
      nameList: [],
      formValidate: { nameVal: '' },
      formValidatex: {
        imglist: '',
        profileList: ''
      },
      bar: {
        scrollTop: 0
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
      pcGpListx: [], // 启动方案列表
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
      timer: null,
      filterServerIp: '',
      filterStat: '',
      filtersCurDasv: [],
      filterspcGp: []
    }
  },
  async created () {
    await this.HandleGetMaster() // 获取主服务器
    await this.handleGetPcGroup()
    await this.getMasterList()
    if (this.$route.query.ip) {
      this.filtercurDasc = this.$route.query.ip
      this.filterStat = '1'
    }
    await this.handgetClienList().then(() => {
      this.start()
    })
  },
  mounted () {
    this.$refs.viewTable.addEventListener('mousewheel', e => {
      e.preventDefault && e.preventDefault()
      if (e.deltaY < 0) {
        this.elementScroll.scrollTop -= 48
      } else {
        this.elementScroll.scrollTop += 48
      }
    })
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
    },
    tableColumns () {
      return [
        { type: 'selection', width: 50, align: 'center', fixed: 'left' },
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('Status'))
          },
          key: 'stat',
          minWidth: 110,
          maxWidth: 110,
          fixed: 'left',
          align: 'center',
          resizable: true,
          filters: [
            {
              label: this.$t('online'),
              value: '1'
            },
            {
              label: this.$t('Offline'),
              value: '0'
            }
          ],
          filterMultiple: false,
          filterRemote: this.fiterStatFunction,
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
          minWidth: 120,
          maxWidth: 130,
          fixed: 'left',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return h('span', this.$t('ClientIP'))
          }
        },
        {
          key: 'rate',
          width: 100,
          render: (h, params) => {
            return h('span', `${params.row.rate || 0} Mb/s`)
          },
          renderHeader: (h, params) => {
            return h('span', this.$t('NIC speed'))
          }
        },
        {
          key: 'pc',
          minWidth: 110,
          maxWidth: 110,
          fixed: 'left',
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return h('span', this.$t('MachineName'))
          }
        },
        {
          key: 'mac',
          minWidth: 135,
          maxWidth: 138,
          renderHeader: (h, params) => {
            return h('span', this.$t('ClientMAC'))
          }
        },
        {
          key: 'curDaSV',
          minWidth: 120,
          maxWidth: 130,
          filters: this.filtersCurDasv,
          filterMultiple: false,
          filterRemote: this.fitercurIpFunction,
          renderHeader: (h, params) => {
            return h('span', this.$t('TheServer'))
          }
        },
        {
          key: 'pcGp',
          minWidth: 110,
          maxWidth: 110,
          filters: this.filterspcGp,
          filterMultiple: false,
          filterRemote: this.fiterFunction,
          renderHeader: (h, params) => {
            return h('span', this.$t('StartUpPlan'))
          }
        },
        {
          key: 'curImg',
          minWidth: 115,
          maxWidth: 120,
          renderHeader: (h, params) => {
            return h('span', this.$t('MirrorName'))
          }
        },
        {
          key: 'reRe',
          minWidth: 150,
          maxWidth: 150,
          renderHeader: (h, params) => {
            return h('span', this.$t('reRe'))
          },
          render: (h, params) => {
            if (params.row.wrTo) {
              return h('span', formatSize(params.row.reRe))
            } else {
              return h('span', '-')
            }
          }
        },

        {
          key: 'wrRe',
          minWidth: 150,
          maxWidth: 150,
          renderHeader: (h, params) => {
            return h('span', this.$t('wrRe'))
          },
          render: (h, params) => {
            if (params.row.wrTo) {
              return h('span', formatSize(params.row.wrRe))
            } else {
              return h('span', '-')
            }
          }
        },
        {
          key: 'reTo',
          minWidth: 130,
          maxWidth: 130,
          renderHeader: (h, params) => {
            return h('span', this.$t('reTo'))
          },
          render: (h, params) => {
            if (params.row.wrTo) {
              return h('span', bytesToSize(params.row.reTo))
            } else {
              return h('span', '-')
            }
          }
        },
        {
          key: 'wrTo',
          minWidth: 130,
          maxWidth: 130,
          renderHeader: (h, params) => {
            return h('span', this.$t('wrTo'))
          },
          render: (h, params) => {
            if (params.row.wrTo) {
              return h('span', bytesToSize(params.row.wrTo))
            } else {
              return h('span', '-')
            }
          }
        },
        {
          key: 'liTi',
          minWidth: 110,
          maxWidth: 110,
          renderHeader: (h, params) => {
            return h('span', this.$t('liTi'))
          },
          render: (h, params) => {
            if (params.row.wrTo) {
              return h('span', params.row.liTi)
            } else {
              return h('span', '-')
            }
          }
        },
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('operation'))
          },
          key: 'super',
          minWidth: 260,
          // fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: { type: 'primary' },
                style: { marginRight: '10px' },
                on: {
                  click: () => {
                    this.handleTableEdit(params.row)
                  }
                }
              }, this.$t('Edit')),
              h('Button', {
                props: { type: 'error' },
                style: { marginRight: '10px' },
                on: {
                  click: () => {
                    this.handDetele(params.row)
                  }
                }
              }, this.$t('Delete')),
              h('Dropdown', {
                props: {
                  trigger: 'click'
                }
              }, [
                h('Button', [
                  h('span', this.$t('More')),
                  h('Icon', {
                    props: {
                      'type': 'ios-arrow-down'
                    }
                  })
                ]),

                h('DropdownMenu', {
                  slot: 'list',
                  props: {
                    placement: 'top-start'
                  }
                }, [
                  h('DropdownItem', {
                    nativeOn: {
                      click: () => {
                        this.handleButtonRemoth(params.row)
                      }
                    }
                  }, this.$t('Remote')),
                  h('DropdownItem', {
                    nativeOn: {
                      click: () => {
                        this.setSuperList(params.row)
                      }
                    }
                  }, this.$t('SetSuperWorkstation'))
                ])
              ])
            ])
          }
        }
      ]
    }

  },
  components: {
    edit
  },
  beforeRouteLeave (to, from, next) {
    clearTimeout(this.timer)
    next()
  },
  watch: {
    async masterip (v) {
      if (v) {
        await this.getMasterList(v)
      }
    },
    clientArray (value) {
      if (value.length > 0) {
        clearTimeout(this.timer)
        this.timer = null
      } else {
        if (!this.timer) {
          this.start()
        }
      }
    }
  },
  methods: {
    async start () {
      await this.handgetClienList()
      this.timer = setTimeout(() => {
        this.start()
      }, 3000)
    },
    async getMasterList () {
      try {
        let respList = await getServers(this.masterip)
        this.serverList = respList.data.result.list ? respList.data.result.list : []
        this.filtersCurDasv = this.serverList.map((e, i) => {
          let obj = {}
          obj.label = e.serverIp
          obj.value = e.serverIp
          return obj
        })
      } catch (e) {
        return -1
      }
    },
    HandleCreateScroll (view, all) {
      this.elementScroll = CreateScroll(document.querySelector('#scroll'),
        document.querySelector('#content'), view * 48,
        document.querySelector('#all'), all * 48,
        this.currentScrollPosition
      )
      this.elementScroll.addEventListener('scroll', e => {
        this.currentScrollPosition = e.target.scrollTop

        this.tableData = this.list.slice(
          parseInt(this.elementScroll.scrollTop / 48),
          this.elementScroll.scrollTop / 48 + this.Pagelimit
        )
      })
    },
    async fiterFunction (value) {
      if (typeof value === 'string') {
        value = value + ''
        this.fiterPcGp = value
      } else if (value instanceof Array) {
        if (value[0]) {
          this.fiterPcGp = value[0]
        } else {
          this.fiterPcGp = ''
        }
      }
      this.handgetClienList()
    },
    async fitercurIpFunction (value) {
      if (typeof value === 'string') {
        this.filtercurDasc = value + ''
      } else if (value instanceof Array) {
        if (value[0]) {
          this.filtercurDasc = value[0]
        } else {
          this.filtercurDasc = ''
        }
      }
      this.handgetClienList()
    },

    async fiterStatFunction (value) {
      if (typeof value === 'string') {
        this.filterStat = value + ''
      } else if (value instanceof Array) {
        if (value[0]) {
          this.filterStat = value[0]
        } else {
          this.filterStat = ''
        }
      }
      this.handgetClienList()
    },
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
      this.clientArray = this.list.filter(item => {
        return item._checked
      })
    },
    // 选择某一项
    onSelect (selected, now) {
      clearTimeout(this.timer)
      this.list.forEach(item => {
        if (now.ip === item.ip) {
          item._checked = true
        }
      })
      this.clientArray = this.list.filter(item => {
        return item._checked
      })
    },
    async handleButtonRemoth (obj) {
      try {
        await PcRemote(
          { mac: obj.mac, ip: obj.ip, pwd: obj.passwd },
          this.masterip
        )
        ipcRenderer.send('cmd', { ip: obj.ip, password: obj.passwd })
        ipcRenderer.on('cmd', (event, arg) => {
          this.$Message.error(arg)
        })
      } catch (error) {
        this.$Message.error(this.$t(`kxLinuxErr.${error}`))
      }
    },
    async handleSort ({ columns, key, order }) {
      if (key === 'ip' && order === 'asc') {
        this.ipasc = true
        this.ipdesc = false
        this.pcasc = false
        this.pcdesc = false
      } else if (key === 'ip' && order === 'desc') {
        this.ipdesc = true
        this.ipasc = false
        this.pcasc = false
        this.pcdesc = false
      } else if (key === 'ip' && order === 'normal') {
        this.ipdesc = false
        this.ipasc = false
        this.pcasc = true
        this.pcdesc = false
      } else if (key === 'pc' && order === 'asc') {
        this.pcdesc = false
        this.pcasc = true
        this.ipasc = false
        this.ipdesc = false
      } else if (key === 'pc' && order === 'desc') {
        this.pcdesc = true
        this.pcasc = false
        this.ipasc = false
        this.ipdesc = false
      } else if (key === 'pc' && order === 'normal') {
        this.pcdesc = false
        this.pcasc = false
      } else if (key === 'curDaSV' && order === 'desc') {
        this.pcdesc = false
        this.pcasc = false
        this.ipasc = false
        this.ipdesc = false
      } else if (key === 'curDaSV' && order === 'asc') {
        this.pcdesc = false
        this.pcasc = false
        this.ipasc = false
        this.ipdesc = false
      } else if (key === 'curDaSV' && order === 'normal') {
        this.pcasc = true
      }
      this.handgetClienList()
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
    async ChangeValue (value) {
      this.searchVal = value

      this.handgetClienList()
    },
    test (hide) {
      if (hide) {
        clearTimeout(this.timer)
        this.timer = null
      } else {
        this.start()
      }
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
      this.searchVal = ''
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
        } catch (e) {
          this.$Message.error(this.$t(`kxLinuxErr.${e}`))
        } finally {
          this.handgetClienList()
          this.HandleSuper()
        }
      }
    },
    /**
   * 唤醒超级工作站
   */
    async WarkSuper (item) {
      try {
        await CtrlPcsConf({ macList: [{ mac: item.mac, ip: item.ip, pc: item.pc }], operate: '4' }, this.masterip)
      } catch (e) {
        this.$Message.error(this.$t(`kxLinuxErr.${e}`))
      } finally {
        this.handgetClienList()
        this.HandleSuper()
      }
    },
    /**
     * 获取客户机列
     */
    async handgetClienList () {
      this.clientMac = []
      this.exclientIp = []
      this.pc = []

      this.loading = false

      let clientList = await this.getClienList() // 客户机列表
      this.statCount = 0
      this.list = clientList.filter(item => {
        if (item.stat === '1') {
          this.statCount++
        }

        return (
          (this.fiterPcGp === '' ? true : item.pcGp === this.fiterPcGp) &&
          (this.filtercurDasc === '' ? true : item.curDaSV === this.filtercurDasc) &&
          (this.filterStat === '' ? true : item.stat === this.filterStat)
        )
      })
      if (this.searchVal) {
        this.list = this.list.filter(item =>
          item.PcGp === this.searchVal ||
          item.ip === this.searchVal ||
          item.pc === this.searchVal ||
          item.curDaSV === this.searchVal ||
          item.mac === this.searchVal
        )
      }
      if (this.ipasc) {
        this.ipSort(this.list, 'ip', 'asc')
      }
      if (this.ipdesc) {
        this.ipSort(this.list, 'ip', 'desc')
      }
      if (this.pcasc) {
        let shuzi = this.list.filter(item => {
          return parseInt(item.pc)
        })
        shuzi.forEach(item => {
          item.pc = parseInt(item.pc)
        })
        let zimu = this.list.filter(item => {
          return !Number(item.pc)
        })
        this.list = shuzi
          .sort((obj, obj1) => {
            return obj.pc - obj1.pc
          })
          .concat(
            zimu.sort((o, o1) => {
              return o.pc.localeCompare(o1.pc)
            })
          )
      } else if (this.pcdesc) {
        let shuzi = this.list.filter(item => {
          return parseInt(item.pc)
        })
        shuzi.forEach(item => {
          item.pc = parseInt(item.pc)
        })
        let zimu = this.list.filter(item => {
          return !Number(item.pc)
        })
        this.list = shuzi
          .sort((obj, obj1) => {
            return obj1.pc - obj.pc
          })
          .concat(
            zimu.sort((o, o1) => {
              return o1.pc.localeCompare(o.pc)
            })
          )
      }

      if (this.list.length === 1) {
        this.elementScroll.scrollTop = 0
        this.tableData = this.list.slice(0, parseInt(this.elementScroll.scrollTop / 48) + this.Pagelimit)
      } else {
        this.tableData = this.list.slice(parseInt(this.elementScroll.scrollTop / 48), parseInt(this.elementScroll.scrollTop / 48) + this.Pagelimit)
      }
      this.HandleCreateScroll(this.tableData.length, this.list.length)
      return this.list
    },
    async getClienList () {
      let superip = await getSuper(this.masterip) // 超级
      let client = await getPcListConfig(this.masterip) // 客户机列表
      let clientList = client.data.result && (client.data.result.list || [])
      if (superip.data.result) {
        if (clientList.length > 0) {
          let list = clientList.filter(item => {
            this.clientMac.push(item.mac)
            this.exclientIp.push(item.ip)
            this.pc.push(item.pc)
            if (superip.data.result.ip === item.ip) {
              this.show = false
              this.currentSuper = [item]
            }
            return superip.data.result.ip !== item.ip
          })

          return list
        }
      } else {
        return clientList
      }
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
              that.$Message.error(this.$t(`kxLinuxErr.${e}`))
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
            if (this.list.length < 11 || this.list.length === 11) {
              if (
                document.querySelector('#divScroll') &&
                document.querySelector('#bar')
              ) {
                this.$nextTick(() => {
                  document
                    .querySelector('#divScroll')
                    .removeChild(document.querySelector('#bar'))
                  document
                    .querySelector('#box')
                    .removeChild(document.querySelector('#divScroll'))
                })
              }
            }
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
        content: `${this.$t('DeleteDec')}  ${this.clientArray.length}${this.$t('Station')}${this.$t(
          'Client')}？`,
        onOk: async () => {
          try {
            await deletePcsConfigx(client, this.masterip)
            this.clientArray = []
            await this.handgetClienList()
          } catch (error) {
            console.log(error)
          }
        }
      })
    },
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
    // 获取启动方案
    handleGetPcGroup () {
      getPcGroupx(this.masterip).then(
        e => {
          this.filterspcGp = e.data.result.list.map((i) => {
            let o = {}
            o.label = i.name
            o.value = i.name
            return o
          })
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
              this.loadBtnSuper = false
              self.$Message.error(this.$t(`kxLinuxErr.${err}`))
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
    },
    ipSort (obj, filed, desc) {
      let n = desc === 'asc' ? 1 : -1
      obj.sort((a, b) => {
        if (a[filed] && b[filed]) {
          a = a[filed].split('.')
          b = b[filed].split('.')
          for (let i = 0; i < 4; i++) {
            if (a[i] - b[i] > 0) {
              return n
            } else if (a[i] - b[i] < 0) {
              return -n
            } else {
              return 0
            }
          }
        } else if (!a[filed] || !b[filed]) {
          return 1
        }
      })
    },
    HandleVisibleChange (show) {
      if (show) {
        clearTimeout(this.timer)
        this.timer = null
      } else {
        this.start()
      }
    }
  }
}
</script>

<style scoped>
.footer {
  /* margin-top:20px; */
  margin-bottom: 10px;
}
.box {
  position: relative;
}
#scroll {
  margin-top: 42px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 9;
}
</style>
