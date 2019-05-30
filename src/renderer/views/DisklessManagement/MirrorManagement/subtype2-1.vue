<template>
  <div>
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonAdd">{{$t('Add')}}</Button>
    </div>
    <!-- table -->
    <Table border stripe @on-row-dblclick="handleSet" ref="selection" :columns="tableColumns" :data="mirroringInfo" :no-data-text="this.$t('Nodata')"></Table>
    <Modal
      :title="this.$t('AddMirror')"
      v-model="showPopup"
      width= "500"
      footer-hide>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="135">
        <FormItem :label="this.$t('MirrorName')+'：'" prop="nameVal">
          <Input v-model="formValidate.nameVal" :placeholder="this.$t('pleaseInputMirror')" />
        </FormItem>
         <FormItem :label="this.$t('MirrorSize')+'：'" prop="size">
          <Row><Input v-model="formValidate.size" :placeholder="this.$t('pleaseInputMirrorSize') + ' GB'" /></Row>
        </FormItem>
        <FormItem :label="this.$t('SavePath')+'：'" prop="path">
          <Select v-model="formValidate.path" :placeholder="this.$t('pleaseInputSavePath')"  >
         
              <Tooltip placement="right"  v-for="(item, index) in diskList" :key="index">
      <Option  :value="item.path" >{{item.path}}</Option>
        <div slot="content">
            <p>{{$t('AvailableSpace')}} {{item.availableSize}}</p>
        </div>

    </Tooltip>
          </Select>
        </FormItem>
        <FormItem :label="this.$t('MappingDiskSymbol')+'：'" prop="mountVol">
          <Input v-model="formValidate.mountVol" disabled :placeholder="this.$t('pleaseInput')" />
        </FormItem>
         <FormItem :label="this.$t('importPrimaryServer')+'：'" prop="isImportFormMaster">
             <Select v-model="formValidate.isImportFormMaster" disabled :placeholder="this.$t('pleaseInputSavePath')">
              <Option value="yes">yes</Option>
              <Option value="no">no</Option>
            </Select>
        </FormItem>
        <FormItem class="buttonList">
             <Button type="primary" @click="handleSubmit('formValidate')">{{$t('Save')}}</Button>
             <Button @click="handleReset('formValidate')" style="margin-left: 8px">{{$t('cancelText')}}</Button>
        </FormItem>
      </Form>
     </Modal>
  </div>
</template>

<script>
  import { getImageListx, createImagex, getDiskStatusx, deleteImagex } from '@/api/wupan'
  import { bytesToSize } from '@/utils/index'
  export default {
    name: 'subType2-1',
    data () {
      return {
        showPopup: false,
        diskList: [],
        serverlist: '',
        tableColumns: [
          { key: 'name', renderHeader: (h, params) => { return h('span', this.$t('MirrorName')) } },
          {
            renderHeader: (h, params) => { return h('span', this.$t('MirrorSize')) },
            key: 'size',
            render: (h, params) => {
              return h('span', params.row.size + 'GB')
            }
          },
          {
            renderHeader: (h, params) => { return h('span', this.$t('MirrorSize')) },
            key: 'fileSizeB',
            render: (h, params) => {
              var value = params.row.fileSizeB
              if (value === '0' || value === 'undefined' || value === 'null') {
                return h('span', '0')
              } else {
                return h('span', bytesToSize(params.row.fileSizeB))
              }
            }
          },
          {
            renderHeader: (h, params) => { return h('span', this.$t('ConfigurePoints')) },
            key: 'profileList',
            render: (h, params) => {
              var arr = params.row.profileList
              if (arr !== null || arr !== undefined) {
                var newArr = []
                for (var i in arr) {
                  newArr.push({
                    no: arr[i].no
                  })
                }
                return h('span', newArr.length)
              } else {
                return h('span', '0')
              }
            }
          },
          { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            width: 400,
            key: 'operation',
            render: (h, params) => {
              let a = h('Button', {
                props: { type: 'primary' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleSet(params.row) } }
              }, this.$t('Configure'))
              let c = h('Button', {
                props: { type: 'primary' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleImport(params.row) } }
              }, this.$t('Import'))
              let d = h('Button', {
                props: { type: 'primary' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleExport(params.row) } }
              }, this.$t('Export'))
              let e = h('Button', { props: { type: 'error' },
                on: { click: () => { this.handleDelete(params.row) } }
              }, this.$t('Delete'))
              return [a, c, d, e]
            }
          }
        ],
        mirroringInfo: [],
        formValidate: {
          nameVal: '',
          size: '',
          diskSize: '',
          path: '',
          menuItemName: '',
          cacheSize: '',
          mountVol: 'z',
          isImportFormMaster: 'yes'
        },
  
        ruleValidate: {
          nameVal: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          size: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          path: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }]
        }
      }
    },
    created () {
      this.handleGetImageList()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      /**
       * 获取磁盘
       */
      handleGetDiskStatus () {
        getDiskStatusx(localStorage.getItem('masterip')).then((response) => {
          if (response.data.ok) {
            let temp = []
            var arr = response.data.data.result.list || []
            var newArr = arr.filter(item => item.fun === 'imageDisk')
            for (var i in newArr) {
              temp.push({
                path: newArr[i].path,
                availableSize: bytesToSize(Number(newArr[i].availableSize))
              })
              this.diskList = temp
              temp = []
            }
          }
        })
      },
      /**
       * 获取镜像列表
       */
      handleGetImageList () {
        getImageListx(localStorage.getItem('masterip')).then((response) => {
          if (response.data.ok) {
            this.mirroringInfo = response.data.data.result.list || []
          }
        })
      },
      handleButtonAdd (val) {
        this.showPopup = true
        this.handleGetDiskStatus() // 获取磁盘路径list
        this.handlegetServerlist() // 获取服务器
      },
      handleSubmit (name) {
        var self = this
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.showPopup = false
            // name, sizeGB, title, path, cacheSizeMB, mountVolume, isImportFormMaster
            createImagex(this.formValidate.nameVal, this.formValidate.size, this.formValidate.menuItemName, this.formValidate.path, this.formValidate.cacheSize, this.formValidate.mountVol, this.formValidate.isImportFormMaster, localStorage.getItem('masterip')).then((response) => {
              if (response.data.ok) {
                self.handleGetImageList()
                this.$refs[name].resetFields()
              }
            })
          } else {
            this.showPopup = true
            this.$Message.error('验证失败!')
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
        this.showPopup = false
      },
      handleSet (index) {
        this.$router.push({
          path: 'subtype2-set',
          query: { data: index }
        })
      },
      handleImport () {},
      handleExport () {},
      /*
      删除镜像
      */
      handleDelete (name) {
        this.$Modal.confirm({
          title: this.$t('DeleteTip'),
          content: this.$t('DeleteDec'),
          okText: this.$t('Confirm'),
          cancelText: this.$t('cancelText'),
          onOk: () => {
            let ip = localStorage.getItem('masterip')
            deleteImagex(name.name, ip).then(() => {
              this.handleGetImageList()
            })
          },
          onCancel: () => {

          }
        })
      },
      handleEdit () {}
    }
  }
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
  .ivu-modal .ivu-modal-footer{display: none !important;}
</style>
