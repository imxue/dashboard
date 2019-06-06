<template>
  <div class="login">
    <div class="box">
        <h3>{{$t('Login')}}</h3>
        <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <FormItem prop="barid" style="width:100%;">
            <Row>服务器IP地址：</Row>
            <Row>
              <i-input type="text" v-model="formInline.barid" placeholder="请输入服务器IP地址" style="width:100%; dispaly:block;"></i-input>
            </Row>
          </FormItem>
          <FormItem prop="password" style="width:100%;">
            <Row>管理密码：</Row>
            <Row>
              <i-input type="password" v-model="formInline.password" placeholder="请输入管理密码"></i-input>
            </Row>
          </FormItem>
          <FormItem>
              <Button type="primary" @click="handleSubmit('formInline')" style="width:280px;">登陆</Button>
          </FormItem>
      </Form>
      <p style="text-align:right; color:#2b85e4;cursor: pointer;" @click="handleReset">忘记密码？</p>
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
          { required: true, message: '请输入服务器IP地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入管理密码', trigger: 'blur' }
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
            if (e.data.ok) {
              localStorage.setItem('token', e.data.token)
              this.$router.push('/game/subType1/subType1-1')
            } else {
              this.$Message.info({
                content: e.data.data.error,
                duration: 10
              })
            }
          })
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
  .ivu-input, button{height: 36px !important;}
  button{margin-top:30px; font-size: 14px; letter-spacing:4px;}
</style>

