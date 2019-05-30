<template>
  <div class="myheader">
    <div class="ivu-menu-dark ivu-menu-horizontal">
      <div class="wrapper">
        <Menu mode="horizontal" theme="dark" active-name="1">
          <template v-for="item in routes">
            <template v-if="!item.hidden&&item.children">
              <router-link
                :to="item.redirect||item.path+'/'+item.children[0].path"
                :key="item.children[0].name"
              >
                <Menu-item :name="item.name">
                  <Icon type="ios-paper"/>
                  {{ $t(item.meta.title) }}
                  <span
                    v-if="item.meta&&item.meta.title"
                    slot="title"
                  >{{item.meta.title}}</span>
                </Menu-item>
              </router-link>
            </template>
          </template>
        </Menu>
        <div class="headerFooter">
          <span>{{ $t("BarId") }}：{{netBarId}}</span>
          <span>{{ $t("OnlineTerminal") }} / {{ $t("AllTerminal") }} {{onlineNetBar}} / {{totalNetBar}}</span>
          <span>
            {{ $t("AuthorizationIsValidUntil") }}：
            <span :class="this.expireTimeState === 1 ? 'redColor' :  'normalColor'">{{expireTime}}</span>
          </span>

          <Dropdown trigger="click" @on-click="ChangeLanguage">
            <a href="javascript:void(0)">
              {{$t('Language')}}
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <template v-for="item in localLanguage" :name="item.value">
                <template v-if="localStorageLang">
                  <DropdownItem
                    v-if="item.value !== localStorageLang"
                    v-bind:key="item.value"
                    :name="item.value"
                  >{{item.name}}</DropdownItem>
                </template>
                <template v-else>
                  <DropdownItem
                    v-if="item.value !== 'zh-CN'"
                    v-bind:key="item.value"
                    :name="item.value"
                  >{{item.name}}</DropdownItem>
                </template>
              </template>
            </DropdownMenu>
          </Dropdown>
          <Button @click="handleExit">{{$t('logout')}}</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  data () {
    return {
      expireTime: '2019/11/29',
      expireTimeState: 0,
      netBarId: '0000001',
      onlineNetBar: '1000',
      totalNetBar: '2000',
      localStorageLang: localStorage.getItem('language'),
      localLanguage: [
        {
          value: 'zh-CN',
          name: '中文简体'
        },
        {
          value: 'en-US',
          name: 'English'
        },
        {
          value: 'zh-TW',
          name: '中文繁體'
        }
      ]
    }
  },
  created () {
    this.handleExpireTime()
    if (this.localStorageLang) {
      Vue.config.lang = this.localStorageLang
    }
  },
  methods: {
    handleExpireTime () {
      // 到期时间 AppExpireTime
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
    ChangeLanguage (name) {
      this.$i18n.locale = name
      localStorage.setItem('language', name)
      this.localStorageLang = localStorage.getItem('language')
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
.redColor {
  color: #ff4d43;
}
.wrapper {
  display: flex;
  color: white;
  justify-content: space-between;
}
.wrapper span {
  margin-right: 10px;
}
.headerFooter {
  margin-right: 10px;
}
.headerFooter button {
  margin-left: 15px;
}
a {
  color: white;
}
</style>
