<template>
  <div>
    <!-- <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleConfirm">确定</Button>
      <Button type="primary" class="topColumn" @click="handleCancle">取消</Button>
    </div> -->
    <!-- Form -->
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" style="width:800px;">
        <FormItem prop="file">
          <Row>
            <i-col span="4">游戏图标：</i-col>
            <i-col span="8">
              <div class="demo-upload-list" v-for="item in uploadList" :key="item.name">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                    </div>
                </template>
                <template v-else>
                    <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
            </div>
            <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"

                type="drag"
                action="//jsonplaceholder.typicode.com/posts/"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="camera" size="20"></Icon>
                </div>
            </Upload>
            <Modal title="View Image" v-model="visible">
                <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
            </Modal>
              《 点击图标可更换游戏图标
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="show">
          <Row>
            <i-col span="4">显示选择：</i-col>
            <i-col span="8">
              <Select v-model="formValidate.show"  @on-change="handleSelectShow">
                <Option v-for="item in showList" :value="item.value" :key="item.Id" placeholder="全部游戏类型">{{ item.value }}</Option>
              </Select>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="name">
          <Row>
            <i-col span="4">游戏名称：</i-col>
            <i-col span="8"><i-input v-model="formValidate.name" disabled placeholder="请输入游戏名称"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="savePath">
          <Row>
            <i-col span="4">服务端存放路径：</i-col>
            <i-col span="8"><i-input v-model="formValidate.savePath" placeholder="请输入游戏名称"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="startPath">
          <Row>
            <i-col span="4">客户机启动路径：</i-col>
            <i-col span="8"><i-input v-model="formValidate.startPath" placeholder="请输入游戏名称"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="run">
          <Row>
            <i-col span="4">执行程序：</i-col>
            <i-col span="8"><i-input v-model="formValidate.run" placeholder="请输入游戏名称"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="updateWay">
          <Row>
            <i-col span="4">更新方式：</i-col>
            <i-col span="8">
              <Select v-model="formValidate.updateWay" @on-change="handleSelectUpdataWays">
                <Option v-for="item in updataWayList" :value="item.value" :key="item.Id" placeholder="全部游戏类型">{{ item.value }}</Option>
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
  export default {
    name: 'subType3-1-edit',
    data () {
      return {
        defaultList: [
          {
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          }
        ],
        imgName: '',
        visible: false,
        multiple: false,
        uploadList: [],
        formValidate: {
          file: [],
          show: '全部显示',
          name: '',
          savePath: '',
          startPath: '',
          run: '',
          updateWay: '自动更新'
        },
        updataWayList: [
          { Id: 0, value: '自动更新' },
          { Id: 1, value: '手动更新' }
        ],
        showList: [
          { Id: 0, value: '全部显示' },
          { Id: 1, value: '按客户机分组显示' }
        ],
        checkAll: false,
        ruleValidate: {
          show: [ { required: true, message: '至少选择一个', trigger: 'change' } ],
          // name: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          savePath: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          startPath: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          run: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          updateWay: [ { required: true, message: '至少选择一个', trigger: 'change' } ]
        }
      }
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList
    },
    created () {
      // console.log(this.$route.matched[0])
      // console.log('hello', JSON.stringify(this.routes))
      // this.test()
      this.handleCheckQuery()
      // console.log('this.$route.query.data= ' + JSON.stringify(this.$route.query.data))
    },
    // computed: {
    //   routes () {
    //     return this.$router.options.routes
    //   }
    // },
    methods: {
      handleCheckQuery () {
        if (this.$route.query.data) {
          var data = this.$route.query.data
          this.formValidate.name = data.Name
          this.formValidate.savePath = data.Localpath
          this.formValidate.startPath = data.RunPath
          this.formValidate.run = data.RunPath
          if (data.IsAutoupdate === true) {
            this.formValidate.updateWay = '自动更新'
          } else {
            this.formValidate.updateWay = '手动更新'
          }
        }
      },
      handleView (name) {
        this.imgName = name
        this.visible = true
      },
      handleRemove (file) {
        const fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      },
      handleSuccess (res, file) {
        file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
        file.name = '7eb99afb9d5f317c912f08b5212fd69a'
        this.multiple = false
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件格式 ' + file.name + '不正确，请上传 jpg 或 png格式'
        })
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超过文件大小限制',
          desc: '文件' + file.name + '不能超过2M'
        })
      },
      handleBeforeUpload () {
        const check = this.uploadList.length < 2
        if (!check) {
          this.$Notice.warning({
            title: '最多可上传1张图片。'
          })
        }
        return check
      },
      handleSelectShow () {},
      handleSelectUpdataWays () {},
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('表单验证成功!')
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
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
  .ivu-col-span-4{text-align: right; margin-right: 10px;}
  .ivu-form-item-error-tip{ padding-left:130px !important;}
  .uploadBtn{font-size: 32px; border: none; color: rgb(51, 153, 255); line-height: normal; padding: 0px;}
  .buttonList{margin-left: 130px;}
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
    }
    .demo-upload-list img{
      width: 100%;
      height: 100%;
    }
    .demo-upload-list-cover{
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
      display: block;
    }
    .demo-upload-list-cover i{
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 0 2px;
    }
</style>