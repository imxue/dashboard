<template>
  <div class="myheader">
    <Row class="ivu-menu-dark ivu-menu-horizontal">
        <i-col span="12">
          <Menu mode="horizontal" theme="dark" active-name="1">
            <template v-for="item in routes">
              <template  v-if="!item.hidden&&item.children">
              <router-link :to="item.redirect||item.path+'/'+item.children[0].path" :key="item.children[0].name">
                <Menu-item :name="item.name" >
                  <Icon type="ios-paper" />
                  {{ item.meta.title }}
                  <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
                </Menu-item>
              </router-link>
              </template>
            </template>
          </Menu>
        </i-col>
        <i-col span="10" style="color:#fff; text-align:right; padding-right:10px;
        ">网吧ID：{{netBarId}} &nbsp;&nbsp;&nbsp; 在线终端 / 全部终端：{{onlineNetBar}} / {{totalNetBar}} &nbsp;&nbsp;&nbsp;授权有效期至： <span :class="this.expireTimeState === 1 ? 'redColor' :  'normalColor'">{{expireTime}}</span></i-col>
        <i-col span="2"><Button @click="handleExit"  style="float:right; margin:15px 15px 0 0;">退出</Button></i-col>
    </Row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        expireTime: '2019/11/29',
        expireTimeState: 0,
        netBarId: '0000001',
        onlineNetBar: '1000',
        totalNetBar: '2000'
      }
    },
    created () {
      this.handleExpireTime()
    },
    methods: {
      handleExpireTime () { // 到期时间 AppExpireTime
        var s1 = this.expireTime
        s1 = new Date(s1.replace(/-/g, '/'))
        var s2 = new Date()
        var days = s1.getTime() - s2.getTime()
        var overTime = parseInt(days / (1000 * 60 * 60 * 24))
        // 到期时间还剩20天，提示消息
        if (overTime <= 0) {
          this.expireTime = '已过期'
          this.expireTimeState = 1
        } else {
          this.expireTime = this.expireTime
        }
      },
      handleExit () {
        localStorage.setItem('Flag', '')
        this.$router.push('/login/login')
      }
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    }
  }
</script>



<style scoped>
 .redColor{color: #ff4d43;}
.myheader{
     min-width: 1250px;
   }
 @media screen and (max-width: 1280px) {
   .myheader{
     min-width: 1250px;
   }
 }
</style>
