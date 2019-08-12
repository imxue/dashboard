<template>
  <div class="login">
    <div class="box">
        <h3>{{$t('绑定网吧id')}}</h3>
        <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <FormItem prop="barid" style="width:100%;" class="item">
            <!-- <Row>服务器IP地址：</Row> -->
            <Row class="x"></Row>

              <Input type="text" v-model="formInline.barid" :placeholder="this.$t('网吧id')" style="width:100%; dispaly:block;"></Input>
 
          </FormItem>
          <FormItem prop="password" style="width:100%;" class="item">
            <!-- <Row>管理密码：</Row> -->
      
              <Input type="password" v-model="formInline.password" :placeholder="this.$t('密码')"></Input>
     
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
import { netbarRegister } from '../../api/login'
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
          netbarRegister(this.formInline.barid, this.formInline.password).then((e) => {
            localStorage.setItem('token', e.token)
            this.$router.push('/game')
          }, () => { })
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
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box{
    background-color:#3B4759;
    padding:20px;
    width: 320px;
    height: 350px;
    margin: 0 auto;
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

