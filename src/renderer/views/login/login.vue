<template>
  <div class="login">
    <div class="box">
        <h3>{{$t('Login')}}</h3>
        <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <FormItem prop="barid" style="width:100%;" class="item">
            <!-- <Row>服务器IP地址：</Row> -->
            <Row class="x"></Row>

              <Input type="text" v-model="formInline.barid" :placeholder="this.$t('pleaseInputServerIp')" style="width:100%; dispaly:block;"></Input>
 
          </FormItem>
          <FormItem prop="password" style="width:100%;" class="item">
            <!-- <Row>管理密码：</Row> -->
      
              <Input type="password" v-model="formInline.password" :placeholder="this.$t('ServerPW')"></Input>
     
          </FormItem>
          <FormItem>
              <Button type="primary" @click="handleSubmit('formInline')" style="width:280px;">{{$t('Login')}}</Button>
          </FormItem>
      </Form>
      <!-- <p style="text-align:right; color:#2b85e4;cursor: pointer;" @click="handleReset">忘记密码？</p> -->
    </div>
  </div>
</template>

<script>
import { login } from '../../api/login'
export default {
  name: 'login',
  data () {
    return {
      formInline: {
        barid: '',
        password: ''
      },
      ruleInline: {
        barid: [
          {
            required: true,
            message: this.$t('Thisfieldcannotbeempty'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('Thisfieldcannotbeempty'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  created () {
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formInline.barid = Number(this.formInline.barid)
          login(this.formInline).then((e) => {
            localStorage.setItem('token', e.data.token)
            this.$router.push('/Diskless')
          }, () => {})
        }
      })
    },
    handleReset () {
      this.$router.push('/login/reset')
    }
  }
}
</script>

<style scoped>
  h3{ font-size: 18px; text-align: center; }
  .login{
    background-color: #3B4759;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .box{
    background-color:#3B4759;
    padding:20px;
    width: 320px;
    height: 350px;
    display: block;
    margin: 15% auto 0;
  }
  .x{
    margin-bottom: 50px;
  }
  .item{
    margin-bottom: 40px;
  }
  .ivu-input, button{height: 36px !important;}
  button{margin-top:30px; font-size: 14px; letter-spacing:4px;}
</style>

