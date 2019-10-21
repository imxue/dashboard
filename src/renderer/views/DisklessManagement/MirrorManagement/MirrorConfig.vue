<template>
  <div>
    <div class="topItem">
      <Button type="error" class="topColumn" @click="handleDeleteMirrors">{{$t('Delete')}}</Button>
      </div>
    <!-- table -->
    <Table border :columns="MirrorInfoTable" :data="MirrorsInfoDate"></Table>
    <Divider />
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonCreate">{{$t('Create')}}</Button>
    </div>
    <!-- table -->
    <Table border  stripe @on-row-dblclick='handleSet' ref="selection" :columns="tableColumns" :data="tableData"></Table>
    <Modal
      :title="modalTitle"
      v-model="showImgPopup"
      :mask-closable=false
      width= "500"
      footer-hide
      class-name="vertical-center-modal">
      <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="100">
        <FormItem :label="labelName" prop="nameVal">
          <Input v-model="formValidate2.nameVal" :placeholder="this.$t('PleaseEnterConfigurationPointName')" />
           <Input v-model="formValidate2.nameVal" style="display:none" />
        </FormItem>
        <FormItem class="buttonList">
             <Button type="primary" @click.prevent="handeCheckModalSubmitType('formValidate2')" :loading='loadingbtn'>{{$t('Save')}}</Button>
             <Button @click="handleImageReset('formValidate2')" style="margin-left: 8px">{{$t('cancelText')}}</Button>
        </FormItem>
      </Form>
     </Modal>
    <Modal
      :title="this.$t('RestoreConfigurationPoint')"
      v-model="showPopup"
      width="880"
      footer-hide>
      <Table border :columns="configPointTable" :data="configPointDate"></Table>
     </Modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import { bytesToSize2 } from '@/utils/index'
  import {
    getImageListx,
    deleteImagex,
    getImageRestore,
    deleteImageProject,
    editImageProject,
    revertImageRestore,
    deleteImageRestore,
    createImageProjectx,
    mergeImageProject
  } from '@/api/wupan'
  export default {
    name: 'MirrorConfig',
    data () {
      return {
        masterip: this.$store.state.app.masterip || '',
        modalType: 'create',
        loadingbtn: false,
        modalTitle: this.$t('CreateConfigurationPointName'),
        labelName: this.$t('ConfigurationName'),
        showImgPopup: false,
        showPopup: false,
        btnRestore: false,
        loadSing: false, // brn loading
        configList: [],
        copyIndexData: [],
        configListIndexValue: '', // 当前配置点 row value
        restoreListIndexValue: '', // 当前还原点 row value
        ImageDataList: [],
        MirrorInfoTable: [
          { key: 'name', renderHeader: (h, params) => { return h('span', this.$t('MirrorName')) } },
          {
            renderHeader: (h, params) => { return h('span', this.$t('MirrorSize')) },
            key: 'size',
            render: (h, params) => {
              return h('span', params.row.size + 'GB')
            }
          },
          { title: '占用空间',
            key: 'fileSizeB',
            renderHeader: (h, params) => { return h('span', this.$t('TakeupSpace')) },
            render: (h, params) => {
              return h('span', bytesToSize2(params.row.fileSizeB))
            }
          },
          {
            renderHeader: (h, params) => { return h('span', this.$t('ConfigurePoints')) },
            key: 'profileList',
            render: (h, params) => {
              let arr = params.row.profileList
              if (arr !== null || arr !== '') {
                return h('span', arr.length)
              } else {
                return h('span', '-')
              }
            }
          }

        ],
        MirrorsInfoDate: [],
        tableColumns: [
          { key: 'name', width: 200, renderHeader: (h, params) => { return h('span', this.$t('ConfigurationPointName')) } },
          { key: 'fileSizeB',
            width: 200,
            renderHeader: (h, params) => { return h('span', this.$t('ConfigurationPackageSize')) },
            render: (h, params) => {
              return h('span', bytesToSize2(params.row.fileSizeB))
            }
          },
          { key: 'dataModifyTime',
            renderHeader: (h, params) => { return h('span', this.$t('ChangeTime')) },
            width: 240,
            render: (h, params) => {
              return h('span', moment(params.row.dataModifyTime, 'YYYY-MM-DD HH:mm:ss').format('LLL'))
            } },
          {
            renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            key: 'operation',
            render: (h, params) => {
              let response = h('Button', {
                props: { type: 'primary' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleSet(params.row) } }
              }, this.$t('RestorePoint'))
              let b = h('Button', {
                props: { type: 'primary' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleCopy(params.row) } }
              }, this.$t('Copy'))
              let c = h('Button', {
                props: { type: 'error' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleDelete(params.row) } }
              }, this.$t('Delete'))
              // let d = h('Button', { props: { type: 'info' },
              //   on: { click: () => { this.handleFix(params.row) } }
              // }, this.$t('modify'))
              if (params.row.name === 'default') {
                return [response, b]
              } else {
                return [response, b, c]
              }
            }
          }
        ],
        tableData: [],
        formValidate2: { nameVal: '' },
        ruleValidate2: { nameVal: [{ required: true, message: '不能为空', trigger: 'blur' }] },
        formValidate: { config: '' },
        ruleValidate: { config: [{ required: true, message: '不能为空', trigger: 'change' }] },
        configPointTable: [
          { key: 'no',
            minWidth: 90,
            renderHeader: (h, params) => { return h('span', this.$t('RestorePpointNo')) }
          },
          { key: 'comment',
            minWidth: 150,
            renderHeader: (h, params) => { return h('span', this.$t('RestorePointNote')) }
          },
          {
            renderHeader: (h, params) => { return h('span', this.$t('ChangeTime')) },
            key: 'dataModifyTime',
            minWidth: 150,
            render: (h, params) => {
              return h('span', moment(params.row.dataModifyTime, 'YYYY-MM-DD HH:mm:ss').format('LLL'))
            }
          },
          { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            key: 'operation',
            minWidth: 150,
            render: (h, params) => {
              let response = h('Button', {
                props: { type: 'primary', loading: this.loadSing },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleSetRestore(params.row) } }
              }, this.$t('Revert'))
              let b = h('Button', {
                props: { type: 'error' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleDeleteRestore(params.row) } }
              }, this.$t('Delete'))
              return [response, b]
            }
          }
        ],
        configPointDate: []
      }
    },
    created () {
      var data = this.$route.query.data
      this.MirrorsInfoDate.push(data) // 镜像信息 Get_Img
      this.handleGetImageList()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      /**
       * 删除镜像
      */
      handleDeleteMirrors () {
        let name = this.MirrorsInfoDate[0].name
        this.$Modal.confirm({
          title: this.$t('DeleteTip'),
          content: this.$t('DeleteDec'),
          okText: this.$t('Confirm'),
          cancelText: this.$t('cancelText'),
          onOk: () => {
            let ip = this.masterip
            deleteImagex(name, ip).then(() => {
              this.$router.push({
                path: 'AllMirror'
              })
            })
          },
          onCancel: () => {

          }
        })
      },
      /**
       * 获取镜像类别
       */
      handleGetImageList () {
        console.log(this.masterip)
        getImageListx(this.masterip).then((response) => {
          if (!response.data.error) {
            var arr = response.data.result.list
            if (response.data.error === null && arr.length !== null) {
              var newArr = arr.filter(item => { return item.name === this.MirrorsInfoDate[0].name })
              this.tableData = newArr[0].profileList
            }
          }
        })
      },
      handleCheckCallBack () {},
      handleButtonImport () {},
      handleButtonExport () {},
      handleButtonBuild () {},
      handleButtonStandby () {},
      handleButtonCreate () {
        this.modalType = 'create'
        this.modalTitle = this.$t('CreateConfigurationPointName')
        this.showImgPopup = true
      },
      handeCheckModalSubmitType () {
        if (this.modalType === 'create') {
          this.handleSetImage('formValidate2')
        } else if (this.modalType === 'fix') {
          this.handleSubmitFix()
        } else if (this.modalType === 'copy') {
          this.handleSubmitCopy()
        } else {
          this.handleSubmitRestore()
        }
      },
      /**
       * 创建配置点
       */
      handleSetImage (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.showImgPopup = false
            let image = this.$route.query.data.name
            let name = this.formValidate2.nameVal
            let data = { image, name }
            createImageProjectx(data, this.masterip).then((response) => {
              this.handleGetImageList()
            }, (err) => {
              this.$Notice.error({
                desc: this.$t(`kxLinuxErr.${err}`)
              })
            })
          } else {
            this.showImgPopup = true
          }
        })
      },
      handleImageReset (name) {
        this.showImgPopup = false
        this.$refs[name].resetFields()
      },
      handleRestore () {
        // Set_ImgBol 修改还原点属性
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.showPopup = false
            this.handleRestore()
          } else {
            this.$Message.error('验证失败!')
          }
        })
      },
      /**
       * 还原点
       */
      handleSet (index) {
        this.showPopup = true
        this.restoreListIndexValue = index // 配置点
        this.handleGetRestoreList(index)
      },
      /**
       * 调用获取还原点Api
       * 镜像名 配置编号 服务器
       */
  
      handleGetRestoreList (index) {
        getImageRestore(this.MirrorsInfoDate[0].name, index.no, this.masterip).then((resp) => {
          if (!resp.data.error) {
            this.configPointDate = resp.data.result.rollbackList || []
          }
        })
      },
      handleSubmitCopy () {
        this.loadingbtn = true
        var pno = this.copyIndexData.no
        if (pno === null) {
          pno = ''
        }
        let image = this.$route.query.data.name
        let name = this.formValidate2.nameVal
        let data = { image, name, pno }
        createImageProjectx(data, this.masterip).then((response) => {
          if (response.data.error === null && response.data.result === null) {
            this.$Message.success('复制成功！')
            this.tableData = []
            this.showImgPopup = false
            this.handleGetImageList() // 创建成功 获取配置列表
          } else {
            this.$Message.error(response.data.error)
          }
        }).finally(() => {
          this.loadingbtn = false
        })
      },
      handleCopy (index) {
        this.modalTitle = '配置点名称'
        this.modalType = 'copy'
        this.showImgPopup = true
        this.copyIndexData = index
        // console.log(JSON.stringify(index))
      },
      /**
       * 删除配置点
       */
      handleDelete (index) {
        // image, projectNO
        deleteImageProject(this.MirrorsInfoDate[0].name, index.no, this.masterip).then((response) => {
          if (!response.data.error) {
            this.$Message.success(this.$t('DeleteSucess'))
            this.handleGetImageList()
          }
        })
      },
      /**
       * 修改配置点
       */
      handleSubmitFix () {
        editImageProject(this.MirrorsInfoDate[0].name, this.configListIndexValue.no, this.formValidate2.nameVal, this.MirrorsInfoDate[0].menuItemName, this.masterip).then((resp) => {
          if (!resp.data.error) {
            this.$Message.success(this.$t('SetSucess'))
            this.showImgPopup = false
            this.handleGetImageList()
          } else {
            this.$Message.error(resp.data.error)
          }
        })
      },
      handleFix (index) {
        this.modalTitle = this.$t('editConfigPoint')
        this.modalType = 'fix'
        this.showImgPopup = true
        this.formValidate2 = index
        index.nameVal = index.name
        this.configListIndexValue = index
      },
      handleRadioGroup (val) {
        alert(val)
        mergeImageProject()
      },
      /**
       * 还原配置点
       * 镜像名称 配置点 还原点
       */
      handleSetRestore (index) { // 还原点还原
        this.loadSing = true
        let that = this
        let length = that.configPointDate.length
        if (length <= 1) {
          revertImageRestore(that.MirrorsInfoDate[0].name, that.restoreListIndexValue.no, String(index.no), that.masterip).then((resp) => {
            if (resp.data.error === null) {
              that.handleGetRestoreList(that.restoreListIndexValue)
            }
          }, () => {
            that.$Message.error(that.$t(`error`))
          }).finally(() => {
            this.loadSing = false
          })
        } else {
          this.$Modal.confirm({
            'title': this.$t('operationTip'),
            'content': this.$t('RestorePointTip'),
            'cancel-text': this.$t('cancelText'),
            'okText': this.$t('KonwContinue'),
            'loading': this.btnRestore,
            onOk () {
              this.btnRestore = true
              revertImageRestore(that.MirrorsInfoDate[0].name, that.restoreListIndexValue.no, String(index.no), that.masterip).then((resp) => {
                if (resp.data.error === null) {
                  that.handleGetRestoreList(that.restoreListIndexValue)
                }
              }, (e) => {
                that.$Message.error(that.$t(`kxLinuxErr.${e}`))
              }).finally(() => {
                that.$Modal.remove()
              })
            }
          })
        }
      },
      handleDeleteRestore (index) { // 删除还原点
        deleteImageRestore(this.MirrorsInfoDate[0].name, this.restoreListIndexValue.no, String(index.no), this.masterip).then((response) => {
          var result = response.data.result
          if (response.data.error === null && result === null) {
            this.showPopup = true
            this.$Message.success(this.$t('OperationSuccessful'))
            this.handleGetRestoreList(this.restoreListIndexValue) // 刷新还原点列表
          } else {
            this.$Message.error(response.data.error)
          }
        }, (e) => {
          this.$Message.error(this.$t(`kxLinuxErr.${e}`))
        })
      }
    }
  }
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float: none;}
  .ivu-divider-vertical{margin-left: -2px;}
  .ivu-divider{background-color: #b0b0b0;}
  .ivu-input-icon{right:55px;}
</style>
