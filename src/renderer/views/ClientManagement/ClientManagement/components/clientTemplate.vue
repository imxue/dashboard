<template>
  <Modal
    v-model="showClientTemplate"
    :title="this.$t('ClientSetting')"
    @on-visible-change="handleVisibleChange"
    footer-hide
  >
    <Form
      ref="formValidate"
      :model="form"
      :rules="rule"
      :label-width="80"
      style="width:400px; margin-top:20px;"
    >
      <FormItem :label="this.$t('ClientMAC')" prop="mac" :label-width="110">
        <Input v-model.trim="form.mac" :placeholder="$t('pleaseInput')" :disabled="flag === 'edit'"/>
      </FormItem>

      <FormItem
        :label="this.$t('MachineNamePrefix')"
        prop="pc"
        :label-width="110"
      >
        <Input v-model="form.pc" :placeholder="$t('pleaseInput')" />
      </FormItem>

      <FormItem :label="this.$t('ClientIP')" prop="ip" :label-width="110">
        <Input v-model.trim="form.ip" :placeholder="$t('pleaseInput')" />
      </FormItem>

      <FormItem :label="this.$t('Enable')" prop="disable" :label-width="110">
        <Select v-model="form.disable" :placeholder="$t('pleaseInput')">
          <Option
            v-for="item in enableList"
            :value="item.value"
            :key="item.label"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>

      <FormItem
        :label="this.$t('StartupScenario')"
        prop="pcGp"
        :label-width="110"
      >
        <Select v-model="form.pcGp" :placeholder="$t('pleaseInput')">
          <Option
            v-for="item in pcGpList"
            :value="item.name"
            :key="item.name"
            >{{ item.name }}</Option
          >
        </Select>
      </FormItem>

      <FormItem class="buttonList">
        <Button type="primary" @click="handleSubmit('formValidate')">{{
          this.$t("Save")
        }}</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">{{
          this.$t("cancelText")
        }}</Button>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { getPcGroupx } from '@/api/wupan'
import { setPcConf } from '@/api/client'
export default {
  name: 'ClientTemplate',
  props: {
    showClientTemplate: {
      type: Boolean,
      default: false
    },
    clientData: {
      type: Object,
      default: {}
    },
    masterIp: {
      type: String,
      default: ''
    },
    // 修改或添加
    flag: {
      type: String,
      default: 'Add'
    }
  },
  data () {
    return {
      rule: {},
      pcGpList: [],
      enableList: [
        { value: '0', label: this.$t('Enable') },
        { value: '1', label: this.$t('Disable') }
      ]
    }
  },
  computed: {
    form () {
      return JSON.parse(JSON.stringify(this.clientData))
    }
    // show () {
    //   return this.
    // }
  },
  methods: {
    handleVisibleChange (show) {
      this.$emit('VisibleclientTemplate', show)
      show && this.fetchPcGroup()
    },
    async fetchPcGroup () {
      let resp = await getPcGroupx(this.masterIp)
      if (resp.data.result) {
        this.pcGpList = resp.data.result.list
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          setPcConf({ mac: this.form.mac, pc: this.form.pc, ip: this.form.ip, disable: this.form.disable, pcGp: this.form.pcGp }, this.masterIp)
            .then((resp) => {
              this.$emit('closed')
              let text = this.flag === 'edit' ? 'modify' : 'Add'
              this.$Message.sucess(this.$t(text) + this.$t('success'))
            }, (error) => {
              this.$Message.error(error)
            })
        }
      })
    }
  }
}
</script
>>
