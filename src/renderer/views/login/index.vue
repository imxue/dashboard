<template>
  <div class="container">
    <div class="header">
      <p>业主平台</p>
    </div>
    <div class="main">
      <h3>账号登录</h3>
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="user">
          <div class="marginBotton">
            <i-input type="text" v-model="formInline.user" placeholder="请输入网吧ID"></i-input>
          </div>
        </FormItem>
        <FormItem prop="password">
          <div class="marginBotton">
            <i-input type="password" v-model="formInline.password" placeholder="请输入网吧密码"></i-input>
          </div>
        </FormItem>
        <FormItem>
          <Button
            type="success"
            @click="handleSubmit('formInline')"
            style="width:280px;"
          >{{$t('Login')}}</Button>
        </FormItem>
        <div class="footer">
          <span v-on:click="handlegoReg">账号注册</span>
          <span>忘记密码</span>
        </div>
      </Form>
           <div>
             <Divider orientation="center">{{$t('ThirdPartyLogin')}}</Divider>
           </div>
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
        user: [{ required: true, message: '请输入网吧ID', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入网吧密码', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  created () {},
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          localStorage.setItem('Flag', 'isLogin')
          this.$router.push('/login/login')
        } else {
          this.$router.push('/login/login')
          this.$Message.error('验证失败!')
        }
      })
    },
    handlegoReg () {
      this.$router.push('/enroll')
    }
  }
}
</script>

<style scoped>
.container {
  background: #3b4759;
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 660px;
}
.header {
  height: 100px;
  background: #fff;
  color: #3b4759;
}
p {
  line-height: 100px;
  padding-left: 100px;
  font-size: 24px;
}
.main {
  width: 400px;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 50px;
  border-radius: 10px;
}
h3 {
  margin-bottom: 20px;
}
.marginBotton {
  margin-bottom: 20px;
}
.footer {
  display: flex;
  justify-content: space-between;
}
</style>

