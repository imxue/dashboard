<template>
  <div>
    <Tabs type="card" @on-click="HandleGetAllScheme" :animated="false"  v-model="currentTab">
        <TabPane :label="$t('DefaultSetting')" name="DefaultSetting">
          <div class="main">
            <Button type="primary" v-on:click="handSetIcon">{{$t('AddIcon')}}</Button>
          </div>
            <Table border :columns="columns1" :data="imgreSource"></Table>  
        </TabPane>
        <TabPane :label="$t('ClientStartPlan')" name="StartPlan" >
          <div class="main">
            <span>{{$t('ClientScheme')}}:</span>
            <Select  v-model="plan" style="width:200px" @on-change="handleHomeScreenicon">
              <Option v-for="item in cityList" :value="item.id" v-bind:key="item.id">{{ item.name }}</Option>
            </Select>
             <Checkbox size="large" false-value='0' true-value='1' v-model="single" @on-change='SetDefault'>{{$t('UseDefaultSetting')}}</Checkbox>
            <Button type="primary" v-on:click="handSetIcon" :disabled="single === '1'">{{$t('AddIcon')}}</Button>
          </div>
          <div class="xx">
          <Table v-show='single !== "1"' border ref="selection" :columns="columns1" :data="imgreSource"></Table>
          </div>
          </TabPane>
    </Tabs>
    <Modal
        v-model="AddIconDialog"
        :title= "this.$t('AddIcon')"
        @on-ok="ok">
        <div class="wr">
        <Table  border :columns="gameListTable" :data="gameSource" @on-selection-change='hanldGetGameDate'></Table>
         <Page simple :total="this.pageInfo.count" show-total :current="pageInfo.index + 1" :page-size="this.Pagelimit"  @on-change="handleGetTableList" /></Col>
        </div>
    </Modal>
  </div>
</template>

