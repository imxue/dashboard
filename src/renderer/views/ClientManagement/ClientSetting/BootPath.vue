<template>
  <div style="min-height:500px;">
    <Tabs type="card" :animated="false" v-model="currentTab" @on-click="HandleGetAllScheme" style="min-height:500px;">
      <TabPane :label="$t('DefaultSetting')" name="DefaultSetting">
        <div>
          <Button type="primary" v-on:click="HandEdit" v-if="disabled">{{$t('EditBootPath')}}</Button>
          <Button type="primary" v-on:click="HandSetSchemeBatch" v-if="!disabled">{{$t('SaveBootPath')}}</Button>
        </div>
        <div class="footer">
          <Input
            type="textarea"
            :autosize="{minRows: 20,maxRows: 35}"
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
          <Checkbox size="large" true-value='1' false-value='0' v-model="single" @on-change="setDefault">{{$t('UseDefaultSetting')}}</Checkbox>
          <Button type="primary" v-on:click="HandEdit" v-if="disabledSinger" :disabled="single === '1'">{{$t('EditBootPath')}}</Button>
          <Button type="primary" v-on:click="HandSetSchemeBatch" v-if="!disabledSinger" :disabled="single === '1'">{{$t('SaveBootPath')}}</Button>
        </div>
        <div class="footer">
          <Input
            v-show='single !== "1"'
            type="textarea"
            :autosize="{minRows: 20,maxRows: 35}"
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
  setSchemeBatch,
  useDefaultSetting
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
      this.single = data
      let info = {
        isIcon: false,
        schemeId: this.plan,
        default: data === '1'
      }
      useDefaultSetting(info).then(resp => {
        this.handleGetBootBath()
      })
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
        this.single = response.data.use_default_setting + ''
      }, (data) => {
        this.$Message.error({
          content: (data.response && data.response.statusText) || data.data.error
        })
      })
    },
    /**
     * 获取客户方案计划
     */
    HandleGetAllScheme () {
      if (this.currentTab === 'StartPlan') {
        getAllScheme().then(response => {
          this.cityList = response.data.filter(item => {
            return item.name !== 'default'
          })
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
        is_default: '',
        scheme_id: '',
        batch_process: ''
      }
      this.currentTab === 'DefaultSetting' ? info.is_default = true : info.is_default = false
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

