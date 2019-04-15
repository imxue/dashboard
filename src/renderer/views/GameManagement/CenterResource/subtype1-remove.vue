<template>
  <div>
    <!-- <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleConfirm">确定</Button>
      <Button type="primary" class="topColumn" @click="handleCancle">取消</Button>
    </div> -->
    <!-- Form -->
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="请选择：" prop="file">
            <CheckboxGroup :value="checkAll" v-model="formValidate.file"  @on-change="checkGroupChange">
               <Checkbox v-for="item in delFileList" :label="item.Id" :key="item.Id">{{item.value}}</Checkbox>
                <!-- <Checkbox label="删除下载文件"></Checkbox>
                <Checkbox label="删除服务器同步文件"></Checkbox> -->
            </CheckboxGroup>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
        </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    name: 'subType1-remove',
    data () {
      return {
        selectVal: [],
        checkAll: false,
        delFileList: [
          { Id: 1, value: '删除下载文件' },
          { Id: 2, value: '删除服务器同步文件' }
        ],
        formValidate: {
          filelist: []
        },
        ruleValidate: {
          filelist: [
            { required: true, type: 'array', min: 1, message: '至少选择一个', trigger: 'change' }
          ]
        }
      }
    },
    created () {
      // console.log('name::' + this.showBackBtn)
      // this.test()
      // console.log('this.$router.options.routes = ' + JSON.stringify(this.$router.options.routes))
      // 多选id = this.$route.query.id
    },
    computed: {
      // routes () {
      //   return this.$router.options.routes
      // }
    },
    methods: {
      checkGroupChange (data) {
        this.selectVal = data
      },
      handleSubmit (name) {
        if (this.selectVal.length === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          alert('需移除ID:' + JSON.stringify(this.selectVal))
        }
        // var self = this
        // this.$refs[name].validate((valid) => {
        //   if (valid) {
        //     this.$store.dispatch(types.SETTING_TEMPLATE, {
        //       id: encodeURIComponent(self.$route.query.from),
        //       gameMode: parseInt(this.formValidate.gameTempalte)
        //     }).then(() => {
        //       this.$Message.success('提交成功!')
        //       self.$router.push('Main')
        //     }, (a) => {
        //       alert(a)
        //     })
        //   } else {
        //     this.$Message.error('表单验证失败!')
        //   }
        // })
      },
      handleReset (name) {
        this.checkAll = true
        this.selectVal = []
        this.$refs[name].resetFields()
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>

</style>