<template>
  <div class="login">
    <div class="box">
        <h3>网吧登记</h3>
        <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <FormItem prop="user" style="width:100%;">
            <Row>网吧ID：</Row>
            <Row>
              <i-input type="text" v-model="formInline.user" placeholder="请输入网吧ID" style="width:100%; dispaly:block;"></i-input>
            </Row>
          </FormItem>
          <FormItem prop="password" style="width:100%;">
            <Row>网吧密码：</Row>
            <Row>
              <i-input type="password" v-model="formInline.password" placeholder="请输入网吧密码"></i-input>
            </Row>
          </FormItem>
          <FormItem>
              <Button type="primary" @click="handleSubmit('formInline')" style="width:280px;">登记</Button>
          </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      return {
        formInline: {
          user: '',
          password: ''
        },
        ruleInline: {
          user: [
            { required: true, message: '请输入网吧ID', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入网吧密码', trigger: 'blur' }
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
            localStorage.setItem('Flag', 'isLogin')
            this.$router.push('/login/login')
          } else {
            this.$Message.error('验证失败!')
          }
        })
      }
    }
  }
</script>

<style scoped>
  h3{ font-size: 18px; text-align: center; }
  .login{
    background-color: #edeff0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .box{
    background-color:#fff;
    padding:20px;
    width: 320px;
    height: 350px;
    display: block;
    margin: 15% auto 0;
  }
  .ivu-input, button{height: 36px !important;}
  button{margin-top:30px; font-size: 14px; letter-spacing:4px;}
</style>

