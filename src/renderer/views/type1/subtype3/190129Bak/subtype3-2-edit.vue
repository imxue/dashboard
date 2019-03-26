<template>
  <div>
    <!-- Form -->
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" style="width:800px;">
        <FormItem prop="">
          <Row>
            <i-col span="4">游戏图标：</i-col>
            <i-col span="8">
              <img :src="imgUrl" >
              <Upload action="//10.30.18.62:1010/v1/netbar/upload"
                name="fileName"
                :on-success="handleUploadSuccess"
                :on-format-error="handleFormatError">
                  <Button icon="ios-cloud-upload-outline" :disabled="uploadDisabled">上传游戏图标</Button>
              </Upload>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="displayChoice">
          <Row>
            <i-col span="4">显示选择：</i-col>
            <i-col span="8">
              <Select v-model="formValidate.displayChoice"  @on-change="handleSelectShow"  placeholder="">
                <Option v-for="item in showList" :value="item.value" :key="item.Id">{{ item.value }}</Option>
              </Select>
            </i-col>
          </Row>
        </FormItem>
        <FormItem prop="name">
          <Row>
            <i-col span="4">游戏名称：</i-col>
            <i-col span="8"><i-input v-model="formValidate.name" :disabled="this.$route.query.type === 'multiEdit' ? true : false" placeholder="请输入游戏名称"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="savePath">
          <Row>
            <i-col span="4">服务端路径：</i-col>
            <i-col span="8"><i-input v-model="formValidate.savePath" :disabled="this.$route.query.type === 'multiEdit' ? true : false" placeholder="请输入游戏名称"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="startPath">
          <Row>
            <i-col span="4">客户机启动路径：</i-col>
            <i-col span="8"><i-input v-model="formValidate.startPath" :disabled="this.$route.query.type === 'multiEdit' ? true : false" placeholder="请输入游戏名称"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="run">
          <Row>
            <i-col span="4">执行程序：</i-col>
            <i-col span="8"><i-input v-model="formValidate.run" :disabled="this.$route.query.type === 'multiEdit' ? true : false" placeholder="请输入游戏名称"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="updateWay">
          <Row>
            <i-col span="4">服务器同步：</i-col>
            <i-col span="8">
              <Select v-model="formValidate.serverSync" @on-change="handleSelectUpdataWays">
                <Option v-for="item in serverSyncWay" :value="item.value" :key="item.Id" >{{ item.value }}</Option>
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
  import { netbarEdit } from '@/api/localGame'
  export default {
    name: 'subType3-2-edit',
    data () {
      return {
        pageType: '',
        imgName: '',
        imgUrl: '',
        iconPath: '',
        uploadDisabled: false,
        formValidate: {
          displayChoice: '全部显示',
          name: '',
          savePath: '',
          startPath: '',
          run: '',
          serverSync: '启用'
        },
        serverSyncWay: [
          { Id: 0, value: '启用' },
          { Id: 1, value: '禁用' }
        ],
        showList: [
          { Id: 0, value: '全部显示' },
          { Id: 1, value: '按客户机分组显示' }
        ],
        checkAll: false,
        ruleValidate: {
          displayChoice: [ { required: true, message: '至少选择一个', trigger: 'change' } ],
          name: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          savePath: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          startPath: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          run: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          serverSyncWay: [ { required: true, message: '至少选择一个', trigger: 'change' } ]
        },
        isSync: false
      }
    },
    mounted () {
    },
    created () {
      console.log('this.$route.query.data= ' + JSON.stringify(this.$route.query.data))
      this.handleCheckPageType(this.$route.query.type)
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleCheckPageType (index) {
        if (index === 'edit') {
          this.handleSingleEdit()
        } else if (index === 'multiEdit') {
          this.uploadDisabled = true
          this.handleMultiEdit()
        } else {
          this.handleAdd()
        }
      },
      handleSingleEdit () {
        if (this.$route.query.data) {
          var data = this.$route.query.data
          this.formValidate.name = data.Name
          this.formValidate.savePath = data.Localpath
          this.formValidate.startPath = data.RunPath
          this.formValidate.run = data.Runexe
          this.imgUrl = data.IconUrl
          if (data.IsAutoupdate === true) {
            this.formValidate.serverSyncWay = '启用'
          } else {
            this.formValidate.serverSyncWay = '禁用'
          }
        }
      },
      handleMultiEdit () {},
      handleAdd () {},
      handleUploadSuccess (res, file) {
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
      },
      handleFormatError (res) {
        this.$Message.error('handleFormatError::' + res.Msg)
      },
      handleSelectShow () {},
      handleSelectUpdataWays (index) {
        if (index === '禁用') {
          this.isSync = false
        } else {
          this.isSync = true
        }
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.handleSubmitData()
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
      handleCallBackVaild (res) {
        var code = res.data.Code
        if (code === 0 || res.data.state === 'OK') {
          this.$Message.success('操作成功')
        } else {
          this.$Message.error('操作失败：' + res.data.Msg)
        }
      },
      handleSubmitData () {
        if (this.$route.query.type === 'edit') {
          // clientStartPath, displayChoice, exeName, gameName, gamePath, iconPath, id, isServerSync
          netbarEdit(this.formValidate.startPath, this.formValidate.displayChoice, this.formValidate.run, this.formValidate.name, this.formValidate.gamePath, this.iconPath, this.$route.query.data.Id, this.isSync).then((res) => {
            this.handleCallBackVaild(res)
          }, () => {
            this.$Message.error('请求出错，请稍后再试')
          })
        } else {
          // 批量编辑
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