<template>
  <div>
    <Tabs type="card" @on-click="HandleGetAllScheme" :animated="false"  v-model="currentTab">
        <TabPane :label="$t('GlobalSetting')" name="GlobalSetting">
          <div class="main">
            <Button type="primary" v-on:click="handSetIcon">{{$t('AddIcon')}}</Button>
            <Button type="error">{{$t('DeleteIcon')}}</Button>
          </div>
               <Table border :columns="columns1" :data="imgreSource"></Table>  
        </TabPane>
        <TabPane :label="$t('ClientStartPlan')" name="StartPlan" >
          <div class="main">
            <span>{{$t('ClientScheme')}}:</span>
            <Select v-model="plan" style="width:200px" @on-change="handleHomeScreenicon">
              <Option v-for="item in cityList" :value="item.id" v-bind:key="item.id">{{ item.name }}</Option>
            </Select>
             <Checkbox size="large" v-model="single" on-change=''>{{$t('UseGlobalSetting')}}</Checkbox>
            <Button type="primary">{{$t('AddIcon')}}</Button>
            <Button type="error">{{$t('DeleteIcon')}}</Button>
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
      currentTab: 'GlobalSetting',
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
    console.log(this.$t('i.modal'))
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
          if (response.data.ok) {
            this.plan = response.data.data[0].id
            this.HandleGetAllHomeIcon()
          } else {
            this.$Message.info({
              content: response.data.error
            })
          }
        })
      } else {
        this.HandleGetAllHomeIcon()
      }
    },
    ok () {
      console.log(this.SelectedDataGame)

      let info = {
        'is_global': true,
        'gameids': []
      }
      this.SelectedDataGame.forEach(item => {
        info.gameids.push(item.Id)
      })
      setSchemeIcon(info).then(resp => {
        if (resp.data.ok) {

        } else {
          this.$Message.info(resp.data.error)
        }
      })
    },
    handleGetPcGroup () {
      getAllScheme().then((resp) => {
        if (resp.data.ok) {
          var arr = resp.data.data
          if (!resp.data.error) {
            this.cityList = arr
          } else {
            this.$Message.error(resp.data.error)
          }
        }
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
      this.currentTab === 'GlobalSetting' ? info.global = true : info.global = false
      info.schemeId = this.currentTab === 'GlobalSetting' ? '' : this.plan
      getSchemeIcon(info).then(resp => {
        if (resp.data.ok) {
          this.imgreSource = resp.data.data
          this.imgreSource.map(item => {
            item.icon_url = 'http://10.88.66.153:8080/src/icon/localgame/f69997e9e008477ab1806886d58b5be6/48.png'
          })
        }
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
      this.currentTab === 'GlobalSetting' ? info.global = true : info.global = false
      info.schemeId = this.currentTab === 'GlobalSetting' ? '' : this.plan
      getSchemeIcon(info).then(response => {
        if (response.data.ok) {
          this.imgreSource = response.data.data
          this.imgreSource.map(item => {
            item.icon_url = 'http://10.88.66.153:8080/src/icon/localgame/f69997e9e008477ab1806886d58b5be6/48.png'
          })
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
          this.gameSource = response.data.data.data
          // response.data.data.data.filter(item => {
          //   if (item.Name) {
          //     this.GameName.push(item.Name)
          //   }
          //   this.GameAllName = Array.from(this.GameName)
          //   this.GameName = this.GameName.slice(0, 6)
          //   this.temp = Array.from(this.GameAllName)
          // })
          // this.pageInfo = response.data.data.pageino
          // this.pageInfo.page_index++
          // this.DownLoadCount = this.tableData.filter(item => { return item.State !== 0 }).length
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
img:hover{
  cursor: pointer;
  transform: scale(1.1);
}
img:active{
  border:1px dotted;
}
.main{
  z-index: 999999999;
  margin-bottom: 30px;
}
</style>

