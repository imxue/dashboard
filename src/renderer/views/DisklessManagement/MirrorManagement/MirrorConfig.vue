<template>
  <div>
    <div class="topItem">
      <!-- <Button type="primary" class="topColumn" @click="handleButtonImport">导入</Button>
      <Button type="primary" class="topColumn" @click="handleButtonExport">导出</Button> -->
      <Button type="error" class="topColumn" @click="handleDeleteMirrors">{{$t('Delete')}}</Button>
      <!-- <Divider type="vertical" />
      <Button type="primary" class="topColumn" @click="handleButtonBuild">施工状态</Button>
      <Button type="primary" class="topColumn" @click="handleButtonStandby">待机状态</Button> -->
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
      width= "500"
      footer-hide
      class-name="vertical-center-modal">
      <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="100">
        <FormItem :label="labelName" prop="nameVal">
          <Input v-model="formValidate2.nameVal" :placeholder="this.$t('PleaseEnterConfigurationPointName')" clearable  />
        </FormItem>
        <FormItem class="buttonList">
             <Button type="primary" @click="handeCheckModalSubmitType('formValidate2')">{{$t('Save')}}</Button>
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
  import { bytesToSize } from '@/utils/index'
  import {
    getImageListx,
    deleteImagex,
    createImageProject,
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
        modalType: 'create',
        modalTitle: this.$t('CreateConfigurationPointName'),
        labelName: this.$t('ConfigurationName'),
        showImgPopup: false,
        showPopup: false,
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
          { title: '占用空间', key: 'fileSizeB', renderHeader: (h, params) => { return h('span', this.$t('TakeupSpace')) } },
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
              return h('span', bytesToSize(params.row.fileSizeB))
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
              // let b = h('Button', {
              //   props: { type: 'primary' },
              //   style: { marginRight: '10px' },
              //   on: { click: () => { this.handleCopy(params.row) } }
              // }, this.$t('Copy'))
              let c = h('Button', {
                props: { type: 'error' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleDelete(params.row) } }
              }, this.$t('Delete'))
              let d = h('Button', { props: { type: 'info' },
                on: { click: () => { this.handleFix(params.row) } }
              }, this.$t('modify'))
              if (params.row.name === 'default') {
                return [response]
              } else {
                return [response, c, d]
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
            minWidth: 150,
            renderHeader: (h, params) => { return h('span', this.$t('RestorePpointNo')) }
          },
          { key: 'comment',
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
            render: (h, params) => {
              let response = h('Button', {
                props: { type: 'primary' },
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
            let ip = localStorage.getItem('masterip')
            deleteImagex(name, ip).then(() => {
              this.$router.push({
                path: 'subType2-1'
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
        getImageListx(localStorage.getItem('masterip')).then((response) => {
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
            createImageProjectx(data, localStorage.getItem('masterip')).then((response) => {
              if (!response.data.error) {
                this.handleGetImageList()
              }
            }, (err) => {
              console.log(err)
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
        getImageRestore(this.MirrorsInfoDate[0].name, index.no, localStorage.getItem('masterip')).then((resp) => {
          if (!resp.data.error) {
            this.configPointDate = resp.data.result.rollbackList || []
          }
        })
      },
      handleSubmitCopy () {
        var restoreNo = this.copyIndexData.rollbackList
        if (restoreNo === null) {
          restoreNo = ''
        } else {
          restoreNo = String(restoreNo.length)
        }
        // 创建配置点 image, projectNO, restoreNo, name, title
        createImageProject(this.MirrorsInfoDate[0].name, this.copyIndexData.no, restoreNo, this.formValidate2.nameVal, this.MirrorsInfoDate[0].menuItemName).then((response) => {
          if (response.data.error === null && response.data.result === null) {
            this.$Message.success('创建成功！')
            this.tableData = []
            this.handleGetImageList() // 创建成功 获取配置列表
          } else {
            this.$Message.error(response.data.error)
          }
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
        deleteImageProject(this.MirrorsInfoDate[0].name, index.no, localStorage.getItem('masterip')).then((response) => {
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
        editImageProject(this.MirrorsInfoDate[0].name, this.configListIndexValue.no, this.formValidate2.nameVal, this.MirrorsInfoDate[0].menuItemName, localStorage.getItem('masterip')).then((resp) => {
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
        let that = this
        let length = that.configPointDate.length
        if (length <= 1) {
          revertImageRestore(that.MirrorsInfoDate[0].name, that.restoreListIndexValue.no, String(index.no), localStorage.getItem('masterip')).then((resp) => {
            if (resp.data.error === null) {
              that.handleGetRestoreList(that.restoreListIndexValue)
            }
          })
        } else {
          this.$Modal.confirm({
            'title': this.$t('operationTip'),
            'content': this.$t('RestorePointTip'),
            'cancel-text': this.$t('cancelText'),
            'okText': this.$t('KonwContinue'),
            onOk () {
              revertImageRestore(that.MirrorsInfoDate[0].name, that.restoreListIndexValue.no, String(index.no), localStorage.getItem('masterip')).then((resp) => {
                if (resp.data.error === null) {
                  that.handleGetRestoreList(that.restoreListIndexValue)
                }
              })
            }
          })
        }
      },
      handleDeleteRestore (index) { // 删除还原点
        deleteImageRestore(this.MirrorsInfoDate[0].name, this.restoreListIndexValue.no, String(index.no), localStorage.getItem('masterip')).then((response) => {
          var result = response.data.result
          if (response.data.error === null && result === null) {
            this.showPopup = true
            this.$Message.success(this.$t('OperationSuccessful'))
            this.handleGetRestoreList(this.restoreListIndexValue) // 刷新还原点列表
          } else {
            this.$Message.error(response.data.error)
          }
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
