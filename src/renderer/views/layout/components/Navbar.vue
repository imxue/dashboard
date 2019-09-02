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
          <span>{{ $t("BarId") }}：{{x.bar_id}}</span>
          <span>{{ $t("OnlineTerminal") }} / {{ $t("AllTerminal") }} {{x.online_client_count}} / {{x.client_count}}</span>
          <span>
            {{ $t("AuthorizationIsValidUntil") }}：
            <span :class="this.expireTimeState === 1 ? 'redColor' :  'normalColor'">{{this.expireTime}}</span>
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
// import moment from 'moment'
export default {
  data () {
    return {
      expireTime: '',
      expireTimeState: 0,
      netBarId: this.$store.state.app.barid || '',
      onlineNetBar: '1000',
      totalNetBar: '2000',
      localStorageLang: localStorage.getItem('lang'),
      x: this.$store.state.app.barinfo,
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
  },
  methods: {
    handleExpireTime () {
      let date = new Date(this.$store.state.app.barinfo.expire_time)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getMonth()
      this.expireTime = `${year} / ${month} / ${day}`
    },
    ChangeLanguage (name) {
      this.$i18n.locale = name
      localStorage.setItem('lang', name)
      this.localStorageLang = name
    },
    handleExit () {
      this.$router.push('/login')
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
