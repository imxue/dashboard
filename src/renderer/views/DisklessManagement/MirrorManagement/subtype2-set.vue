<template>
  <div>
    <div class="topItem">
      <!-- <Button type="primary" class="topColumn" @click="handleButtonImport">导入</Button>
      <Button type="primary" class="topColumn" @click="handleButtonExport">导出</Button> -->
      <Button type="error" class="topColumn" @click="handleButtonDelete">{{$t('Delete')}}</Button>
      <!-- <Divider type="vertical" />
      <Button type="primary" class="topColumn" @click="handleButtonBuild">施工状态</Button>
      <Button type="primary" class="topColumn" @click="handleButtonStandby">待机状态</Button> -->
    </div>
    <!-- table -->
    <Table border :columns="tableColumns1" :data="tableData1" :no-data-text="this.$t('Nodata')"></Table>
    <Divider />
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonCreate">{{$t('Create')}}</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" :no-data-text="this.$t('Nodata')"></Table>
    <Modal
      :title="this.$t('CreateConfigurationPointName')"
      v-model="showImgPopup"
      width= "500"
      footer-hide
      class-name="vertical-center-modal">
      <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="100">
        <FormItem :label="labelName" prop="nameVal">
          <Input v-model="formValidate2.nameVal" :placeholder="this.$t('PleaseEnterConfigurationPointName')" clearable  />
        </FormItem>
        <FormItem class="buttonList">
             <Button type="primary" @click="handleSetImage('formValidate2')">{{$t('Save')}}</Button>
             <Button @click="handleImageReset('formValidate2')" style="margin-left: 8px">{{$t('cancelText')}}</Button>
        </FormItem>
      </Form>
     </Modal>
    <Modal
      :title="this.$t('RestoreConfigurationPoint')"
      v-model="showPopup"
      width="800"
      style="padding-bottom:50px"
      footer-hide>
      <Table border :columns="tableColumns3" :data="tableData3" :no-data-text="this.$t('Nodata')"></Table>
     </Modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import {
    getImageListx,
    deleteImage,
    createImageProject,
    getImageRestore,
    deleteImageProject,
    editImageProject,
    revertImageRestore,
    deleteImageRestore,
    createImageProjectx
  } from '@/api/wupan'
  export default {
    name: 'subType2-1',
    data () {
      return {
        modalType: 'create',
        modalTitle: '创建配置点',
        labelName: '配置点名称:',
        showImgPopup: false,
        showPopup: false,
        configList: [],
        copyIndexData: [],
        configListIndexValue: '', // 当前配置点 row value
        restoreListIndexValue: '', // 当前还原点 row value
        ImageDataList: [],
        tableColumns1: [
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
        tableData1: [],
        tableColumns: [
          { key: 'name', renderHeader: (h, params) => { return h('span', this.$t('ConfigurationPointName')) } },
          { key: 'fileSizeB', renderHeader: (h, params) => { return h('span', this.$t('ConfigurationPackageSize')) } },
          {
            renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            width: 400,
            key: 'operation',
            render: (h, params) => {
              // let type = params.row.state<Tag closable color="blue">标签一</Tag>
              let a = h('Button', {
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
              }, this.$t('Detele'))
              let d = h('Button', { props: { type: 'info' },
                on: { click: () => { this.handleFix(params.row) } }
              }, this.$t('modify'))
              return [a, b, c, d]
            }
          }
        ],
        tableData: [],
        formValidate2: { nameVal: '' },
        ruleValidate2: { nameVal: [{ required: true, message: '不能为空', trigger: 'blur' }] },
        formValidate: { config: '' },
        ruleValidate: { config: [{ required: true, message: '不能为空', trigger: 'change' }] },
        tableColumns3: [
          { key: 'no', renderHeader: (h, params) => { return h('span', this.$t('RestorePpointName')) } },
          { key: 'comment', renderHeader: (h, params) => { return h('span', this.$t('RestorePointNote')) } },
          {
            renderHeader: (h, params) => { return h('span', this.$t('ChangeTime')) },
            key: 'dataModifyTime',
            render: (h, params) => {
              return h('span', moment(params.row.dataModifyTime).format('YYYY-MM-DD HH:mm:ss'))
            }
          },
          { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            width: 400,
            key: 'operation',
            render: (h, params) => {
              let a = h('Button', {
                props: { type: 'primary' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleSetRestore(params.row) } }
              }, this.$t('Revert'))
              let b = h('Button', {
                props: { type: 'error' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleDeleteRestore(params.row) } }
              }, this.$t('Delete'))
              return [a, b]
            }
          }
        ],
        tableData3: []
      }
    },
    created () {
      // console.log(JSON.stringify(this.$route.query.data))
      var data = this.$route.query.data
      this.tableData1.push(data) // 镜像信息 Get_Img
      this.handleGetImageList()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleGetImageList () {
        getImageListx(localStorage.getItem('masterip')).then((a) => {
          var arr = a.data.result.list
          if (a.data.error === null && arr.length !== null) {
            var newArr = arr.filter(item => item.name === this.tableData1[0].name)
            this.tableData = newArr[0].profileList
          } else {
            this.ImageDataList = []
          }
        })
      },
      handleCheckCallBack () {},
      handleCreatImgPro () {
        var restoreNo = this.$route.query.data.profileList[0].rollbackList
        if (restoreNo === null) {
          restoreNo = ''
        } else {
          restoreNo = String(restoreNo.length)
        }
        // 创建配置点 image, projectNO, restoreNo, name, title
        createImageProject(this.tableData1[0].name, this.tableData[0].no, restoreNo, this.formValidate2.nameVal, this.tableData1[0].menuItemName).then((a) => {
          if (a.data.error === null && a.data.result === null) {
            this.$Message.success('创建成功！')
            this.tableData = []
            this.handleGetImageList() // 创建成功 获取配置列表
            // 创建成功 this.handleGetImgPro()
          } else {
            this.$Message.error(a.data.error)
          }
        })
      },
      handleButtonImport () {},
      handleButtonExport () {},
      handleButtonDelete () { // 删除镜像
        deleteImage(this.tableData1[0].name).then((a) => {
          if (a.data.error === null && a.data.result === null) {
            this.$Message.success('删除成功！')
            this.$router.go(-1)
          } else {
            this.$Message.error(a.data.error)
          }
        })
      },
      handleButtonBuild () {},
      handleButtonStandby () {},
      handleButtonCreate () {
        this.modalType = 'create'
        this.showImgPopup = true
      },
      handeCheckModalSubmitType () {
        if (this.modalType === 'create') {
          this.handleCreatImgPro()
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
            createImageProjectx(data, localStorage.getItem('masterip')).then((e) => {
              if (e.error == null) {
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
      handleReset (name) {
        this.$refs[name].resetFields()
        this.showPopup = false
      },
      handleSet (index) {
        this.showPopup = true
        this.restoreListIndexValue = index
        this.handleGetRestoreList(index)
      },
      handleGetRestoreList (index) {
        // image, projectNO
        getImageRestore(this.tableData1[0].name, index.no).then((a) => {
          var result = a.data.result.rollbackList
          if (a.data.error === null) {
            if (result !== null) {
              this.tableData3 = result
            }
          } else {
            this.$Message.error(a.data.error)
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
        createImageProject(this.tableData1[0].name, this.copyIndexData.no, restoreNo, this.formValidate2.nameVal, this.tableData1[0].menuItemName).then((a) => {
          if (a.data.error === null && a.data.result === null) {
            this.$Message.success('创建成功！')
            this.tableData = []
            this.handleGetImageList() // 创建成功 获取配置列表
          } else {
            this.$Message.error(a.data.error)
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
      handleDelete (index) {
        // image, projectNO
        deleteImageProject(this.tableData1[0].name, index.no).then((a) => {
          var result = a.data.result
          if (a.data.error === null && result === null) {
            this.$Message.success('成功删除配置点')
            this.handleGetImageList()
          } else {
            this.$Message.error(a.data.error)
          }
          this.handleGetImageList()
        })
      },
      handleSubmitFix () {
        console.log('handleSubmitFix&&&')
        // image, projectNO, name, title
        editImageProject(this.tableData1[0].name, this.configListIndexValue.no, this.formValidate2.nameVal, this.tableData1[0].menuItemName).then((a) => {
          var result = a.data.result
          if (a.data.error === null && result === null) {
            this.$Message.success('修改成功')
            this.handleGetImageList()
            // this.configList = result
            // 创建成功 获取还原点列表 this.handleGetImgPro()
          } else {
            this.$Message.error(a.data.error)
          }
        })
      },
      handleFix (index) {
        this.modalTitle = '修改配置点'
        this.modalType = 'fix'
        this.showImgPopup = true
        this.configListIndexValue = index
      },
      handleRadioGroup (val) {
        alert(val)
      },
      handleSetRestore (index) { // 还原点还原
        // image, projectNO, restoreNO
        revertImageRestore(this.tableData1[0].name, this.restoreListIndexValue.no, String(index.no)).then((a) => {
          var result = a.data.result
          if (a.data.error === null && result === null) {
            this.showPopup = true
            this.$Message.success('修改成功')
            this.handleGetRestoreList(this.restoreListIndexValue) // 刷新还原点列表
          } else {
            this.$Message.error(a.data.error)
          }
        })
      },
      handleDeleteRestore (index) { // 删除还原点
        // image, projectNO, restoreNO
        deleteImageRestore(this.tableData1[0].name, this.restoreListIndexValue.no, String(index.no)).then((a) => {
          var result = a.data.result
          if (a.data.error === null && result === null) {
            this.showPopup = true
            this.$Message.success('修改成功')
            this.handleGetRestoreList(this.restoreListIndexValue) // 刷新还原点列表
          } else {
            this.$Message.error(a.data.error)
          }
        })
      },
      handleFixRestore (index) { // 修改还原点
        this.modalTitle = '还原点备注'
        this.labelName = '还原点备注：'
        this.modalType = 'restore'
        this.showImgPopup = true
      }
    }
  }
</script>

<style scoped>
  .topItem{ height: 60px;}
  /* .topColumn{ float:left; margin-right:10px;} */
  .topColumn{ float: none;}
  .ivu-divider-vertical{margin-left: -2px;}
  .ivu-divider{background-color: #b0b0b0;}
  .ivu-input-icon{right:55px;}
</style>
