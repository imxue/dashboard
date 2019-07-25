<template>
  <div>
 
      <!-- <Button type="primary" class="topColumn" @click="handleButtonFilter">硬件筛选</Button>
      <Button type="primary" class="topColumn" @click="handleButtonEdit">批量编辑</Button>
      <Button type="primary" class="topColumn" @click="handleButtonDelete">删除</Button>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonImport">导入</Button>-->
      <!-- <Button type="primary" class="topColumn" @click="handleButtonRemove">移动至方案</Button> -->
      
    <Row class="header">
        <Col span="10" >
      <Button type="primary" class="topColumn" @click="handleButtonRefresh">{{$t('Refresh')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonAdd">{{$t('Add')}}</Button>
        </Col>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonRemotely">{{$t('Remotely')}}</Button> -->
      
        <Col span="" offset="17">
      <Button type="primary" class="topColumn" @click="handleButtonwakeup" :loading="loading">{{$t('wakeup')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonShutdown" :loading="loading">{{$t('shoudown')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonRestart" :loading="loading">{{$t('Restart')}}</Button>
        </Col>
    </Row>
  
    <!-- table -->
    <Table
      border
      stripe
      ref="selection"
      :columns="tableColumns"
      :data="tableData"
      @on-selection-change="handleCheckBox"
      @on-select="handleGetTableRowInfo"
      @on-select-cancel="handleRemoveTableRowInfo"
      :no-data-text="this.$t('Nodata')"
      @on-row-dblclick="handleTableEdit"
    ></Table>
    <Row style="margin-top:10px; ">
      <!-- <i-col span="4">资源：3000 &nbsp;&nbsp;&nbsp;&nbsp;已下载：1000</i-col> -->
      <Page
        v-if="tableListPage"
        :current="currentPage"
        :page-size="pageSize"
        :total="totalPageNumber"
        style=" float:right;"
        @on-change="hanbleChangePage"
      />
    </Row>
    <!-- 删除提示 -->
    <Modal
      v-model="showDeleteBox"
      :title="this.$t('DeleteTip')"
      @on-ok="handleConfirmDelete"
      @on-cancel="handleCancel"
    >
      <p>{{$t('DeleteCurrentData')}}</p>
    </Modal>
    <Modal :title="this.$t('SetSuperWorkstation')" v-model="adddetail" footer-hide width="500">
      <Form ref="formValidatex" :model="formValidatex" :rules="ruleValidatex" :label-width="100">
        <FormItem :label="this.$t('Mirror')" prop="imglist">
          <Select v-model="formValidatex.imglist" :placeholder="this.$t('pleaseInput')">
            <Option v-for="item in imglist" :value="item.name" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="this.$t('Configure')" prop="profileList">
          <Select v-model="formValidatex.profileList" :placeholder="this.$t('pleaseInput')">
            <template v-if="profileList">
              <Option
                v-for="item in profileList"
                :value="item.name"
                :key="item.name"
              >{{ item.name }}</Option>
            </template>
          </Select>
             <!-- <div class="ivu-form-item-error-tip" v-if="err">{{$t('FailedToGetVirtualdiskInformation')}}</div> -->
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitx('formValidatex')">{{$t('SetSuperWorkstation')}}</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal title="取消超级工作站" v-model="cancleup" footer-hide width="500">
      <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidatex1" :label-width="100">
        <FormItem label="操作" prop="action">
          <Select v-model="formValidate1.action" >
            <Option value="apply">{{$t('apply')}}</Option>
            <Option value="discard">{{$t('cancelText')}}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="comment">
          <Input v-model="formValidate1.comment" type="text" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleCancelaction('formValidate1')">{{$t('apply')}}</Button>
          <Button @click="handleReset('formValidate1')" style="margin-left: 8px">{{$t('cancelText')}}</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {
  getClientList,
  deleteClient,
  changeSchema,
  setSuper,
  getSuper,
  setCancelSuper,
  restart,
  shutdown,
  wakeup

} from '@/api/client'
import { getPcListConfigx, getImageListx, deletePcsConfigx } from '@/api/wupan'
export default {
  name: 'ClientList',
  inject: ['reload'],
  data () {
    return {
      masterip: this.$store.state.app.masterip || '',
      loading: false,
      selectMac: [],
      macArray: [], // 选择的mac地址
      err: '',
      clientIp: [], // 客户机ip
      clientMac: [],
      pc: [],
      currentSuperip: '',
      imglist: '',
      addedip: '',
      canceledip: '',
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
      tableColumns: [
        { type: 'selection', width: 50, align: 'center' },
        { renderHeader: (h, params) => { return h('span', this.$t('Status')) },
          key: 'stat',
          minWidth: 60,
          maxWidth: 70,
          render: (h, params) => {
            let a = ''
            switch (params.row.stat) {
              case '1':
                a = h('Icon', { props: { type: 'md-desktop', size: '20', color: '#33AFFF' } })
                break
              case '0':
                a = h('Icon', { props: { type: 'md-desktop', size: '20', color: '#B5B6BE' } })
                break
            }
            return a
          }

        },
        { key: 'ip', minWidth: 80, maxWidth: 120, renderHeader: (h, params) => { return h('span', this.$t('ClientIP')) } },
        { key: 'pc', minWidth: 80, maxWidth: 100, renderHeader: (h, params) => { return h('span', this.$t('MachineNamePrefix')) } },
        { key: 'mac', minWidth: 100, maxWidth: 140, renderHeader: (h, params) => { return h('span', this.$t('ClientMAC')) } },
        { key: 'pcGp', minWidth: 100, maxWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('StartUpPlan')) } },
        { key: 'curImg', minWidth: 100, maxWidth: 130, renderHeader: (h, params) => { return h('span', this.$t('MirrorName')) } },
        {
          renderHeader: (h, params) => { return h('span', this.$t('SuperWorkstation')) },
          key: 'super',
          minWidth: 140,
          render: (h, params) => {
            let that = this
            let a = ''
            if (that.currentSuperip) {
              if (params.row.ip === that.currentSuperip) {
                a = h('div', [
                  h('Tag', { props: { color: 'magenta' } }, this.$t('SuperWorkstation')),
                  h(
                    'Button',
                    {
                      props: { type: 'info' },
                      style: { marginLeft: '10px' },
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
                      props: { type: 'error' },
                      style: { marginLeft: '10px' },
                      on: {
                        click: () => {
                          this.setcancle(params.row)
                        }
                      }
                    },
                    this.$t('Delete')
                  )
                ])
              } else {
                let d = h(
                  'Button',
                  {
                    props: { type: 'error' },
                    style: { marginLeft: '10px' },
                    on: {
                      click: () => {
                        this.setcancle(params.row)
                      }
                    }
                  },
                  this.$t('Delete')
                )
                return d
              }
            } else {
              a = h('div', [h(
                'Button',
                {
                  props: { type: 'info', ghost: true },
                  on: {
                    click: () => {
                      this.setSuperList(params.row)
                    }
                  }
                },
                this.$t('SetSuperWorkstation')
              ), h(
                'Button',
                {
                  props: { type: 'error' },
                  style: { marginLeft: '10px' },
                  on: {
                    click: () => {
                      this.handDetele(params.row)
                    }
                  }
                },
                this.$t('Delete')
              )])
            }

            return a
          }
        }
      ],
      nameList: [],
      formValidate: { nameVal: '' },
      formValidatex: {
        imglist: '',
        profileList: ''
      },
      formValidate1: {
        action: 'apply',
        comment: ''
      },
      ruleValidatex: {
        imglist: [
          { required: true, message: this.$t('ChooseAtLeastOne'), trigger: 'blur' }
        ],
        profileList: [
          { required: true, message: this.$t('ChooseAtLeastOne'), trigger: 'blur' }
        ]
      },
      ruleValidatex1: {
        action: [
          { required: true, message: this.$t('ChooseAtLeastOne'), trigger: 'blur' }
        ],
        comment: [
          { required: true, message: this.$t('ChooseAtLeastOne'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.handgetClienList() // 获取客户机列表
    this.handleGetSuper() // 获取超级工作站
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
    }
  },
  methods: {
    /**
        刷新
    */
    handleButtonRefresh () {
      this.handgetClienList()
      this.handleGetSuper()
    },
    /**
        唤醒 关机 重启 函数模板
    */
    formatFunction (func) {
      if (this.macArray.length === 0) {
        return
      }
      this.loading = true
      func(this.macArray.toString()).then(resp => {
        this.notifyUserOfSucess(resp.data)
        this.loading = false
      }).catch(err => {
        setTimeout(() => { this.loading = false }, 500)
        this.notifyUserOfError(err.data.error)
      })
    },
    /** 唤醒 */
    handleButtonwakeup () { this.formatFunction(wakeup) },
    /** 关机 */
    handleButtonShutdown () { this.formatFunction(shutdown) },
    /** 重启 */
    handleButtonRestart () { this.formatFunction(restart) },

    /**
      获取超级工作站
    */
    handleGetSuper () {
      if (!this.masterip) return
      getSuper(this.masterip).then(response => {
        if (!response.data.error && response.data.result) {
          this.currentSuperip = response.data.result.ip
        }
      }, (error) => {
        this.notifyUserOfDiskError(error)
      })
    },
    async handgetClienList () {
      if (!this.masterip) return
      let resp = await getPcListConfigx(this.masterip)
      this.tableData = resp.data.result.list || []
      if (this.tableData) {
        this.tableData.forEach(i => {
          this.clientIp.push(i.ip)
          this.clientMac.push(i.mac)
          this.pc.push(i.pc)
        })
      }
    },
    /*
    获取超级工作站
    */
    setSuperList (data) {
      this.err = false
      this.adddetail = true
      if (!this.masterip) return
      getImageListx(this.masterip).then(response => {
        this.imglist = response.data.result.list
        this.formValidatex.imglist = this.imglist[0].name
      })
      this.addedip = data.ip
    },
    setcancle (data) {
      this.cancleup = true
      this.canceledip = data.ip
    },
    /*
    取消超级工作站
    */
    handleCancelaction (name) {
      let that = this
      this.cancleup = false
      this.$refs[name].validate(valid => {
        if (valid) {
          console.log(this.formValidate1.action)
          console.log(this.formValidate1.comment)
          let data = { ip: this.canceledip, action: this.formValidate1.action, comment: this.formValidate1.comment }
          setCancelSuper(data, this.masterip).then(response => {
            setTimeout(() => {
              that.reload()
            }, 0)
          })
        } else {
          this.$Message.error(this.$t('ValidationFailure'))
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
        okText: this.$t('Confirm'),
        cancelText: this.$t('cancelText'),
        onOk: () => {
          deletePcsConfigx([data.mac], this.masterip).then(respon => {
            this.handgetClienList()
          })
        }
      })
    },
    handleRemoveTableRowInfo (data) {
      this.handleFormatArr(data)
    },
    handleGetTableRowInfo (data) {
      this.handleFormatArr(data)
    },
    handleFormatArr (data) {
      var list = []
      for (var i in data) {
        list.push({
          ActiveDns: data[i].ActiveDns,
          BackupDns: data[i].BackupDns,
          Enable: data[i].Enable,
          Gateway: data[i].Gateway,
          Id: data[i].Id,
          Ip: data[i].Ip,
          StartSchema: data[i].StartSchema,
          Subnet: data[i].Subnet
        })
      }
      this.tableDataList = list
    },
    handleCallBackVaild (res) {
      var code = res.data.Code
      if (code === 0 || res.data.state === 'OK') {
        this.$Message.success(this.$t('OperationSuccessful'))
      } else {
        this.$Message.error(this.$t('OperationFail') + res.data.Msg)
      }
    },
    handleGetClientList (offset, limit) {
      var listQuery = '?offset=' + offset + '&limit=' + limit
      getClientList(listQuery).then(
        a => {
          var datalist = a.data.Data.List
          if (a.data.Code === 0) {
            if (datalist === null) {
              this.data = null
            } else {
              this.tableData = a.data.Data.List
              this.totalPageNumber = Number(a.data.Data.TotalCount)
              this.currentPage = Number(a.data.Data.PageNo)
              this.pageSize = Number(a.data.Data.PageSize)
            }
          } else {
            this.$Message.error(a.data.Msg)
          }
        },
        () => {
          this.$Message.error(this.$t('RequestErrorPleaseTryAgainLater'))
        }
      )
    },
    hanbleChangePage (num) {
      if (num === 1) {
        num = 0
      } else {
        num = this.currlimit * num - this.currlimit
      }
      this.handleGetClientList(num, this.currlimit)
    },
    handleCheckBoxNumber (name) {
      var val = this.getCheckboxVal.length
      if (val === 0 || val > 1) {
        this.$Message.error('请选择列表中的一项')
      } else {
        this.handlePostData(name)
      }
    },
    handlePostData (name) {
      if (name === 'del') {
        this.showDeleteBox = true // show删除提示
      }
    },
    handleCheckBox (arr) {
      this.macArray = []
      if (!arr) return ''
      arr.forEach(item => {
        this.macArray.push(item.mac)
      })
    },
    handleButtonFilter (val) {
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error('请至少选择列表中的一项')
      } else {
        this.$Message.info('筛选成功……')
      }
    },
    handleButtonAdd (val) {
      this.$router.push({
        path: 'clientData',
        query: {
          clientMac: this.clientMac,
          clientIp: this.clientIp,
          pc: this.pc
        }
      })
    },
    handleButtonEdit (val) {
      // alert(JSON.stringify(this.tableDataList))
      val = this.getCheckboxVal.length
      if (val === 0) {
        this.$Message.error('请至少选择列表中的一项')
      } else {
        this.$router.push({
          path: 'subtype1-add',
          query: { dataList: this.tableDataList }
        })
      }
    },
    handleConfirmDelete () {
      deleteClient(this.getCheckboxVal).then(
        res => {
          // console.log('res:' + JSON.stringify(res))
          this.$Message.success(this.$t('OperationSuccessful'))
          this.handleGetClientList()
        },
        () => {
          this.$Message.error(this.$t('RequestErrorPleaseTryAgainLater'))
        }
      )
    },

    handleButtonDelete (del) {
      var name = 'del'
      this.handleCheckBoxNumber(name)
    },

    handleCancel () {
      this.showDeleteBox = false
    },
    handleButtonImport () {},
    handleButtonRemove (name) {
      var val = this.getCheckboxVal.length
      if (val === 0 || val > 1) {
        this.$Message.error('请选择列表中的一项')
      } else {
        this.showPopup = true
      }
    },
    handleButtonRemovePost () {
      var currId = this.getCheckboxVal
      var self = this
      this.$refs[name].validate(valid => {
        if (valid) {
          deleteClient(currId).then(
            res => {
              self.handleCallBackVaild(res)
            },
            () => {
              this.$Message.error(this.$t('RequestErrorPleaseTryAgainLater'))
            }
          )
        } else {
          this.$Message.error(this.$t('ValidationFailure'))
        }
      })
    },
    handleButtonAwaken () {},

    handleTableEdit (data) {
      let exclientIp = this.clientIp.filter(item => { return item !== data.ip })
      let pc = this.pc.filter(item => { return item !== data.pc })

      this.$router.push({
        path: 'clientData',
        query: {
          data: data,
          flag: 'Edit',
          clientIp: exclientIp,
          pc: pc
        }
      })
    },
    handleTableRemove (index) {
      this.showPopup = true
    },
    handleSubmit (name) {
      var self = this
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.$Message.success('表单验证成功!')
          changeSchema(this.getCheckboxVal, this.formValidate.nameVal).then(
            res => {
              self.handleCallBackVaild(res)
            },
            () => {
              this.$Message.error(this.$t('RequestErrorPleaseTryAgainLater'))
            }
          )
        } else {
          this.$Message.error(this.$t('ValidationFailure'))
        }
      })
    },
    /*
    设置为超级工作站
    */
    handleSubmitx (name) {
      var self = this
      console.log(this.formValidatex.imglist)
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
          ).then(response => {
            if (response.data.error) {
              self.$Message.error(this.$t(`kxLinuxErr.${response.data.error}`))
            } else {
              self.adddetail = false
              self.currentSuperip = response.data.result.vdiskInfo.serverIp
              setTimeout(() => {
                self.reload()
              }, 0)
            }
          }, (err) => {
            self.$Message.error(this.$t(`kxLinuxErr.${err}`))
          })
        } else {
          this.$Message.error(this.$t('ValidationFailure'))
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      this.showPopup = false
      this.cancleup = false
    }
  }
}
</script>

<style scoped>
.header{
  margin-bottom: 10px;
}
</style>
