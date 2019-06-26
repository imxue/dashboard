<template>
  <div>
    <div class="topItem">
      <!-- <Button type="primary" class="topColumn" @click="handleButtonFilter">硬件筛选</Button>
      <Button type="primary" class="topColumn" @click="handleButtonEdit">批量编辑</Button>
      <Button type="primary" class="topColumn" @click="handleButtonDelete">删除</Button>
      <!-- <Button type="primary" class="topColumn" @click="handleButtonImport">导入</Button>-->
      <!-- <Button type="primary" class="topColumn" @click="handleButtonRemove">移动至方案</Button>
      <Button type="primary" class="topColumn" @click="handleButtonAwaken">唤醒</Button>
      <Button type="primary" class="topColumn" @click="handleButtonShutdown">关机</Button>-->
      <Button type="primary" class="topColumn" @click="handleButtonReStart">{{$t('Refresh')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonAdd">添加</Button>
    </div>
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
    ></Table>
    <Row style="margin-top:10px; ">
      <!-- <i-col span="4">资源：3000 &nbsp;&nbsp;&nbsp;&nbsp;已下载：1000</i-col> -->
      <Page
        v-if="tableListPage"
        :current="currentPage"
        :page-size="pageSize"
        :total="totalPageNumber"
        show-total
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
             <div class="ivu-form-item-error-tip" v-if="err">{{$t('FailedToGetVirtualdiskInformation')}}</div>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitx('formValidatex')">{{$t('SetSuperWorkstation')}}</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal title="取消超级工作站" v-model="cancleup" footer-hide width="500">
      <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidatex1" :label-width="100">
        <FormItem label="操作" prop="plan">
          <Select v-model="formValidate1.action" placeholder="默认当前(方案)">
            <Option value="apply">{{$t('apply')}}</Option>
            <Option value="discard">{{$t('cancelText')}}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注" prop="comment">
          <input v-model="formValidate1.comment" type="text" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleCancelaction('formValidate1')">{{$t('cancelText')}}</Button>
          <Button @click="handleResetx('fromdetail')" style="margin-left: 8px">{{$t('Reset')}}</Button>
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
  setCancelSuper
} from '@/api/client'
import { getPcListConfigx, getImageListx, deletePcsConfigx } from '@/api/wupan'
export default {
  name: 'subType1-1',
  inject: ['reload'],
  data () {
    return {
      err: '',
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
        // { type: 'selection', width: 50, align: 'center' },
        { renderHeader: (h, params) => { return h('span', this.$t('Status')) },
          key: 'stat',
          width: 90,
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
        { key: 'ip', minWidth: 80, renderHeader: (h, params) => { return h('span', this.$t('ClientIP')) } },
        { key: 'mac', renderHeader: (h, params) => { return h('span', this.$t('ClientMAC')) } },
        { key: 'pcGp', minwidth: 120, renderHeader: (h, params) => { return h('span', this.$t('Configuration')) } },
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
        action: '',
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
        plan: [
          { required: true, message: this.$t('ChooseAtLeastOne'), trigger: 'blur' }
        ],
        comment: [
          { required: true, message: this.$t('ChooseAtLeastOne'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.handgetClienList()
    this.handleGetSuper()
  },
  computed: {
    routes () {
      return this.$router.options.routes
    },
    profileList () {
      if (this.imglist && this.formValidatex.imglist) {
        let xx = this.imglist.filter(item => {
          return item.name === this.formValidatex.imglist
        })

        return xx[0].profileList
      }
    }
  },
  methods: {
    handleGetSuper () {
      let ip = localStorage.getItem('masterip')
      getSuper(ip).then(response => {
        if (response.data.ok) {
          if (!response.data.data.error && response.data.data.result) {
            this.currentSuperip = response.data.result.ip
          }
        }
      })
    },
    handgetClienList () {
      if (localStorage.getItem('masterip')) {
        let ip = localStorage.getItem('masterip')
        getPcListConfigx(ip).then(response => {
          if (response.data.ok) {
            if (response.data.data.result.list) {
              this.tableData = response.data.data.result.list
            }
          }
        })
      }
    },
    getSuperList () {},
    /*
    获取超级工作站
    */
    setSuperList (data) {
      this.err = false
      this.adddetail = true
      let ip = localStorage.getItem('masterip')
      getImageListx(ip).then(response => {
        if (response.data.ok) {
          this.imglist = response.data.data.result.list
        }
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
          let ip = localStorage.getItem('masterip')
          let data = { ip: this.canceledip, action: this.formValidate1.action, comment: this.formValidate1.comment }
          setCancelSuper(data, ip).then(response => {
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
          deletePcsConfigx([data.mac], localStorage.getItem('masterip')).then(respon => {
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
      // console.log(JSON.stringify(this.tableDataList))
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
      var data = arr
      var list = []
      for (var i in arr) {
        list.push(data[i].Id)
      }
      this.getCheckboxVal = list.join(',')
      return this.getCheckboxVal
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
      this.$router.push({ path: 'subtype1-add' })
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
          // this.$Message.success('表单验证成功!')
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
    handleButtonShutdown () {},
    handleButtonReStart () {
      this.handgetClienList()
      this.handleGetSuper()
    },
    handleTableEdit (index) {
      // alert(JSON.stringify(index))
      this.$router.push({
        path: 'subtype1-add',
        query: { data: index }
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
          let cookiesMasterIp = localStorage.getItem('masterip')
          setSuper(
            {
              ip: self.addedip,
              image: self.formValidatex.imglist,
              profile: self.formValidatex.profileList
            },
            cookiesMasterIp
          ).then(response => {
            if (response.data.ok) {
              if (response.data.data.result.vdiskInfo && response.data.data.error === null) {
                self.adddetail = false
                self.currentSuperip = response.data.result.vdiskInfo.serverIp
                setTimeout(() => {
                  self.reload()
                }, 0)
              } else {
                this.err = true
              }
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
    }
  }
}
</script>

<style scoped>
</style>
