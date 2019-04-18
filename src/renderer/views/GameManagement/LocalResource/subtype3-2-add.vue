<template>
  <div>
    <!-- <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleConfirm">确定</Button>
      <Button type="primary" class="topColumn" @click="handleCancle">取消</Button>
    </div> -->
    <!-- Form -->
      <img :src='imgUrlxx'>

    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" style="width:800px;">
        <FormItem prop="file">
          <Row>
            <i-col span="4">游戏图标：</i-col>
            <i-col span="8">
           
              <!-- 10.30.11.6:8080  10.30.18.62:1010-->
              <!-- //jsonplaceholder.typicode.com/posts/ -->
              <!-- <Upload action="//10.30.18.62:1010/v1/netbar/upload"
                name="fileName"
                :on-success="handleUploadSuccess"
                :on-format-error="handleFormatError">
                  <Button icon="ios-cloud-upload-outline">上传游戏图标</Button>
              </Upload> -->
              <input type="file" v-on:change='imgUpload'>
              <div class="ivu-form-item-error-tip" v-show="msg !== ''">{{msg}}</div>
            </i-col>
          </Row>
           
        </FormItem>
        <!-- <FormItem prop="starterScheme">
          <Row>
            <i-col span="4">显示选择：</i-col>
            <i-col span="8">
              <Select v-model="formValidate.starterScheme"  @on-change="handleSelectShow"  placeholder="全部显示">
                <Option v-for="item in showList" :value="item.value" :key="item.Id">{{ item.value }}</Option>
              </Select>
            </i-col>
          </Row>
        </FormItem> -->
        <FormItem prop="name">
          <Row>
            <i-col span="4">游戏名称：</i-col>
            <i-col span="8"><i-input v-model="formValidate.name"  placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="path">
          <Row>
            <i-col span="4">游戏路径：</i-col>
            <i-col span="8"><i-input v-model="formValidate.path" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="exepath">
          <Row>
            <i-col span="4">客户机启动路径：</i-col>
            <i-col span="8"><i-input v-model="formValidate.exepath" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="exename">
          <Row>
            <i-col span="4">执行程序：</i-col>
            <i-col span="8"><i-input v-model="formValidate.exename" placeholder=""></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="isServerSync">
          <Row>
            <i-col span="4">服务器同步：</i-col>
            <i-col span="8">
              <Select v-model="formValidate.isEnableSync" @on-change="handleSelectUpdataWays">
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
  import { addLocalGame } from '@/api/localGame'
  export default {
    name: 'subType3-1-edit',
    data () {
      return {
        imgUrlxx: '',
        showIcon: false,
        temp: '', // 临时存放icon
        msg: '',
        imgUrl: '',
        imgName: '',
        iconPath: '',
        formValidate: {
          // imgUrl: '',
          show: '全部显示',
          name: '',
          path: '',
          exepath: '',
          exename: '',
          isEnableSync: '自动更新'
        },
        updataWayList: [
          { Id: 0, value: '禁用' },
          { Id: 1, value: '启用' }
        ],
        showList: [
          { Id: 0, value: '全部显示' },
          { Id: 1, value: '按客户机分组显示' }
        ],
        checkAll: false,
        ruleValidate: {
          // starterScheme: [ { required: true, message: '至少选择一个', trigger: 'change' } ],
          name: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          path: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          exepath: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          exename: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          isEnableSync: [ { required: true, message: '至少选择一个', trigger: 'change' } ]
        },
        isSync: false
      }
    },
    mounted () {
    },
    created () {
      // this.handleCheckQuery()
      // console.log('this.$route.query.data= ' + JSON.stringify(this.$route.query.data))
    },
    methods: {
      handleUploadSuccess (res, file) {
        // console.log('handleUploadSuccess::' + JSON.stringify(res))
        if (res.Code === 1) {
          this.showIcon = false
          this.msg = res.Msg
          this.$Message.error('handleUploadSuccess::' + res.Msg)
        } else {
          this.imgUrl = 'http://10.30.18.62:1010' + res.Data
          // this.imgUrl = res.Data
          this.iconPath = res.Data
          this.showIcon = true
        }
        // this.formValidate.imgUrl = file.url
        // this.showIcon = true
      },
      imgUpload (data) {
        console.log(data)
        let file = data.target.files[0]
        this.temp = file
        var reader = new FileReader(file)
        reader.readAsDataURL(file)
        reader.onload = function (e) {
          this.imgUrlxx = e.target.result
          console.log(this.imgUrlxx)
          debugger
        }
      },
      handleFormatError (res) {
        this.$Message.error('handleFormatError::' + res.Msg)
      },
      // handleCheckQuery () {
      //   if (this.$route.query.data) {
      //     var data = this.$route.query.data
      //     this.formValidate.name = data.Name
      //     this.formValidate.gamePath = data.Localpath
      //     this.formValidate.startPath = data.RunPath
      //     this.formValidate.run = data.RunPath
      //     if (data.IsAutoupdate === true) {
      //       this.formValidate.isServerSync = '自动更新'
      //     } else {
      //       this.formValidate.isServerSync = '手动更新'
      //     }
      //   }
      // },
      // handleSelectShow (index) {
      //   this.formValidate.starterScheme = index
      // },
      handleSelectUpdataWays (index) {
        if (index === '禁用') {
          this.isSync = false
        } else {
          this.isSync = true
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
        let that = this
        var reader = new FileReader(that.temp)
        reader.readAsDataURL(that.temp)
        reader.onload = function (e) {
          that.$refs[name].validate((valid) => {
            if (e.target.result) {
              if (valid) {
                addLocalGame(that.formValidate, e.target.result).then((res) => {
                }, () => {
                  that.$Message.error('请求出错，请稍后再试')
                })
              } else {
                that.$Message.error('表单验证失败!')
              }
            }
          })
        }
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
  .uploadBtn{font-size: 32px; border: none; color: rgb(51, 153, 255); line-height: normal; padding: 0px;}
  .buttonList{margin-left: 130px;}
</style>