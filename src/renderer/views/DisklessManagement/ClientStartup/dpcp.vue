<template>
  <div class="main">
    <Form
      ref="DHCPTable"
      :model="DHCPTable"
      label-position="left"
      :label-width="90"
      :rules="ruleValidate"
      :label-in-value="true"
    >
      <FormItem :label="this.$t('MachineNamePrefix')" prop="prefix">
        <Input v-model="DHCPTable.prefix" :placeholder="$t('pleaseInput')"/>
      </FormItem>
      <FormItem :label="this.$t('Numberlength')" prop="numbetLength">
        <Input v-model="DHCPTable.numbetLength" :placeholder="$t('pleaseInput')"/>
      </FormItem>
      <FormItem :label="this.$t('StartingNumber')" prop="numberBegin">
        <Input v-model="DHCPTable.numberBegin" :placeholder="$t('pleaseInput')"/>
      </FormItem>
      <FormItem :label="this.$t('StartingIP')" prop="ipBegin">
        <Input v-model="DHCPTable.ipBegin" :placeholder="$t('pleaseInput')"/>
      </FormItem>

      <FormItem :label="this.$t('AddMode')" prop="addMode">
        <Select v-model="DHCPTable.addMode" style="width:200px" :placeholder="$t('pleaseInput')">
          <Option value="disable">{{$t('DisableClientAdd')}}</Option>
          <Option value="inputNumber">{{$t('InputNumberAdded')}}</Option>
          <Option value="inputEnter">{{$t('CarriageReturn')}}</Option>
        </Select>
      </FormItem>

      <FormItem :label="this.$t('StartUpPlan')" prop="pcGp">
        <Select v-model="DHCPTable.pcGp" style="width:200px" :placeholder="$t('pleaseInput')" :not-found-text="$t('Nodata')">
          <Option v-for="item in pcGpList" v-bind:key = "item.name" v-bind:value="item.name">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('DHCPTable')" :loading="loading">{{$t('apply')}}</Button>
        <Button @click="handleReset('DHCPTable')" style="margin-left: 8px">{{$t('Reset')}}</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import {
  editDHCPConfigx,
  getPcConfig,
  getPcGroupx,
  getDHCPConfig
} from '@/api/wupan'
export default {
  data () {
    return {
      pcGpList: '',
      showPopup: false,
      loading: false,
      DHCPTable: {
        prefix: '',
        numbetLength: '',
        numberBegin: '',
        ipBegin: '',
        addMode: '',
        pcGp: ''
      },
      ruleValidate: {
        prefix: [
          { required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }
        ],
        numbetLength: [
          {
            required: true,
            message: this.$t('Thisfieldcannotbeempty'),
            trigger: 'blur'
          }
        ],
        numberBegin: [
          {
            required: true,
            message: this.$t('Thisfieldcannotbeempty'),
            trigger: 'blur'
          }
        ],
        ipBegin: [
          {
            required: true,
            message: this.$t('Thisfieldcannotbeempty'),
            trigger: 'blur'
          }
        ],
        addMode: [
          {
            required: true,
            message: this.$t('Thisfieldcannotbeempty'),
            trigger: 'blur'
          }
        ],
        pcGp: [
          {
            required: true,
            message: this.$t('Thisfieldcannotbeempty'),
            trigger: 'blur'
          }
        ]
      },
      clientTable: [
        {
          renderHeader: (h, params) => { return h('span', this.$t('MachineNamePrefix')) },
          key: 'prefix'
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('Numberlength')) },
          key: 'numbetLength'
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('StartingNumber')) },
          key: 'numberBegin'
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('StartingIP')) },
          key: 'ipBegin'
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('AddMode')) },
          key: 'addMode'
        },
        {
          renderHeader: (h, params) => { return h('span', this.$t('StartupScenario')) },
          key: 'pcGp'
        }
      ]
    }
  },
  methods: {
    handUp () {
      this.showPopup = true
    },

    handleSubmit (name) {
      this.loading = true
      let that = this
      that.$refs[name].validate(valid => {
        if (valid) {
          editDHCPConfigx(that.DHCPTable, localStorage.getItem('masterip'))
            .then(e => {
              this.loading = false
              that.$Message.success('DHCP' + this.$t('SetSucess'))
            })
            .catch(() => {
              this.loading = false
              that.$Message.error(this.$t('RequestErrorPleaseTryAgainLater'))
            })
        } else {
          this.loading = false
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handleGetPcConf (mac) {
      getPcConfig(mac)
    },
    getDHCP (ip) {
      getDHCPConfig(ip).then(resp => {
        if (!resp.data.error) {
          this.DHCPTable = resp.data.result || {}
        }
      })
    }
  },
  created () {
    let ip = localStorage.getItem('masterip')
    this.getDHCP(ip)
    getPcGroupx(ip).then((e) => {
      this.pcGpList = e.data.result.list || {}
    },
    (e) => { this.$Message.error(e.data.error) })
  }
}
</script>

<style scoped>
.main {
  display: flex;
  justify-content: flex-start;
}
</style>
