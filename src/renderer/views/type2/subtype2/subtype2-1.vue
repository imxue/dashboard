<template>
  <div>
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonAdd">添加</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData"></Table>
    <Modal
      title="添加镜像"
      v-model="showPopup"
      width= "500"
      footer-hide>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="135">
        <FormItem label="镜像名称：" prop="nameVal">
          <Input v-model="formValidate.nameVal" placeholder="请输入镜像名称..." />
        </FormItem>
         <FormItem label="镜像大小：" prop="size">
          <Row><Input v-model="formValidate.size" placeholder="请输入镜像大小..." />* 单位：GB</Row>
        </FormItem>
        <!-- <FormItem label="菜单在显示名称:" prop="menuItemName">
          <Input v-model="formValidate.menuItemName" placeholder="请输入显示名称..." />
        </FormItem> -->
        <FormItem label="保存路径：" prop="path">
          <Select v-model="formValidate.path" placeholder="——请选择保存路径——" >
            <Option v-for="(item, index) in diskList" :key="index" :value="item.path"> {{item.path}}</Option>
          </Select>
        </FormItem>
        <FormItem label="映射盘符：" prop="mountVol">
          <Input v-model="formValidate.mountVol" disabled placeholder="请输入映射盘符..." />
        </FormItem>
         <FormItem label="是否从主服务器导入：" prop="isImportFormMaster">
             <Select v-model="formValidate.isImportFormMaster" disabled placeholder="——请选择——">
              <Option value="yes">yes</Option>
              <Option value="no">no</Option>
            </Select>
        </FormItem>
        <FormItem class="buttonList">
             <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
             <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
     </Modal>
  </div>
</template>

<script>
  import { getImageList, createImage, getDiskStatus } from '@/api/wupan'
  import { bytesToSize } from '@/utils/index'
  export default {
    name: 'subType2-1',
    data () {
      return {
        showPopup: false,
        diskList: [],
        tableColumns: [
          { title: '镜像名称', key: 'name' },
          {
            title: '镜像大小',
            key: 'size',
            render: (h, params) => {
              return h('span', params.row.size + 'GB')
            }
          },
          {
            title: '占用空间',
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
            title: '配置个点数',
            // key: 'profileList',
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
          // { title: '状态', key: 'state' },
          { title: '操作',
            width: 400,
            key: 'operation',
            render: (h, params) => {
              // let type = params.row.state<Tag closable color="blue">标签一</Tag>
              let a = h('Button', {
                props: { type: 'primary' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleSet(params.row) } }
              }, '配置')
              // let b = h('Button', {
              //   props: { type: 'primary' },
              //   style: { marginRight: '10px' },
              //   on: { click: () => { this.handleCopy(params.row) } }
              // }, '复制')
              let c = h('Button', {
                props: { type: 'primary' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleImport(params.row) } }
              }, '导入')
              let d = h('Button', {
                props: { type: 'primary' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleExport(params.row) } }
              }, '导出')
              let e = h('Button', { props: { type: 'error' },
                on: { click: () => { this.handleDelete(params.row) } }
              }, '删除')
              return [a, c, d, e]
            }
          }
        ],
        tableData: [
          { id: 1, name: '镜像名称', size: '56.11', space: '10.85 GB', number: '1202002', state: '施工中' },
          { id: 2, name: '镜像名称', size: '56.11', space: '10.85 GB', number: '1202002', state: '施工中' }
        ],
        formValidate: {
          nameVal: '',
          size: '',
          path: '',
          menuItemName: '',
          cacheSize: '',
          mountVol: 'z',
          isImportFormMaster: 'yes'
        },
        ruleValidate: { nameVal: [{ required: true, message: '不能为空', trigger: 'blur' }] }
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
      // handleCheckLength (arr) {
      //   if (arr !== null) {
      //     console.log(JSON.stringify(arr) + arr.length)
      //     return arr.length
      //   } else {
      //     return '-'
      //   }
      // },
      handleGetDiskStatus () { // get磁盘
        getDiskStatus().then((a) => {
          var arr = a.data.result.list
          if (a.data.error === null && arr.length !== null) {
            var newArr = arr.filter(item => item.fun === 'imageDisk')
            for (var i in newArr) {
              this.diskList.push({
                path: newArr[i].path
              })
            }
          } else {
            this.$Message.error(a.data.error)
          }
        })
      },
      handleGetImageList () {
        getImageList().then((a) => {
          var arr = a.data.result.list
          if (a.data.error === null && arr.length !== null) {
            this.tableData = arr
          } else {
            this.$Message.error(a.data.error)
          }
        })
      },
      handleButtonAdd (val) {
        this.showPopup = true
        this.handleGetDiskStatus() // 获取磁盘路径list
      },
      handleSubmit (name) {
        var self = this
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.showPopup = false
            // name, sizeGB, title, path, cacheSizeMB, mountVolume, isImportFormMaster
            createImage(this.formValidate.nameVal, this.formValidate.size, this.formValidate.menuItemName, this.formValidate.path, this.formValidate.cacheSize, this.formValidate.mountVol, this.formValidate.isImportFormMaster).then((a) => {
              if (a.data.error === null) {
                self.$Message.success('添加成功')
                self.handleGetImageList()
              } else {
                self.$Message.error(a.data.error)
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
      // handleCopy (index) {
      //   // name, sizeGB, title, path, cacheSizeMB, mountVolume, isImportFormMaster
      //   createImage(index.image, index.size, index.menuItemName, index.path, index.cacheSize, index.mountVol, index.isImportFormMaster).then((a) => {
      //     if (a.data.error === null) {
      //       this.$Message.success('复制成功')
      //       this.handleGetImageList()
      //     } else {
      //       this.$Message.error(a.data.error)
      //     }
      //   })
      // },
      handleImport () {},
      handleExport () {},
      handleDelete (index) {
        this.tableData.splice(index, 1)
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