<script>
import { getAllScheme, getSchemeIcon, setSchemeIcon, useDefaultSetting } from '../../../api/client'
import { getAllGame } from '@/api/localGame'
export default {
  name: 'HomeScreenIcon',
  data () {
    return {
      flag: false,
      srcGame: '', // 全部游戏
      DefaultImgreSource: [], // 获取默认图标
      defaultGameId: [], // 默认游戏Id
      currentTab: 'DefaultSetting',
      SelectedDataGame: [], // 选择的游戏
      single: '0',
      plan: '',
      planCopy: '',
      cityList: [],
      pageInfo: {
        count: 0,
        index: 0
      },
      Pagelimit: 11,
      imgreSource: [],
      gameSource: [],
      AddIconDialog: false,
      columns1: [
        {
          renderHeader: (h, params) => { return h('span', this.$t('Icon')) },
          key: 'icon_url',
          render: (h, params) => {
            if (!params.row.icon_url) { return h('span', 'unused') }
            return h('img', { attrs: { src: params.row.icon_url }, style: { width: '40px', height: '40px', display: 'flex' } })
          }
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('gameName')) },
          key: 'display_name'
        },
        {
          title: 'operation',
          key: 'operation',
          render: (h, parm) => {
            let detele = h('Button', {
              props: { type: 'error' },
              style: { marginRight: '5px' },
              on: { click: () => { this.handleFixGame(parm.row) } }
            }, '删除')
            // let up = h('Button', { props: { type: 'info' }, style: { marginRight: '5px' } }, '上移')
            // let down = h('Button', { props: { type: 'info' }, style: { marginRight: '5px' } }, '下移')
            // if (parm.index === 0) {
            //   return [down, detele]
            // } else if (parm.index === 2) {
            //   return [up, detele]
            // } else {
            return [detele]
            // }
          }
        }
      ],
      gameListTable: [
        { type: 'selection', width: '50px', align: 'center' },
        { key: 'TypeName',
          minWidth: 130,
          renderHeader: (h, params) => { return h('span', this.$t('TypeName')) }
        },
        { key: 'Name', minWidth: 120, renderHeader: (h, params) => { return h('span', this.$t('gameName')) } }
      ]
    }
  },
  created () {
    // this.HandleGetDefaultHomeIcon() // 获取默认图标信息
    this.HandleGetAllHomeIcon()
    // this.handleGetPcGroup()
  },
  computed: {
  },
  methods: {
    handleFixGame (v) {
      let info = {
        schemeId: ''
      }
      let infox = {
        'is_default': '',
        'gameids': [],
        'scheme_id': ''
      }
      this.currentTab === 'DefaultSetting' ? infox.is_default = true : infox.is_default = false
      infox.scheme_id = this.currentTab === 'DefaultSetting' ? '' : this.plan
      info.schemeId = this.currentTab === 'DefaultSetting' ? '' : this.plan
      getSchemeIcon(info).then(resp => {
        this.imgreSource = resp.data
      })
      let tempGameid = this.imgreSource.filter(item => {
        return v.game_id !== item.game_id
      })
      if (tempGameid.length !== 0) {
        tempGameid.forEach(item => {
          infox.gameids.push(item.game_id)
        })
      }

      setSchemeIcon(infox).then(resp => {
        this.notifyUserOfSucess('Sucess')
        this.HandleGetAllScheme()
      }, (err) => {
        this.$Message.info(err.data.error)
      })
    },
    /**
     * 点击进入tab页
     */
    async HandleGetAllScheme () {
      if (this.currentTab === 'StartPlan') {
        try {
          await this.handleGetPcGroup()
          this.HandleGetAllHomeIcon()
        } catch (error) {
          this.$Message.info({
            content: error.data.error
          })
        }
      } else {
        this.HandleGetAllHomeIcon()
      }
    },
    ok () {
      let info = {
        'is_default': this.currentTab === 'DefaultSetting',
        'gameids': [],
        'scheme_id': ''
      }
      if (this.plan && this.currentTab !== 'DefaultSetting') {
        info.scheme_id = this.plan
      }

      this.SelectedDataGame.forEach(item => {
        info.gameids.push(item.Id)
      })
      setSchemeIcon(info).then(resp => {
        this.notifyUserOfSucess('Sucess')
        this.HandleGetAllScheme()
      }, (err) => {
        this.$Message.info(err.data.error)
      })
    },
    /**
     * 获取启动方案
     */
    async handleGetPcGroup () {
      try {
        let resp = await getAllScheme()
        // this.cityList = resp.data.filter(item => {
        //   return item.name !== 'default'
        // })

        this.cityList = resp.data
        if (this.cityList.length !== 0) {
          this.plan = this.cityList[0].id
        }
      } catch (error) {
        this.$Message.error(error.data.error)
      }
    },
    /**
     * 获取图标
     */
    HandleGetAllHomeIcon () {
      let info = {
        default: '',
        schemeId: ''
      }
      this.currentTab === 'DefaultSetting' ? info.default = true : info.schemeId = this.plan
      // info.schemeId = this.currentTab === 'DefaultSetting' ? '' : this.plan

      getSchemeIcon(info).then(resp => {
        this.single = resp.data.use_default_setting + ''
        if (this.single === '1' && this.currentTab !== 'DefaultSetting') {
          this.imgreSource = []
        } else {
          this.imgreSource = resp.data.scheme_icon_settings || []
        }
      })
    },
    /**
     * 获取图标
     */
    handleHomeScreenicon (v) {
      let info = {
        default: false,
        schemeId: this.plan
      }
      getSchemeIcon(info).then(response => {
        this.single = response.data.use_default_setting + ''
        if (response.data.scheme_icon_settings) {
          this.imgreSource = response.data.scheme_icon_settings
        } else {
          this.imgreSource = []
        }
      }, (response) => {
        this.imgreSource = []
        this.$Message.info({
          content: response.data.error
        })
      })
    },
    async handSetIcon () {
      await this.handgetAllGame()
      this.AddIconDialog = true
    },
    /*
    * 获取全部游戏
    */
    handgetAllGame (offset, limit, orderby) {
      getAllGame({ offset: 0, limit: 20000, orderby: 'Name' }).then(response => {
        this.srcGame = response.data.data
        this.pageInfo.count = this.srcGame.length
        this.gameSource = this.srcGame.slice(0, this.Pagelimit)
        if (this.imgreSource && this.imgreSource.length > 0) {
          this.gameSource.forEach(item => {
            this.imgreSource.forEach(img => {
              if (img.game_id === item.Id) {
                item._checked = true
              }
            })
          })
        }
      }, (e) => {
        // 这里执行reject状态的
        this.$Message.error(this.$t('kxLinuxErr.36873'))
      }).catch((e) => {
        // 在发送代码错误时执行这里
        this.$Message.error(this.$t('kxLinuxErr.10'))
      })
    },
    handleGetTableList (index) {
      this.gameSource = this.srcGame.slice(((index - 1) * this.Pagelimit), index * this.Pagelimit)
    },
    hanldGetGameDate (data) {
      this.SelectedDataGame = data
    },
    /**
      使用默认设置
    */
    SetDefault (data) {
      this.single = data
      let info = {
        isIcon: true,
        schemeId: this.plan,
        default: data === '1'
      }
      useDefaultSetting(info).then(resp => {
        this.HandleGetAllHomeIcon()
      })
    }
  },
  mounted () {}
}
</script>
<style scoped>
.item{
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  align-items: center;
}
.border{
  margin-top:10px;
  height: 600px;
  padding:10px;
  border:1px solid #DCDEE2;
  display: flex;
}
.main{
  margin-bottom: 30px;
}
.xx{
  height: 500px;
}
.wr > .ivu-page {
  margin-top:10px;
  text-align: right;
}
</style>

