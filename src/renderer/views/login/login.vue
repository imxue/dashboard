<template>
  <div class="login">
    <Modal
        v-model="netup"
        :styles="{top: '300px'}"
        :title="this.$t('ChangeInternet')"
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
              <Button styel="marginBottom:60px;" type="primary"  @click="handleSubmit('formInline')" long size="large"  class="p-b" :class="{disableActive : IsActive}">
                <span class="content">{{$t('Login')}}</span>
                  <span class="p">
                    <span class="p-inner" :class="{active : IsActive}"></span>
                  </span>
                </Button>
                <span class="progress"></span>
             </Row>
             <div class="mt20">
              <span @click="changeNet">{{$t('ChangeInternet')}}</span>
             </div>
          </FormItem>
      </Form>
      <!-- <p style="text-align:right; color:#2b85e4;cursor: pointer;" @click="handleReset">忘记密码？</p> -->
    </div>
  </div>
</template>

<script>
import { netbarRegister, login } from '../../api/login'
import { GetRegInfo } from '../../api/wupan'
import { ipcRenderer } from 'electron'
export default {
  name: 'login',
  data () {
    return {
      loginFlag: true,
      modal1: false,
      IsActive: false,
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
  mounted () {
    // this.$store.dispatch('GetbarInfo').then(() => {
    //   this.$router.push('/')
    // })
  },
  created () {
    if (localStorage.getItem('connectNet')) {
      let net = JSON.parse(localStorage.getItem('connectNet')) || ''
      this.net.ip = (net && net.ip) || '127.0.0.1'
      this.net.port = (net && net.port) || '12880'
    } else {
      this.net.ip = '127.0.0.1'
      this.net.port = '12880'
    }
  },
  methods: {
    // 登录成功
    // 获取主服务器
    // 验证注册信息
    handleSubmit (name) {
      this.IsActive = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          netbarRegister(Number(this.formInline.barid), this.formInline.password).then((e) => {
            login(Number(this.formInline.barid)).then(r => {
              // 获取主服务
              localStorage.setItem('token', r.token)
              this.$store.dispatch('GetMasterip').then((e) => {
                if (e.data.value) {
                  GetRegInfo(this.formInline.barid + '', e.data.value).then((e) => {
                    if (e.data.result.regStat === '1') {
                      this.$router.push('/game')
                    } else {
                      this.notifyUser('error', '授权失败...')
                    }
                  }, (e) => {
                    this.notifyUser('error', `${e}`)
                  })
                } else {
                  this.$router.push('/game')
                }
              }, () => {
                this.$router.push('/Diskless')
              })
            }, (e) => {
              this.notifyUser('error', e.data.error)
            })
          }, (e) => {
            // 注册失败
            if (!e.response && e.message) {
              this.notifyUser('error', e.message)
            }
            if (e.data) {
              this.notifyUser('error', e.data.error)
            }
          }).finally(() => {
            this.IsActive = false
          })
        } else {
          this.IsActive = false
        }
      })
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
    h3 {
       color: white;
    }
span   {
  color: white;
}
  .z button{
    margin-top:0px; 
  }
  .x{
    margin-bottom: 50px;
  }
  .item{
    margin-bottom: 30px;
  }
  .mt20{
    margin-top:20px;
  }
  .progress {
    display: inline-block;
    position: absolute;
    background: #3f9cec;
    height: 100%;
    width: 0%;
    padding: -2px;
    border-radius: 4px;
    top: 0;
  }
   .p-b {
    position: relative;
  }
  .p-b .content {
    position: relative;
    z-index:10;
  }
  .p .p-inner {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0%;
  top: 0;
  height: 100%;
  background-color: #0579f5;
  border-radius: 4px;
  }
  .p .active {
    animation: progress-anim 10s;
  }
  .disableActive {
   cursor: not-allowed;
  }
  @keyframes progress-anim {
	0% {
		width: 4%;
	}
	5% {
		width: 5%;
	}
	10% {
		width: 15%;
	}
	30% {
		width: 40%;
	}
	50% {
		width: 55%;
	}
	80% {
		width: 97%;
	}
	95% {
		width: 96%;
	}
  100% {
		width: 100%;
	}
}
</style>

