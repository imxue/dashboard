<template>
  <div>
    <Row>
      <Col span="8">
        <span>{{$t('MenuSet')}}</span>
        <Divider/>
        <div class="row">
          <span>{{$t('BootDoesNotDisplayMenu')}}</span>
          <i-switch v-model="form.is_display_menu" @on-change="is_display_menuChange"/>
        </div>
        <div class="row">
          <span>{{$t('SynchronizeTheSystemTime')}}</span>
          <i-switch v-model="form.is_sync_server_time" @on-change="is_sync_server_timeChange"/>
        </div>
        <div class="row">
          <span>{{$t('HideTrayAreaMenu')}}</span>
          <i-switch v-model="form.is_hide_pallet_icon" @on-change="is_hide_pallet_iconChange"/>
        </div>
        <div class="row">
          <span>{{$t('GameStartupMethod')}}</span>
          <i-switch v-model="form.is_single_click_startup" @on-change="is_single_click_startupChange"/>
        </div>
      </Col>
    </Row>
    <div class="main">
      <Col span="8">
        <div>
          <span>{{$t('GameArchive')}}</span>
          <Divider/>
        </div>
        <Row>
          <div class="row">
            <span>{{$t('GameArchive')}}</span>
            <i-switch v-model="form.is_open_game_archive" @on-change="is_open_game_archiveChange"/>
          </div>
          <div class="rowSinger">
            <span class="desc">{{$t('ArchiveServerIp')}}:</span>
             <Input v-model="archive_server_ip" placeholder="Enter something..." />
             <Button type="primary" @click="SetArchiveServerIp">{{$t('Set')}}</Button>
          </div>
        </Row>
      </Col>
    </div>
  </div>
</template>

<script>
import { setSchemeBasics, getSchemeBasics } from '../../../api/client'
export default {
  name: 'BaseSetting',
  data () {
    return {
      form: {
        is_display_menu: true,
        is_sync_server_time: true,
        is_hide_pallet_icon: true,
        is_single_click_startup: true,
        is_open_game_archive: true
      },
      archive_server_ip: '10.88.66.21'

    }
  },
  created () {
    this.HandleGetBasic()
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    /**
     * 设置是否显示菜单
    */
    is_display_menuChange (status) {
      this.form.is_display_menu = status ? 1 : 0
      Object.keys(this.form).forEach((key) => {
        if (typeof this.form[key] === 'boolean' || this.form[key] === Number(1)) {
          this.form[key] = 1
        } else {
          this.form[key] = 0
        }
      })
      this.form.archive_server_ip = this.archive_server_ip
      this.HandleSetBasic(this.form)
    },
    /**
     * 设置是否同步系统时间
    */
    is_sync_server_timeChange (status) {
      this.form.is_sync_server_time = status ? 1 : 0
      Object.keys(this.form).forEach((key) => {
        if (typeof this.form[key] === 'boolean' || this.form[key] === Number(1)) {
          this.form[key] = 1
        } else {
          this.form[key] = 0
        }
      })
      this.form.archive_server_ip = this.archive_server_ip
      this.HandleSetBasic(this.form)
    },
    /**
     * 设置是单机游戏图标，启动游戏
    */
    is_single_click_startupChange (status) {
      this.form.is_single_click_startup = status ? 1 : 0
      Object.keys(this.form).forEach((key) => {
        if (typeof this.form[key] === 'boolean' || this.form[key] === Number(1)) {
          this.form[key] = 1
        } else {
          this.form[key] = 0
        }
      })
      this.form.archive_server_ip = this.archive_server_ip
      this.HandleSetBasic(this.form)
    },
    /**
     * 游戏是否存档
    */
    is_open_game_archiveChange (status) {
      this.form.is_open_game_archive = status ? 1 : 0
      this.HandleSetBasic(this.form)
    },
    /**
     * 是否隐藏游戏菜单图标托盘区
    */
    is_hide_pallet_iconChange (status) {
      this.form.is_hide_pallet_icon = status ? 1 : 0
      Object.keys(this.form).forEach((key) => {
        if (typeof this.form[key] === 'boolean' || this.form[key] === Number(1)) {
          this.form[key] = 1
        } else {
          this.form[key] = 0
        }
      })
      this.form.archive_server_ip = this.archive_server_ip
      this.HandleSetBasic(this.form)
    },
    /**
     * 设置游戏服务器
    */
    SetArchiveServerIp () {
      Object.keys(this.form).forEach((key) => {
        console.log(this.form[key])
        if (this.form[key] === true || this.form[key] === Number(1)) {
          this.form[key] = 1
        } else {
          this.form[key] = 0
        }
      })
      this.form.archive_server_ip = this.archive_server_ip
      this.HandleSetBasic(this.form)
    },
    HandleSetBasic (data) {
      setSchemeBasics(data).then((response) => {
        console.log(response)
      })
    },
    HandleGetBasic () {
      getSchemeBasics().then((response) => {
        if (response.data.ok) {
          console.log(response.data.data)
        } else {
          this.$Message.info({
            content: response.data.error
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.row{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
}
.rowSinger{
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap:nowrap
}
.desc{
   width: 60%;
}
.main{
  margin-top: 80px;
  overflow: hidden;
}
</style>

