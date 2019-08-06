<template>
  <div>
    <Tabs type="card" @on-click="HandleGetAllScheme" :animated="false"  v-model="currentTab">
        <TabPane :label="$t('DefaultSetting')" name="DefaultSetting">
          <div class="main" >
              <Row :gutter="24">
                <Col :xs="2" :sm="4" :md="6" :lg="2">
                    <Button type="primary" v-on:click="handSetIcon">{{$t('AddIcon')}}</Button>
               </Col>
              <Col :xs="2" :sm="4" :md="6" :lg="2">
            <Button type="error">{{$t('DeleteIcon')}}</Button>
             </Col>
              </Row>
          </div>
               <Table border :columns="columns1" :data="imgreSource"></Table>  
        </TabPane>
        <TabPane :label="$t('ClientStartPlan')" name="StartPlan" class="xx">
         
          <div class="main">
             <Row>
                 <Col :xs="4" :sm="4" :md="8" :lg="8">
                   <span>{{$t('ClientScheme')}}:</span>
                   <Select v-model="plan" style="width:200px" @on-change="handleHomeScreenicon">
                     <Option v-for="item in cityList" :value="item.id" v-bind:key="item.id">{{ item.name }}</Option>
                   </Select>
              </Col>
              <Col :xs="2" :sm="4" :md="4" :lg="4">
             <Checkbox size="large" v-model="single" @on-change='SetDefault' class="test">{{$t('UseDefaultSetting')}}</Checkbox>
             </Col>
              <Col :xs="2" :sm="4" :md="2" :lg="2">
            <Button type="primary" :disabled='flag'>{{$t('AddIcon')}}</Button>
              </Col>
             <Col :xs="2" :sm="4" :md="4" :lg="4">
            <Button type="error" :disabled='flag' >{{$t('DeleteIcon')}}</Button>
            </Col>
             </Row>
          </div>

       <Table border ref="selection" :columns="columns1" :data="imgreSource"></Table>
          
          
          </TabPane>
    </Tabs>
    <Modal
        v-model="AddIconDialog"
        :title= "this.$t('AddIcon')"
        @on-ok="ok">
        <div>
        <Table border :columns="gameListTable" :data="gameSource" @on-select='hanldGetGameDate'></Table>
        </div>
    </Modal>
  </div>
</template>

<script>
import { getAllScheme, getSchemeIcon, setSchemeIcon } from '../../../api/client'
import { getAllGame } from '@/api/localGame'
export default {
  name: 'HomeScreenIcon',
  data () {
    return {
      flag: false,
      DefaultImgreSource: [], // 获取默认图标
      defaultGameId: [], // 默认游戏Id
      currentTab: 'DefaultSetting',
      SelectedDataGame: [], // 选择的游戏
      single: '',
      plan: '',
      cityList: [],
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
            let detele = h('Button', { props: { type: 'error', size: 'small' }, style: { marginRight: '5px' } }, '删除')
            let up = h('Button', { props: { type: 'info', size: 'small' }, style: { marginRight: '5px' } }, '上移')
            let down = h('Button', { props: { type: 'info', size: 'small' }, style: { marginRight: '5px' } }, '下移')
            if (parm.index === 0) {
              return [down, detele]
            } else if (parm.index === 2) {
              return [up, detele]
            } else {
              return [down, up, detele]
            }
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
    this.HandleGetDefaultHomeIcon() // 获取默认图标信息
    this.HandleGetAllHomeIcon()
    this.handleGetPcGroup()
    this.handgetAllGame()
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    /**
     * 点击进入tab页
     */
    HandleGetAllScheme () {
      if (this.currentTab === 'StartPlan') {
        getAllScheme().then((response) => {
          this.plan = response.data[0].id
          this.HandleGetAllHomeIcon()
          this.$Message.info({
            content: response.data.error
          })
        })
      } else {
        this.HandleGetAllHomeIcon()
      }
    },
    ok () {
      let info = {
        'is_global': true,
        'gameids': []
      }
      this.SelectedDataGame.forEach(item => {
        info.gameids.push(item.Id)
      })
      setSchemeIcon(info).then(resp => {
        // if (resp.data.ok) {
        //   debugger
        // } else {
        //   this.$Message.info(resp.data.error)
        // }
      }, (err) => {
        this.$Message.info(err.data.error)
      })
    },
    handleGetPcGroup () {
      getAllScheme().then((resp) => {
        var arr = resp.data
        this.cityList = arr
      }, (error) => {
        this.$Message.error(error.data.error)
      })
    },
    /**
     * 获取默认图标
     */
    HandleGetDefaultHomeIcon () {
      let info = {
        global: true
      }
      getSchemeIcon(info).then(resp => {
        this.DefaultImgreSource = resp.data
        this.defaultGameId = []
        this.DefaultImgreSource.forEach(item => {
          this.defaultGameId.push(item.game_id)
        })
      })
    },
    /**
     * 获取图标
     */
    HandleGetAllHomeIcon () {
      let info = {
        global: '',
        schemeId: ''
      }
      this.currentTab === 'DefaultSetting' ? info.global = true : info.global = false
      info.schemeId = this.currentTab === 'DefaultSetting' ? '' : this.plan
      getSchemeIcon(info).then(resp => {
        this.imgreSource = resp.data
        // this.imgreSource.map(item => {
        //   item.icon_url = 'http://10.88.66.153:8080/src/icon/localgame/f69997e9e008477ab1806886d58b5be6/48.png'
        // })
      })
    },
    /**
     * 获取图标
     */
    handleHomeScreenicon () {
      let info = {
        global: '',
        schemeId: ''
      }
      this.currentTab === 'DefaultSetting' ? info.global = true : info.global = false
      info.schemeId = this.currentTab === 'DefaultSetting' ? '' : this.plan
      getSchemeIcon(info).then(response => {
        if (response.data.ok) {
          this.imgreSource = response.data
          // this.imgreSource.map(item => {
          //   item.icon_url = 'http://10.88.66.153:8080/src/icon/localgame/f69997e9e008477ab1806886d58b5be6/48.png'
          // })
        } else {
          this.imgreSource = []
          this.$Message.info({
            content: response.data.error
          })
        }
      })
    },
    handSetIcon () {
      this.AddIconDialog = true
    },
    /*
    * 获取全部游戏
    */
    handgetAllGame (offset, limit, orderby) {
      getAllGame(0, 10, 'Name').then(response => {
        if (response.data.ok) {
          this.gameSource = response.data
        }
      }, (e) => {
        // 这里执行reject状态的
        this.$Message.error(this.$t('kxLinuxErr.36873'))
      }).catch((e) => {
        // 在发送代码错误时执行这里
        this.$Message.error(this.$t('kxLinuxErr.10'))
      })
    },
    hanldGetGameDate (data) {
      this.SelectedDataGame = data
      console.log(this.SelectedDataGame)
    },
    /**
      使用默认设置
    */
    SetDefault (data) {
      if (data) {
        this.flag = true
        let info = {
          'scheme_id': 'ac4487b27bb14051a9d931651891ef8d',
          'gameids': [],
          'is_global': false
        }
        info.gameids = this.defaultGameId
        setSchemeIcon(info).then(resp => {
          if (resp.data.ok) {

          } else {
            this.$Message.info(resp.data.error)
          }
        })
      } else {
        this.flag = false
      }
    }
  },
  mounted () {}
}
</script>

<style scoped>
.main{
  margin-bottom: 30px;
}
.xx {
  height:500px;
}
.test{
  padding-top: 4px;
}
</style>

