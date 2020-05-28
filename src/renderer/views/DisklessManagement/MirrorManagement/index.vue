<template>
  <div>
    <div class="topItem">
      <Button type="primary" class="topColumn" :disabled="!this.masterip" @click="handleButtonAdd" :loading="loadingAdd">{{$t('Add')}}</Button>
    </div>
    <!-- table -->
    <Table border stripe @on-row-dblclick="handleSet" ref="selection" :columns="tableColumns" :data="mirrorList"></Table>
    <Modal
      :title="this.$t('AddMirror')"
      v-model="showPopup"
      width= "500"
      footer-hide>
      <Form ref="mirrorData" :model="mirrorData" :rules="ruleValidate" :label-width="135">
        <FormItem :label="this.$t('MirrorName')+'：'" prop="name">
          <Input v-model="mirrorData.name" :placeholder="this.$t('pleaseInputMirror')" />
        </FormItem>
         <FormItem :label="this.$t('MirrorSize')+'：'" prop="size">
          <Row><Input v-model="mirrorData.size" :placeholder="this.$t('pleaseInputMirrorSize') + ' GB'" /></Row>
        </FormItem>
        <FormItem :label="this.$t('SavePath')+'：'" prop="path">
          <Select v-model="mirrorData.path" :placeholder="this.$t('pleaseInputSavePath')"  >
        
                   <Option  :value="item.path" v-for="(item, index) in diskList" :key="index" >
                     {{item.path}}
              <Poptip :title="Title" :content="content">
                  <p>{{$t('AvailableSpace')}} {{item.availableSize}}</p>
                   </Poptip>
                   </Option>        
          </Select>
        </FormItem>
        <FormItem :label="this.$t('MappingDiskSymbol')+'：'" prop="mountVol">
          <Input v-model="mirrorData.mountVol" disabled :placeholder="this.$t('pleaseInput')" />
        </FormItem>


         <FormItem :label="this.$t('importPrimaryServer')+'：'" prop="isImportFormMaster">
             <Select v-model="mirrorData.isImportFormMaster" disabled :placeholder="this.$t('pleaseInputSavePath')">
              <Option value="yes">yes</Option>
              <Option value="no">no</Option>
            </Select>
        </FormItem>
        <FormItem class="buttonList">
             <Button type="primary" @click="handleSubmit('mirrorData')">{{$t('Save')}}</Button>
             <Button @click="handleReset('mirrorData')" style="margin-left: 8px">{{$t('cancelText')}}</Button>
        </FormItem>
      </Form>
     </Modal>
  </div>
</template>

<script>
  import { getImageListx, createImagex, getDiskStatusx, deleteImagex, getServers } from '@/api/wupan'
  import { bytesToSize2, bytesToSize } from '@/utils/index'
  export default {
    name: 'mirrorManagement',
    data () {
      return {
        showPopup: false,
        diskList: [],
        masterip: this.$store.state.app.masterip || '',
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
            renderHeader: (h, params) => { return h('span', this.$t('TakeupSpace')) },
            key: 'fileSizeB',
            render: (h, params) => {
              var value = params.row.fileSizeB
              if (value === '0' || value === 'undefined' || value === 'null') {
                return h('span', '0')
              } else {
                return h('span', bytesToSize2(params.row.fileSizeB))
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
              // let c = h('Button', {
              //   props: { type: 'primary' },
              //   style: { marginRight: '10px' },
              //   on: { click: () => { this.handleImport(params.row) } }
              // }, this.$t('Import'))
              // let d = h('Button', {
              //   props: { type: 'primary' },
              //   style: { marginRight: '10px' },
              //   on: { click: () => { this.handleExport(params.row) } }
              // }, this.$t('Export'))
              let e = h('Button', { props: { type: 'error' },
                on: { click: () => { this.handleDelete(params.row) } }
              }, this.$t('Delete'))
              // return [a, c, d, e]
              return [a, e]
            }
          }
        ],
        mirrorList: [],
        mirrorData: {
          name: '',
          size: '',
          path: '',
          menuItemName: 'winxp　系统',
          cacheSize: '512',
          mountVol: 'z',
          isImportFormMaster: 'yes'
        },
        loadingAdd: false,
        ruleValidate: {
          name: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          size: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          path: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }]
        }
      }
    },
    created () {
      console.log(this.masterip)
      this.handleGetImageList()
    },
    methods: {
      /**
       * 获取磁盘
       */
      handleGetDiskStatus () {
        if (!this.masterip) {
          this.loadingAdd = false
          return
        }
  
        getDiskStatusx(this.masterip).then((response) => {
          let temp = []
          let _this = this
          var arr = response.data.result.list || []
          var newArr = arr.filter(item => item.fun === 'imageDisk') // 获取镜像盘
          if (newArr.length === 0) {
            this.$Modal.confirm({
              title: this.$t('prompt'),
              content: this.$t('tip2'),
              onOk: () => {
                let serverList
                let data = {}
                getServers(_this.masterip).then(resp => {
                  serverList = resp.data.result.list ? resp.data.result.list : []
                  data = serverList.filter(item => { return item.isMaster === '1' })
                  data = data[0]
                  this.$router.push({
                    path: '/Diskless/DisklessServer/DisklessServerDetail',
                    query: { data, serverList }
                  })
                })
              }
            })
          } else {
            this.showPopup = true
            for (var i in newArr) {
              temp.push({
                path: newArr[i].path,
                availableSize: bytesToSize(Number(newArr[i].availableSize))
              })
            }
            this.diskList = temp
            this.mirrorData.path = this.diskList[0].path
            temp = []
          }
        }).finally(() => {
          this.loadingAdd = false
        })
      },
      /**
       * 获取镜像列表
       */
      handleGetImageList () {
        if (!this.masterip) return
        getImageListx(this.masterip).then((response) => {
          this.mirrorList = response.data.result.list || []
        }, (error) => {
          this.$Notice.error({
            desc: error
          })
        })
      },
      handleButtonAdd (val) {
        this.loadingAdd = true
        this.handleGetDiskStatus() // 获取磁盘路径list
      },
      handleSubmit (name) {
        var _this = this
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.showPopup = false
            console.log(_this.mirrorData)
            createImagex(this.masterip, _this.mirrorData).then((response) => {
              _this.handleGetImageList()
              this.$refs[name].resetFields()
            }, (e) => {
              this.$Message.error({
                content: this.$t(`kxLinuxErr.${e}`),
                duration: 10
              })
            })
          } else {
            this.showPopup = true
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
        this.showPopup = false
      },
      handleSet (index) {
        this.$router.push({
          path: 'ConfigPoint',
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
          onOk: () => {
            deleteImagex(name.name, this.masterip).then(() => {
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
