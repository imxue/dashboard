<template>
  <div>
    <Tabs type="card" @on-click="HandleGetAllScheme" :animated="false"  v-model="currentTab">
        <TabPane :label="$t('GlobalSetting')" name="GlobalSetting">
          <div>
            <Button type="primary">{{$t('AddIcon')}}</Button>
            <Button type="error">{{$t('DeleteIcon')}}</Button>
          </div>
          <div class="border">
              <div v-for="item in this.imgreSource" v-bind:key="item.id" class="item">
                <img :src='item.icon_url' style="height:46px;width:46px">
                <span>{{item.display_name}}</span>
              </div>
              
          </div>
        </TabPane>
        <TabPane :label="$t('ClientStartPlan')" name="StartPlan" >
          <div>
            <span>{{$t('ClientScheme')}}:</span>
            <Select v-model="plan" style="width:200px" @on-change="handleHomeScreenicon">
              <Option v-for="item in cityList" :value="item.id" v-bind:key="item.id">{{ item.name }}</Option>
            </Select>
            <Radio v-model="single">{{$t('UseGlobalSetting')}}</Radio>
            <Button type="primary">{{$t('AddIcon')}}</Button>
            <Button type="error">{{$t('DeleteIcon')}}</Button>
          </div>


          <div class="border">
              <div v-for="item in this.imgreSource" v-bind:key="item.id" class="item">
                <img :src='item.icon_url' style="height:46px;width:46px">
                <span>{{item.display_name}}</span>
              </div>
          </div>
          
          </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { getAllScheme, getSchemeIcon } from '../../../api/client'
export default {
  name: 'HomeScreenIcon',
  data () {
    return {
      currentTab: 'GlobalSetting',
      single: '',
      plan: '',
      cityList: [],
      imgreSource: []
    }
  },
  created () {
    this.HandleGetAllHomeIcon()
    this.handleGetPcGroup()
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
    }
  }
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
</style>

