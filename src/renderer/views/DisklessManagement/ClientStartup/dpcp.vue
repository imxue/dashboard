<template>
  <div class="main">
    <Form
      ref="formValidate"
      :model="formValidate"
      label-position="left"
      :label-width="90"
      :rules="ruleValidate"
    >
      <FormItem :label="this.$t('MachineNamePrefix')" prop="prefix">
        <Input v-model="formValidate.prefix" :placeholder="$t('pleaseInput')" @on-change='Tip'/>
      </FormItem>
      <FormItem :label="this.$t('Numberlength')" prop="numbetLength">
        <Input v-model="formValidate.numbetLength" :placeholder="$t('pleaseInput')"/>
      </FormItem>
      <FormItem :label="this.$t('StartingNumber')" prop="numberBegin">
        <Input v-model="formValidate.numberBegin" :placeholder="$t('pleaseInput')"/>
      </FormItem>
      <FormItem :label="this.$t('StartingIP')" prop="ipBegin">
        <Input v-model="formValidate.ipBegin" :placeholder="$t('pleaseInput')"/>
      </FormItem>

      <FormItem :label="this.$t('AddMode')" prop="addMode">
        <Select v-model="formValidate.addMode" style="width:200px" :placeholder="$t('pleaseInput')">
          <Option value="disable">{{$t('DisableClientAdd')}}</Option>
          <Option value="inputNumber">{{$t('InputNumberAdded')}}</Option>
          <Option value="inputEnter">{{$t('CarriageReturn')}}</Option>
        </Select>
      </FormItem>

      <FormItem :label="this.$t('StartUpPlan')" prop="pcGp">
        <Select v-model="formValidate.pcGp" style="width:200px">
          <Option v-for="item in pcGpList" v-bind:key = "item.name" v-bind:value="item.name">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')" :loading="loading" :disabled=!this.masterip>{{$t('apply')}}</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px" :disabled=!this.masterip>{{$t('Reset')}}</Button>
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
      masterip: this.$store.state.app.masterip || '',
      dataChange: '',
      pcGpList: '',
      loading: false,
      formValidate: {
        prefix: '',
        numbetLength: '',
        numberBegin: '',
        ipBegin: '',
        addMode: '',
        pcGp: ''
      },
      ruleValidate: {
        prefix: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
        numbetLength: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
        numberBegin: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
        ipBegin: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
        addMode: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
        pcGp: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    handUp () {
      this.showPopup = true
    },
    Tip () {
      this.dataChange = true
    },
    handleSubmit (name) {
      this.loading = true
      let that = this
      that.$refs[name].validate(valid => {
        if (valid) {
          editDHCPConfigx(that.formValidate, this.masterip)
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
      if (!ip) return
      getDHCPConfig(ip).then(resp => {
        this.formValidate = resp.data.result ? resp.data.result : {}
      })
      getPcGroupx(ip).then((e) => {
        this.pcGpList = e.data.result.list || {}
      },
      (e) => { this.$Message.error(e.data.error) })
    }
  },
  created () {
    this.getDHCP(this.masterip)
  }
}
</script>

<style scoped>
.main {
  display: flex;
  justify-content: flex-start;
}
</style>
