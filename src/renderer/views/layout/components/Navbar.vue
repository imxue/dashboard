<template>
  <div class="myheader">
    <div class="ivu-menu-dark ivu-menu-horizontal">
      <div class="wrapper">
        <Menu mode="horizontal" theme="dark" active-name="1">
          <template v-for="item in routes">
            <template  v-if="!item.hidden&&item.children" >
              <router-link
                :to="item.redirect||item.path+'/'+item.children[0].path"
                :key="item.children[0].name"
              >
                <Menu-item :name="item.name">

          
                  <template v-if="'ClientManagement' === item.meta.title && flag.length !== 0">

                  <Icon :type='item.meta.icon'/>
                  <Badge :count="flag.length">
                     {{ $t(item.meta.title) }}
                  </Badge>

                  <span
                    v-if="item.meta&&item.meta.title"
                    slot="title"
                  >
                  <Badge :count="flag.length">
                      <Icon :type='item.meta.icon'/>
                  {{item.meta.title}}
                  </Badge>

                  </span>

                  </template>

                  <template v-else>
              

                  <Icon :type='item.meta.icon'/>

                  {{ $t(item.meta.title) }}

                  <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>

                  </template>
                </Menu-item>
              </router-link>
            </template>
          </template>
        </Menu>
        <div class="headerFooter">
        <template v-if="localVersion && OnlienVersion">
      <Icon v-if="OnlienVersion + '' !== localVersion + ''" type="md-bulb"  style="margin-right:4px;color:#A5D6A7;font-size:20px;"/>
       <span  style="color:#A5D6A7;cursor: pointer;" v-if="OnlienVersion + '' !== localVersion + ''"  @click="HandleUpdate">{{$t('CurrentNewVersion')}}</span>
        </template>
              <Dropdown trigger="click" @on-click="ChangeLanguage" style="margin-Left:10px;">
            <a href="javascript:void(0)">
              {{$t('Set')}}
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="about">{{$t('about')}}</DropdownItem>
              <DropdownItem name="update">{{$t('checkUpdate')}}</DropdownItem>
              <Dropdown placement="right-start">
                 <DropdownItem>
                    {{$t('Language')}}
                    <Icon type="ios-arrow-down"></Icon>
                </DropdownItem>
                 <DropdownMenu slot="list">
                    <DropdownItem name="zh-CN"  :selected='localStorageLang === "zh-CN"'>中文简体</DropdownItem>
                    <DropdownItem name="zh-TW" :selected='localStorageLang === "zh-TW"'>中文繁體</DropdownItem>
                    <DropdownItem name="en-US" :selected='localStorageLang === "en-US"'>English</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </DropdownMenu>
          </Dropdown>


          <Button @click="handleExit">{{$t('logout')}}</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { getUpdate } from '../../../api/common'
import axios from 'axios'
export default {
  data () {
    return {
      expireTime: '',
      expireTimeState: 0,
      localStorageLang: localStorage.getItem('lang'),
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
      ],
      OnlienVersion: ''

    }
  },
  async created () {
    await this.HandleGetUpdate()
    await this.GetOnlenVersion()
  },
  methods: {
    async HandleGetUpdate () {
      try {
        let resp = await getUpdate()
        this.updateUrl = resp.data
      } catch (error) {
        this.$Message.error(this.$t('UpdateAddressfailed'))
      }
    },
    GetOnlenVersion () {
      axios.get(`${this.updateUrl}?${new Date().getTime()}`).then((resp) => {
        this.OnlienVersion = resp.data.Version
        console.log(this.OnlienVersion)
      }).catch(e => {
        this.$Message.error(this.$t('UpdateAddressfailed'))
      })
    },
    async ChangeLanguage (name) {
      if (!name) return

      if (name === 'update') {
        try {
          await this.HandleGetUpdate()

          console.log('++++')
          console.log(this.updateUrl)
          console.log('++++')
          console.log('---')
          console.log(`updater.exe -url:${this.updateUrl}`)
          console.log('---')
          ipcRenderer.sendSync('cmd', { update: `updater.exe -url:${this.updateUrl}` })
        } catch (error) {
          this.$Message.error(this.$t('getOnlineVersionFailed'))
        }
      } else if (name === 'zh-CN' || name === 'zh-TW' || name === 'en-US') {
        this.$i18n.locale = name
        localStorage.setItem('lang', name)
        this.localStorageLang = name
      }
    },
    handleExit () {
      this.$store.dispatch('saveBarInfo', null)
      this.$router.push('/login')
    },
    async HandleUpdate () {
      await this.HandleGetUpdate()
      console.log('++++')
      console.log(this.updateUrl)
      console.log('++++')
      console.log('---')
      console.log(`updater.exe -url:${this.updateUrl}`)
      console.log('---')
      ipcRenderer.sendSync('cmd', { update: `updater.exe  -url:${this.updateUrl}` })
    }
  },
  computed: {
    routes () {
      return this.$router.options.routes || ''
    },
    flag () {
      return this.$store.state.app.HardwareInformation || ''
    },
    localVersion () {
      if (this.$store.state.app.propraminfo) {
        return this.$store.state.app.propraminfo.Version || ''
      } else {
        return ''
      }
    }
  }
}
</script>



<style lang="scss" scoped>
.redColor {
  color: #ff4d43;
}

.wrapper {
  display: flex;
  color: white;
  justify-content: space-between;
}
.headerFooter {
  margin-right: 10px;
}
.headerFooter button {
  margin-left: 15px;
}
.headerFooter .ivu-dropdown-menu {
  line-height: 0 !important;
}
a {
  color: white;
}

.myheader {
  .wrapper {
  .ivu-badge-count {
   top:8px !important;
  }
  }
}
</style>
