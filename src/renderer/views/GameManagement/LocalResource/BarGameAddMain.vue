<template>
  <div class="containers">
    <!-- <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleConfirm">确定</Button>
      <Button type="primary" class="topColumn" @click="handleCancle">取消</Button>
    </div> -->
    <!-- Form -->
 

    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" style="width:800px;">
        <FormItem prop="file">
         <Row>
            <i-col span="4">{{$t('GameIcon')}}：</i-col>
            <i-col span="8">
              <div style='border: 1px solid #ccc!important;  border-radius: 16px; '>
          <input type="file" accept="image/*" v-on:change='imgUpload' placeholder="Upload files"  style='opacity:0;'>
            <img :src='this.imgUrl' style='margin-top:-35px;margin-left:10px;'>
              </div>             
           <p style='margin-top:-35px; text-align:center' v-if="!this.formValidate.IconUrl">Click here to upload</p>   
            <p style='border: 1px solid #ccc!important; border-radius: 16px; margin-top:-35px; text-align:center' v-if="this.formValidate.IconUrl">Click here1 to upload</p>
              <div class="ivu-form-item-error-tip" v-show="msg !== ''">{{msg}}</div>
            </i-col>
          </Row>
        </FormItem>
  
        <FormItem prop="name">
          <Row>
            <i-col span="4">{{$t('gameName')}}：</i-col>
            <i-col span="8"><i-input v-model="formValidate.name"  :placeholder="$t('pleaseInput')"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="path">
          <Row>
            <i-col span="4">{{$t('GamePath')}}：</i-col>
            <i-col span="8"><i-input v-model="formValidate.path" :placeholder="$t('pleaseInput')"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="exepath">
          <Row>
            <i-col span="4">{{$t('ExecutePath')}}：</i-col>
            <i-col span="8"><i-input v-model="formValidate.exepath" :placeholder="$t('pleaseInput')"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="exename">
          <Row>
            <i-col span="4">{{$t('ExecuteProgram')}}：</i-col>
            <i-col span="8"><i-input v-model="formValidate.exename" :placeholder="$t('pleaseInput')"></i-input></i-col>
          </Row>
        </FormItem>
        <FormItem prop="isServerSync">
          <Row>
            <i-col span="4">{{$t('ServerSyncSet')}}：</i-col>
            <i-col span="8">
              <Select v-model="formValidate.isEnableSync" @on-change="handleSelectUpdataWays" :placeholder="$t('ChooseAtLeastOne')">
                <Option v-for="item in updataWayList" :value="item.Id" :key="item.Id">{{ item.value }}</Option>
              </Select>
            </i-col>
          </Row>
        </FormItem>
        <FormItem class="buttonList">
            <Button type="primary" @click="handleSubmit('formValidate')">{{$t('Save')}}</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">{{$t('return')}}</Button>
        </FormItem>
    </Form>
  </div>
</template>

<script>
  import { addLocalGame } from '@/api/localGame'
  import { UploadImg } from '@/utils/index'
  export default {
    name: 'barGameAdd',
    data () {
      return {
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
          { Id: 1, value: this.$t('Enable') },
          { Id: 0, value: this.$t('Disable') }
        ],
        showList: [
          { Id: 0, value: '全部显示' },
          { Id: 1, value: '按客户机分组显示' }
        ],
        ruleValidate: {
          name: [ { required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' } ],
          path: [ { required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' } ],
          exepath: [ { required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' } ],
          exename: [ { required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' } ],
          isEnableSync: [ { required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'change' } ]
        },
        isSync: false
      }
    },
    mounted () {
    },
    created () {},
    methods: {
      imgUpload (data) {
        let file = data.target.files[0]
        this.imgUrl = file.path
        console.log(data)
        console.log(this.imgUrl)
        this.temp = file
      },
      handleFormatError (res) {
        this.$Message.error('handleFormatError::' + res.Msg)
      },
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
        UploadImg(that.temp).then((e) => {
          that.$refs[name].validate((valid) => {
            if (e.target.result) {
              if (valid) {
                addLocalGame(that.formValidate, e.target.result).then((res) => {
                  that.$Message.info(res.data)
                  that.$router.push({
                    path: 'BarGames',
                    query: { }
                  })
                }, () => {
                })
              } else {
                that.$Message.error('表单验证失败!')
              }
            }
          })
        }, (e) => {
          that.$Message.error(this.$t('GameIconUnAdd'))
        }).catch((err) => {
          that.$Message.error('failed' + err)
        })
      },
      /**
       * 返回
       */
      handleReset (name) {
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