<template>
  <div>
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonAdd">{{$t('Add')}}</Button>
    </div>
    <!-- table -->
    <Table border ref="selection" :columns="tableColumns" :data="tableData" :no-data-text="this.$t('Nodata')"></Table>
    <Modal
      :title="this.$t('AddMirror')"
      v-model="showPopup"
      width= "500"
      class-name="vertical-center-modal">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
        <FormItem :label="this.$t('MirrorName') + '：'" prop="nameVal">
          <Input v-model="formValidate.nameVal" :placeholder="this.$t('pleaseInputMirror')" clearable  />
        </FormItem>
        <FormItem class="buttonList">
            <Button type="primary" @click="handleSubmit('formValidate')">{{$t('Assign')}}</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">{{$t('cancelText')}}</Button>
        </FormItem>
      </Form>
     </Modal>
  </div>
</template>

<script>
  import { getPcGroupx, deletePcGroup } from '@/api/wupan'
  export default {
    name: 'subType3-1',
    data () {
      return {
        showPopup: false,
        tableColumns: [
          { key: 'name', renderHeader: (h, params) => { return h('span', this.$t('StartupScenarioName')) } },
          {
            renderHeader: (h, params) => { return h('span', this.$t('MirrorName')) },
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
            renderHeader: (h, params) => { return h('span', this.$t('Status')) },
            key: 'disable',
            render: (h, params) => {
              switch (params.row.disable) {
                case '1':
                  return h('span', {
                    style: { color: '#bcbcbc' }
                  }, this.$t('Disable'))
                case '0':
                  return h('span', this.$t('Enable'))
                default:
                  return h('span', '-')
              }
            }
          },
          { renderHeader: (h, params) => { return h('span', this.$t('operation')) },
            width: 300,
            key: 'operation',
            render: (h, params) => {
              let a = h('Button', {
                props: { type: 'primary' },
                style: { marginRight: '10px' },
                on: { click: () => { this.handleEdit(params.row) } }
              }, this.$t('Edit'))
              let d = h('Button', { props: { type: 'error' },
                on: { click: () => { this.handleDelete(params) } }
              }, this.$t('Delete'))
              return [a, d]
            }
          }
        ],
        tableData: [],
        formValidate: { nameVal: '' },
        ruleValidate: { nameVal: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }] }
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
        let mip = localStorage.getItem('masterip')
        getPcGroupx(mip).then((resp) => {
          if (!resp.data.error) {
            var arr = resp.data.result.list
            if (!resp.data.error) {
              this.tableData = arr
            } else {
              this.$Message.error(resp.data.error)
            }
          }
        })
      },
      handleButtonAdd (val) {
        this.$router.push({ path: 'subtype3-edit' })
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
          query: { data: index, flag: 'edit' }
        })
      },
      handleStart () {},
      handleStop () {},
      handleDelete (row) {
        if (row.row.name === 'default') {
          this.$Modal.confirm({
            title: this.$t('DeleteTip'),
            content: this.$t('NotDeleteDefaultPlan'),
            onOk: () => {
  
            },
            onCancel: () => {
  
            }
          })
        } else {
          this.$Modal.confirm({
            title: this.$t('DeleteTip'),
            content: this.$t('DeletingWillCauseClientsUsingThisSchemetoBeUnavailable'),
            onOk: () => {
              deletePcGroup(row.row.name, localStorage.getItem('masterip')).then((response) => {
                if (!response.data.error) {
                  this.handleGetPcGroup()
                }
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
