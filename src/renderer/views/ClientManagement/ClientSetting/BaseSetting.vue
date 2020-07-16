<template>
  <div style="min-height:500px;">
    <Row>
      <Col span="11">
        <span>{{$t('MenuSet')}}</span>
        <Divider/>
        <div class="row">
          <span>{{$t('BootDoesNotDisplayMenu')}}</span>
          <i-switch v-model="form.is_display_menu" @on-change="is_display_menuChange" :true-value='1' :false-value='0'/>
        </div>
        <div class="row">
          <span>{{$t('SynchronizeTheSystemTime')}}</span>
          <i-switch v-model="form.is_sync_server_time" @on-change="is_sync_server_timeChange" :true-value='1' :false-value='0'/>
        </div>
        <div class="row">
          <span>{{$t('HideTrayAreaMenu')}}</span>
          <i-switch v-model="form.is_hide_pallet_icon" @on-change="is_hide_pallet_iconChange" :true-value='1' :false-value='0'/>
        </div>
        <div class="row">
          <span>{{$t('GameStartupMethod')}}</span>
          <i-switch v-model="form.is_single_click_startup" @on-change="is_single_click_startupChange" :true-value='1' :false-value='0'/>
        </div>


          <div  style="marginTop:10px; "> 
            <span class="desc">{{$t('ClientLanguage')}}:</span>
                 <Select v-model="form.client_language" style="width:200px" @on-change="handleSetLanguage">
                 <Option value="chinese" >{{$t('chinese')}}</Option>
                 <Option value="english" >{{$t('english')}}</Option>
              </Select>
          </div>
      </Col>
    </Row>
    <div class="main">
      <Col span="11">
        <div>
          <span>{{$t('GameArchive')}}</span>
          <Divider/>
        </div>
        <Row>
          <div class="row">
            <span>{{$t('GameArchive')}}</span>
            <i-switch v-model="form.is_open_game_archive" @on-change="is_open_game_archiveChange" :true-value='1' :false-value='0'/>
          </div>
          <div class="rowSinger">
            <span class="desc">{{$t('ArchiveServerIp')}}:</span>
             <Input v-model="archive_server_ip" placeholder="Enter something..." />
             <Button type="primary" @click="SetArchiveServerIp" style="margin-left:10px;">{{$t('Set')}}</Button>
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
        is_display_menu: '',
        is_sync_server_time: '',
        is_hide_pallet_icon: '',
        is_single_click_startup: '',
        is_open_game_archive: '',
        client_language: ''
      },
      tempform: {},
      archive_server_ip: ''

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
    handleSetLanguage (status) {
      this.HandleSetBasic()
    },
    /**
     * 设置是否显示菜单
    */
    is_display_menuChange (status) {
      this.form.is_display_menu = status
      this.HandleSetBasic()
    },
    /**
     * 设置是否同步系统时间
    */
    is_sync_server_timeChange (status) {
      this.form.is_sync_server_time = status
      this.HandleSetBasic()
    },
    /**
     * 设置是单机游戏图标，启动游戏
    */
    is_single_click_startupChange (status) {
      this.form.is_single_click_startup = status
      this.HandleSetBasic()
    },
    /**
     * 游戏是否存档
    */
    is_open_game_archiveChange (status) {
      this.form.is_open_game_archive = status
      this.HandleSetBasic()
    },
    /**
     * 是否隐藏游戏菜单图标托盘区
    */
    is_hide_pallet_iconChange (status) {
      this.form.is_hide_pallet_icon = status
      this.HandleSetBasic()
    },
    /**
     * 设置游戏服务器
    */
    SetArchiveServerIp () {
      this.HandleSetBasic()
    },
    HandleSetBasic () {
      this.form.archive_server_ip = this.archive_server_ip
      setSchemeBasics(this.form).then((response) => {
        this.$Message.info({
          content: this.$t('SetSucess')
        })
        this.HandleGetBasic()
      }, (error) => {
        this.$Message.error({
          content: this.$t(`${error.data.error}`)
        })
        this.HandleGetBasic()
      })
    },
    HandleGetBasic () {
      getSchemeBasics().then((response) => {
        this.archive_server_ip = response.data.archive_server_ip
        this.form = response.data
      }, (e) => {
        this.archive_server_ip = ''
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

