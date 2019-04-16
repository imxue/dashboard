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
      class-name="vertical-center-modal">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
        <FormItem label="镜像名称:" prop="nameVal">
          <Input v-model="formValidate.nameVal" placeholder="请输入镜像名称..." clearable  />
        </FormItem>
        <FormItem class="buttonList">
            <Button type="primary" @click="handleSubmit('formValidate')">分配</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
     </Modal>
  </div>
</template>

<script>
  import { getPcGroup, deleteItem } from '@/api/wupan'
  export default {
    name: 'subType3-1',
    data () {
      return {
        showPopup: false,
        tableColumns: [
          { title: '启动方案名称', key: 'name' },
          {
            title: '可用镜像',
            key: 'imgG',
            render: (h, params) => {
              var list = params.row.imgG
              if (list === null) {
                return h('span', '0')
              } else {
                return h('span', list.length)
              }
            }
          },
          {
            title: '状态',
            key: 'disable',
            render: (h, params) => {
              switch (params.row.disable) {
                case '1':
                  return h('span', {
                    style: { color: '#bcbcbc' }
                  }, '禁用')
                case '0':
                  return h('span', '启用')
                default:
                  return h('span', '-')
              }
            }
          },
          { title: '操作',
            width: 300,
            key: 'operation',
            render: (h, params) => {
              // let type = params.row.state<Tag closable color="blue">标签一</Tag>
              let a = h('Button', {
                props: { type: 'primary' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleEdit(params.row) } }
              }, '编辑')
              // let b = h('Button', {
              //   props: { type: 'primary' },
              //   style: { marginRight: '10px' },
              //   on: { click: () => { this.handleStart(params.row) } }
              // }, '启用')
              // let c = h('Button', {
              //   props: { type: 'primary' },
              //   style: { marginRight: '10px' },
              //   on: { click: () => { this.handleStop(params.row) } }
              // }, '停用')
              let d = h('Button', { props: { type: 'error' },
                on: { click: () => { this.handleDelete(params) } }
              }, '删除')
              // return [a, b, c, d]

              return [a, d]
            }
          }
        ],
        tableData: [],
        formValidate: { nameVal: '' },
        ruleValidate: { nameVal: [{ required: true, message: '不能为空', trigger: 'blur' }] }
      }
    },
    created () {
      this.handleGetPcGroup()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleGetPcGroup () {
        getPcGroup().then((a) => {
          var arr = a.data.result.list
          if (a.data.error === null) {
            this.tableData = arr
          } else {
            this.$Message.error(a.data.error)
          }
        })
      },
      handleButtonAdd (val) {
        this.$router.push({ path: 'subtype3-edit' })
        // this.showPopup = true
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.showPopup = false
            this.$Message.success('Success!')
          } else {
            this.$Message.error('Fail!')
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
        this.showPopup = false
      },
      handleEdit (index) {
        this.$router.push({
          path: 'subtype3-edit',
          query: { data: index }
        })
        console.dir(index)
      },
      handleStart () {},
      handleStop () {},
      handleDelete (row) {
        if (row.row.name === 'default') {
          this.$Modal.confirm({
            title: '警告',
            content: '<p>不允许删除默认方案</p>',
            onOk: () => {
  
            },
            onCancel: () => {
  
            }
          })
        } else {
          this.$Modal.confirm({
            title: '警告',
            content: '<p>删除会导致使用该方案的客户机无法使用</p>',
            onOk: () => {
              deleteItem(row.row.name).then((response) => {
                this.handleGetPcGroup()
              })
            },
            onCancel: () => {
              this.$Message.info('Clicked cancel')
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
  .ivu-modal-footer{display: none;}
</style>
