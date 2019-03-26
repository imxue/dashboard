<template>
  <div class="login">
    <div class="box">
        <h3>管理密码重置</h3>
        <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <FormItem prop="newps" style="width:100%;">
            <Row>新的管理密码：</Row>
            <Row>
              <i-input type="text" v-model="formInline.newps" placeholder="请输入新的管理密码" style="width:100%; dispaly:block;"></i-input>
            </Row>
          </FormItem>
          <FormItem prop="password" style="width:100%;">
            <Row>确认管理陆密码：</Row>
            <Row>
              <i-input type="password" v-model="formInline.password" placeholder="请输入确认管理陆密码"></i-input>
            </Row>
          </FormItem>
          <FormItem>
              <Button type="primary" @click="handleSubmit('formInline')" style="width:280px;">重置</Button>
          </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data () {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新的管理密码'))
        } else {
          if (this.formInline.newps !== '') {
            // 对第二个密码框单独验证
            this.$refs.formInline.validateField('password')
          }
          callback()
        }
      }
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认管理陆密码'))
        } else if (value !== this.formInline.newps) {
          callback(new Error('两次输入的密码不一样'))
        } else {
          callback()
        }
      }
      return {
        formInline: {
          newps: '',
          password: ''
        },
        ruleInline: {
          newps: [
            { validator: validatePass, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassCheck, trigger: 'blur' }
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
            this.$router.push('/')
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

