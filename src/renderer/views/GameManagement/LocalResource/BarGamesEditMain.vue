<template>
  <div>
    <!-- Form -->
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" style="width:800px;">
      <FormItem prop>
        <Row>
          <i-col span="4">{{$t('GameIcon')}}：</i-col>
          <i-col span="8">
            <template v-if="this.localimgUrl">
              <img :src="this.localimgUrl">
            </template>
            <template v-else>
              <img :src="formValidate.IconUrl">
            </template>
            <input
              type="file"
              accept="image/*"
              v-on:change="imgUpload"
              placeholder="Upload files"
              style="opacity:0.8;"
            >
          </i-col>
        </Row>
      </FormItem>
      <FormItem prop="Name">
        <Row>
          <i-col span="4">游戏名称：</i-col>
          <i-col span="8">
            <i-input v-model="formValidate.Name" placeholder="请输入游戏名称"></i-input>
          </i-col>
        </Row>
      </FormItem>
      <FormItem prop="SavePath">
        <Row>
          <i-col span="4">服务端路径：</i-col>
          <i-col span="8">
            <i-input v-model="formValidate.SavePath" placeholder="请输入游戏名称"></i-input>
          </i-col>
        </Row>
      </FormItem>
      <FormItem prop="RunPath">
        <Row>
          <i-col span="4">客户机启动路径：</i-col>
          <i-col span="8">
            <i-input v-model="formValidate.RunPath" placeholder="请输入游戏名称"></i-input>
          </i-col>
        </Row>
      </FormItem>
      <FormItem prop="RunExe">
        <Row>
          <i-col span="4">执行程序：</i-col>
          <i-col span="8">
            <i-input v-model="formValidate.RunExe" placeholder="请输入游戏名称"></i-input>
          </i-col>
        </Row>
      </FormItem>
      <FormItem prop="IsEnableSync">
        <Row>
          <i-col span="4">服务器同步：</i-col>
          <i-col span="8">
            <Select v-model="formValidate.IsEnableSync" @on-change="handleSelectUpdataWays">
              <Option
                v-for="item in IsEnableSyncList"
                :value="item.Id"
                :key="item.Id"
                :label="item.value"
              ></Option>
            </Select>
          </i-col>
        </Row>
      </FormItem>
      <FormItem class="buttonList">
        <Button type="primary" @click.stop.prevent="handleSubmit('formValidate')">保存</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { editLocalGame } from '@/api/localGame'
import { UploadImg } from '@/utils/index'
export default {
  name: 'BarGameEdit',
  data () {
    return {
      Id: '', // 修改对象的Id
      localimgUrl: '',
      temp: '',
      pageType: '',
      imgName: '',
      imgUrl: '',
      iconPath: '',
      uploadDisabled: false,
      formValidate: {
        IconUrl: '',
        Name: '',
        SavePath: '',
        RunPath: '',
        RunExe: '',
        IsEnableSync: ''
      },
      IsEnableSyncList: [{ Id: 1, value: '启用' }, { Id: 0, value: '禁用' }],
      showList: [
        { Id: '0', value: '全部显示' },
        { Id: '1', value: '按客户机分组显示' }
      ],
      checkAll: false,
      ruleValidate: {
        Name: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
        SavePath: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
        RunPath: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
        RunExe: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
        IsEnableSync: [
          { required: true, type: 'number', message: this.$t('ChooseAtLeastOne'), trigger: 'change' }
        ]
      }
    }
  },
  mounted () {},
  created () {
    this.handleSingleEdit()
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    handleSingleEdit () {
      if (this.$route.query.data) {
        var data = this.$route.query.data
        this.Id = data.Id
        this.formValidate.Name = data.Name
        this.formValidate.SavePath = data.LocalPath
        this.formValidate.RunPath = data.RunPath
        this.formValidate.RunExe = data.RunExe
        this.formValidate.IconUrl = data.IconUrl
        this.formValidate.IsEnableSync = data.IsEnableSync
      }
    },
    /**
     * 替换图片
     */
    imgUpload (data) {
      let file = data.target.files[0]
      this.localimgUrl = file.path
      this.temp = file
    },
    handleAdd () {},
    handleFormatError (res) {
      this.$Message.error('handleFormatError::' + res.Msg)
    },
    handleSelectShow () {},
    /*
      select选择
      */
    handleSelectUpdataWays (index) {
      this.formValidate.IsEnableSync = index
      console.log(this.formValidate.IsEnableSync)
    },

    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.localimgUrl) {
            UploadImg(this.temp).then((e) => {
              editLocalGame(this.formValidate, e.target.result, this.Id).then((e) => {
                this.$Message.success(e.data)
                this.$router.go(-1)
              })
            })
          } else {
            this.formValidate.IconUrl = null
            editLocalGame(this.formValidate, this.formValidate.IconUrl, this.Id).then((e) => {
              this.$Message.success(e.data)
              this.$router.go(-1)
            }, (e) => {
              this.$Notice.error({ desc: '' + e, duration: 0 })
            })
          }
        }
      })
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
.ivu-col-span-4 {
  text-align: right;
  margin-right: 10px;
}
.ivu-form-item-error-tip {
  padding-left: 130px !important;
}
.uploadBtn {
  font-size: 32px;
  border: none;
  color: rgb(51, 153, 255);
  line-height: normal;
  padding: 0px;
}
.buttonList {
  margin-left: 130px;
}
.demo-upload-list {
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
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>