<template>
  <div>
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonAdd">添加</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox"></Table>
    <Modal
      title="添加镜像"
      v-model="showPopup"
      @on-ok="handleConfirm"
      @on-cancel="handleCancel"
      class-name="vertical-center-modal">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem>
          <Input v-model="formValidate.nameVal" placeholder="请输入镜像名称..." clearable style="width: 200px;" />
        </FormItem>
      </Form>
     </Modal>
  </div>
</template>

<script>
  export default {
    name: 'subType1-2',
    data () {
      return {
        showPopup: false,
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        tableColumns: [
          { title: '镜像名称', key: 'state' },
          { title: '镜像大小', key: 'size' },
          { title: '占用空间', key: 'space' },
          { title: '配置个点数', key: 'number' },
          { title: '状态', key: 'state' },
          { title: '操作',
            key: 'operation',
            render: (h, params) => {
              // let type = params.row.state<Tag closable color="blue">标签一</Tag>
              let a = h('Button', { props: { type: 'primary' },
                on: { click: () => { this.handleSet(params.row) } }
              }, '配置点')
              // let b = h('Button', { props: { type: 'primary' },
              //   on: { click: () => { this.handleCopy(params.row) } }
              // }, '复制')
              // let c = h('Button', { props: { type: 'primary' },
              //   on: { click: () => { this.handleImport(params.row) } }
              // }, '导入')
              // let d = h('Button', { props: { type: 'primary' },
              //   on: { click: () => { this.handleExport(params.row) } }
              // }, '导出')
              // let e = h('Button', { props: { type: 'error' },
              //   on: { click: () => { this.handleDelete(params.row) } }
              // }, '删除')
              return a
            }
          }
        ],
        tableData: [],
        formValidate: { nameVal: '' },
        ruleValidate: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    },
    created () {
      // console.log(this.$route.matched[0])
      // console.log('hello', JSON.stringify(this.routes))
      // this.test()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleButtonAdd (val) {
        this.showPopup = true
      },
      handleConfirm () {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!')
          } else {
            this.$Message.error('Fail!')
          }
        })
      },
      handleButtonRemote (val) {
        alert('远程部署')
      },
      handleCheckBox (arr) {
        var data = arr
        var list = []
        for (var i in arr) {
          list.push(data[i].id)
        }
        this.getCheckboxVal = list.join(',')
        console.log(this.getCheckboxVal)
        return this.getCheckboxVal
      },
      handleSeeDetail (index) {
        this.getCheckboxVal = this.tableSelectVal.push(index.id)
        alert(this.getCheckboxVal)
      }
    }
  }
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>
