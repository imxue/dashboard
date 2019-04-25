<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" style="width:800px;">
        <!-- <FormItem prop="file">
          <Row>
            <i-col span="4">游戏图标：</i-col>
            <i-col span="8">
              <img :src="imgUrl" v-if="showIcon === false" class="imgIcon">
              <input accept="image/*" v-model="formValidate.x">
            </i-col>
          </Row>
        </FormItem> -->
        <FormItem prop="Name">
          <Row>
            <i-col span="4">游戏名称：</i-col>
            <i-col span="8"><i-input v-model="formValidate.Name" placeholder="请输入游戏名称"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="savePath">
          <Row>
            <i-col span="4">服务端存放路径：</i-col>
            <i-col span="8"><i-input v-model="formValidate.SavePath"  placeholder="请输入游戏名称"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="ExePath">
          <Row>
            <i-col span="4">客户机执行文件</i-col>
            <i-col span="8"><i-input v-model="formValidate.ExePath" placeholder="请输入游戏名称"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="updateWay">
          <Row>
            <i-col span="4">更新模式：</i-col>
            <i-col span="8">
              <Select v-model="formValidate.UpdateMode" @on-change="handleSelectUpdataWays">
                <Option v-for="item in updataWayList" :value="item.Id" :key="item.Id" placeholder="全部游戏类型">{{ item.value }}</Option>
              </Select>
            </i-col>
          </Row>
        </FormItem>
        <FormItem class="buttonList">
            <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">返回</Button>
        </FormItem>
    </Form>
  </div>
</template>

<script>
  import { localEdit } from '@/api/localGame'
  export default {
    name: 'subType3-1-edit',
    data () {
      return {
        // apiUrl: 'http://10.30.11.6:8080',
        apiUrl: 'http://10.30.18.62:1010',
        showIcon: false,
        imgUrl: '',
        imgName: '',
        formValidate: {
          file: [],
          show: '全部显示',
          name: '',
          SavePath: '',
          startPath: '',
          ExePath: '',
          UpdateMode: ''
        },
        updataWayList: [
          { Id: 1, value: '自动更新' },
          { Id: 0, value: '手动更新' }
        ],
        checkAll: false,
        ruleValidate: {
          // starterScheme: [ { required: true, message: '至少选择一个', trigger: 'change' } ],
          // // name: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          // savePath: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          // startPath: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          // run: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          // updateWay: [ { required: true, message: '至少选择一个', trigger: 'change' } ]
        },
        autoupdate: false
      }
    },
    mounted () {
    },
    created () {
      this.handleCheckQuery()
      // console.log('this.$route.query.data= ' + JSON.stringify(this.$route.query.data))
    },
    methods: {
      handleUploadSuccess (res, file) {
        this.imgUrl = file.url
        this.showIcon = true
      },
      handleFormatError () {},
      handleCheckQuery () {
        if (this.$route.query.data) {
          var data = this.$route.query.data
          this.formValidate.Name = data.Name
          this.formValidate.SavePath = data.SavePath
          this.formValidate.ExePath = data.ExePath
          this.formValidate.UpdateMode = data.UpdateMode
          this.autoupdate = data.IsAutoupdate
        }
      },
      handleSelectUpdataWays (index) {
        if (index === '自动更新') {
          this.autoupdate = true
        } else {
          this.autoupdate = false
        }
      },
      handleCallBackVaild (res) {
        var code = res.data.Code
        var self = this
        if (code === 0 || res.data.state === 'OK') {
          this.$Message.success('操作成功')
          setTimeout(function () {
            self.$router.go(-1)
          }, 1000)
        } else {
          this.$Message.error('操作失败：' + res.data.Msg)
        }
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            localEdit(this.formValidate.startPath, this.autoupdate, this.$route.query.data.Id, this.formValidate.run, this.formValidate.savePath, -1).then((res) => {
              this.handleCallBackVaild(res)
            }, () => {
              this.$Message.error('请求出错，请稍后再试')
            })
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
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
  .imgIcon{width: 30px; height: 30px; border-radius: 5px;}
  .ivu-col-span-4{text-align: right; margin-right: 10px;}
  .ivu-form-item-error-tip{ padding-left:130px !important;}
  .uploadBtn{font-size: 32px; border: none; color: rgb(51, 153, 255); line-height: normal; padding: 0px;}
  .buttonList{margin-left: 130px;}
</style>