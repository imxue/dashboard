<template>
  <div class="login">
    <Modal
        v-model="netup"
        :styles="{top: '300px'}"
        title="切换网络"
        footer-hide
       >
         <Form ref="net" :model="net" :rules="netrules" inline>
        <FormItem prop="ip">
            <Input type="text" v-model="net.ip" placeholder="Username">
                <Icon type="md-arrow-dropdown" slot="prepend"></Icon>
            </Input>
        </FormItem>
        <FormItem prop="port">
            <Input v-model="net.port" placeholder="Password">
                <Icon type="md-arrow-dropdown" slot="prepend"></Icon>
            </Input>
        </FormItem>
      <FormItem>
        <Row class="z">
              <Button type="primary" @click="ok('net')">{{$t('Save')}}</Button>
         </Row >
        </FormItem>
        </Form>
        
    </Modal>
    <div class="box">
        <h3>{{$t('BindInternetCafeId')}}</h3>
        <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <FormItem prop="barid" style="width:100%;" class="item">
            <!-- <Row>服务器IP地址：</Row> -->
            <Row class="x"></Row>
              <Input size="large" type="text" v-model="formInline.barid" :placeholder="this.$t('id')" style="width:100%; dispaly:block;"></Input>
          </FormItem>
          <FormItem prop="password" style="width:100%;" class="item">
            <!-- <Row>管理密码：</Row> -->
              <Input size="large" type="password" v-model="formInline.password" :placeholder="this.$t('password')" @keyup.enter.native="handleSubmit('formInline')"></Input>
          </FormItem>
          <FormItem style="width: 100%;">
             <Row class="y">

              <Button type="primary" :loading="loading" @click="handleSubmit('formInline')" long size="large">{{$t('Login')}}</Button>
             </Row>
              <span @click="changeNet">{{$t('ChangeInternet')}}</span>
          </FormItem>
      </Form>
      <!-- <p style="text-align:right; color:#2b85e4;cursor: pointer;" @click="handleReset">忘记密码？</p> -->
    </div>
  </div>
</template>

<script>
import { netbarRegister, login } from '../../api/login'
import { ipcRenderer } from 'electron'
export default {
  name: 'login',
  data () {
    return {
      loginFlag: true,
      loading: false,
      modal1: false,
      formInline: {
        barid: '',
        password: ''
      },
      netup: false,
      net: {
        ip: '',
        port: ''
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
      },
      netrules: {
        ip: [
          {
            required: true,
            message: this.$t('Thisfieldcannotbeempty'),
            trigger: 'blur'
          }
        ],
        port: [
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
    if (localStorage.getItem('connectNet')) {
      let net = JSON.parse(localStorage.getItem('connectNet')) || ''
      this.net.ip = (net && net.ip) || '127.0.0.1'
      this.net.port = (net && net.port) || '12880'
    }
  },
  methods: {
    handleSubmit (name) {
      if (this.loginFlag) {
        this.loading = true
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loginFlag = false
            netbarRegister(Number(this.formInline.barid), this.formInline.password).then((e) => {
              login(Number(this.formInline.barid)).then(r => {
                localStorage.setItem('token', r.token)
                this.loading = false
                this.$router.push('/game')
              }, (e) => {
                this.loading = false
                this.notifyUser('error', e.data.error)
              })
            }, (e) => {
              // 注册失败
              this.loading = false
              if (e) {
                this.notifyUser('error', e.data.error)
              }
            }).finally(() => {
              this.loginFlag = true
            })
          } else {
            this.loading = false
          }
        })
      }
    },
    changeNet () {
      this.netup = true
    },
    ok () {
      this.$refs['net'].validate((valid) => {
        if (valid) {
          localStorage.setItem('connectNet', JSON.stringify({ ip: this.net.ip, port: this.net.port }))
          ipcRenderer.sendSync('restart', 'ping')
          this.netup = false
        } else {
          this.netup = true
        }
      })
      // this.netup = true
    },
    handleReset () {
      this.$router.push('/login/reset')
    }
  }
}
</script>



<style scoped >
  h3 { font-size: 18px; text-align: center; }
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
  /* .y button{
    margin-top:10px; 
    margin-bottom:10px; 
  } */
  .z button{
    margin-top:0px; 
  }
  .x{
    margin-bottom: 50px;
  }
  .item{
    margin-bottom: 30px;
  }
</style>

