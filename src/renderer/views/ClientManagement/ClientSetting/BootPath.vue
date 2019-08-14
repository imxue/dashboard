<template>
  <div>
    <Tabs type="card" :animated="false" v-model="currentTab" @on-click="HandleGetAllScheme">
      <TabPane :label="$t('DefaultSetting')" name="DefaultSetting">
        <div>
          <Button type="primary" v-on:click="HandEdit" v-if="disabled">{{$t('EditBootPath')}}</Button>
          <Button type="primary" v-on:click="HandSetSchemeBatch" v-if="!disabled">{{$t('SaveBootPath')}}</Button>
        </div>
        <div class="footer">
          <Input
            type="textarea"
            :autosize="{minRows: 20,maxRows: 20}"
            :disabled="disabled"
            v-model="bootPathG"
          />
        </div>
      </TabPane>

      <TabPane :label="$t('ClientStartPlan')" name="StartPlan">
        <div>
          <span>{{$t('ClientScheme')}}:</span>
          <Select v-model="plan" style="width:200px" @on-change="handleGetBootBath">
            <Option v-for="item in cityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
          <Checkbox size="large" v-model="single" @on-change="setDefault">{{$t('UseDefaultSetting')}}</Checkbox>
          <Button type="primary" v-on:click="HandEdit" v-if="disabledSinger" >{{$t('EditBootPath')}}</Button>
          <Button type="primary" v-on:click="HandSetSchemeBatch" v-if="!disabledSinger">{{$t('SaveBootPath')}}</Button>
        </div>
        <div class="footer">
          <Input
            type="textarea"
            :autosize="{minRows: 20,maxRows: 20}"
            :disabled="disabledSinger"
            v-model="bootPathS"
          />
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import {
  getSchemeBatch,
  getAllScheme,
  setSchemeBatch
} from '../../../api/client'
export default {
  name: 'BootPath',
  data () {
    return {
      currentTab: 'DefaultSetting',
      single: '',
      plan: '',
      cityList: [],
      disabled: true,
      disabledSinger: true,
      bootPathG: '',
      bootPathS: '',
      flag: true
    }
  },
  created () {
    this.handleGetBootBath()
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
    // plan () {
    //   return this.handleGetBootBath()
    // }
  },
  methods: {
    test () {
      let matched = this.$route.matched.filter(item => item.name)
      console.log(matched)
    },
    setDefault (data) {
      if (data) {
        this.flag = true
      } else {
        this.fiag = false
      }
    },
    HandEdit () {
      this.currentTab === 'DefaultSetting'
        ? (this.disabled = false)
        : (this.disabledSinger = false)
    },
    /**
     * 获取批处理文件
     */
    handleGetBootBath () {
      let data
      if (this.currentTab === 'DefaultSetting') {
        data = {
          global: 'true'
        }
      } else {
        data = {
          schemeId: this.plan
        }
      }
      getSchemeBatch(data).then(response => {
        data.global ? this.bootPathG = response.data.batch_process : this.bootPathS = response.data.batch_process
      }, (data) => {
        this.$Message.error({
          content: data.response.statusText
        })
      })
    },
    /**
     * 获取客户方案计划
     */
    HandleGetAllScheme () {
      if (this.currentTab === 'StartPlan') {
        getAllScheme().then(response => {
          this.cityList = response.data
          console.log(this.cityList)
          this.plan = this.cityList[0].id
          this.handleGetBootBath()
        }, (response) => {
          this.$Message.info({
            content: response.data.error
          })
        })
      }
    },
    /***
     * 设置批处理
     */
    HandSetSchemeBatch () {
      let info = {
        is_global: '',
        scheme_id: '',
        batch_process: ''
      }
      this.currentTab === 'DefaultSetting' ? info.is_global = true : info.is_global = false
      info.scheme_id = this.currentTab === 'DefaultSetting' ? '' : this.plan
      info.batch_process = this.currentTab === 'DefaultSetting' ? this.bootPathG : this.bootPathS
      setSchemeBatch(info).then(resp => {
        this.currentTab === 'DefaultSetting' ? this.disabled = 'false' : this.disabledSinger = 'false'
        this.$Message.info({ content: this.$t('SetSucess') })
      })
    }
  }
}
</script>

<style scoped>
.footer {
  margin-top: 10px;
}
</style>

