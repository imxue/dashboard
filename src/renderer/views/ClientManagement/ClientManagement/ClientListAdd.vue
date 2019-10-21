<template>
  <div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="width:400px; margin-top:20px;">
        <FormItem :label="this.$t('ClientMAC')" prop="mac" :label-width="110">
              <Input v-model.trim="formValidate.mac" :placeholder="$t('pleaseInput')" :disabled="flag1 === 'Edit'"/>
            </FormItem>

            <FormItem :label="this.$t('MachineNamePrefix')" prop="pc" :label-width="110">
              <Input v-model="formValidate.pc" :placeholder="$t('pleaseInput')" />
            </FormItem>

            <FormItem :label="this.$t('ClientIP')" prop="ip" :label-width="110">
              <Input v-model.trim="formValidate.ip" :placeholder="$t('pleaseInput')"/>
            </FormItem>

            <FormItem :label="this.$t('Enable')" prop="disable" :label-width="110">
                <Select v-model="formValidate.disable"  :placeholder="$t('pleaseInput')"   @on-change="handleGetEnableVal">
                  <Option v-for="item in enableList" :value="item.value" :key="item.label">{{ item.label }}</Option>
                </Select>
            </FormItem>

            <FormItem :label="this.$t('StartupScenario')" prop="pcGp" :label-width="110">
                <Select v-model="formValidate.pcGp"  :placeholder="$t('pleaseInput')"   @on-change="handleGetEnableVal">
                  <Option v-for="item in pcGpList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                </Select>
            </FormItem>

            <FormItem class="buttonList">
                <Button type="primary" @click="handleSubmit('formValidate')">{{this.$t('Save')}}</Button>
                <Button @click="handleReset('formValidate')" style="margin-left: 8px">{{this.$t('cancelText')}}</Button>
            </FormItem>
    </Form>
  </div>
</template>

<script>
  // import { xxx } from '@/utils/index'
  import { setPcConf } from '@/api/client'
  import { getPcGroupx } from '@/api/wupan'
export default {
    name: 'addClient',
    inject: ['reload'],
    props: { data1: Object, flag1: String, clientIp1: Set, pc1: Set, clientMac: Set },
    data () {
      var checkIpformat = (rule, value, callback) => {
        if (!value) {
          return callback(new Error(this.$t('Thisfieldcannotbeempty')))
        } else {
          let reg = '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.' +
                    '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
                    '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
                    '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$'
          let regexp = new RegExp(reg)
          if (regexp.test(value)) {
            if (this.clientIp1.has(value)) {
              return callback(new Error(this.$t('NotrepeatIP')))
            }
            callback()
          } else {
            return callback(new Error(this.$t('IPAddressIsIncorrect')))
          }
        }
      }
      var checkmacAddressformat = (rule, macAddress, callback) => {
        if (this.flag) {
          return callback()
        }
        if (!macAddress) {
          return callback(new Error(this.$t('Thisfieldcannotbeempty')))
        }
        var regex = '(([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2})|(([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2})'
        var regexp = new RegExp(regex)
        if (!regexp.test(macAddress)) {
          return callback(new Error(this.$t('MacAddressFormat')))
        }
        if (this.clientMac.has(macAddress)) {
          return callback(new Error('该客户机已经存在,不能重复添加'))
        }
        return callback()
      }
      var checkPC = (rule, PC, callback) => {
        if (!PC) {
          return callback(new Error(this.$t('Thisfieldcannotbeempty')))
        }
        if (this.pc1.has(PC)) {
          return callback(new Error(this.$t('NotrepeatIP')))
        }
        callback()
      }
      return {
        masterip: this.$store.state.app.masterip || '',
        flag: false, //  修改标志
        data: '',
        EiditIp: '',
        Editpc: '',
        currEnable: '',
        currId: 0,
        activeDnsState: 0,
        backupDnsState: 0,
        enableState: 0,
        gatewayState: 0,
        startSchemaState: 0,
        subnetState: 0,
        pcGpList: [], // 启动方案
        dataList: [],
        enableList: [
          { value: '0', label: this.$t('Enable') },
          { value: '1', label: this.$t('Disable') }
        ],
        projectList: [],

        formValidate: {
          mac: '',
          ip: '',
          pc: '',
          pcGp: '',
          disable: '0'
        },
        ruleValidate: {
          mac: [{ required: true, validator: checkmacAddressformat, trigger: 'change' }],
          ip: [{ required: true, validator: checkIpformat, trigger: 'change' }],
          pc: [{ required: true, validator: checkPC, trigger: 'change' }],
          pcGp: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'change' }],
          disable: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'change' }]
        }
      }
    },
    created () {
      let data = this.flag1
      this.clientMac = this.clientMac
      if (data === 'Edit') {
        this.flag = true
        this.formValidate = Object.assign({}, this.data1)
      } else if (data === 'Add') {
        this.formValidate = {
          mac: '',
          ip: '',
          pc: '',
          pcGp: '',
          disable: '0'
        }
      }
      this.getClientPlan()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      /**
       * 获取客户机启动方案
       */
      getClientPlan () {
        let masterip = this.masterip
        getPcGroupx(masterip).then((e) => {
          this.pcGpList = e.data.result.list
          if (!this.formValidate.pcGp) {
            this.formValidate.pcGp = this.pcGpList[0].name
          }
        },
        (e) => { this.$Message.error(e.data.error) })
      },
  
      handleFormatEnable () {
        var currVal = this.formValidate.enable
        if (currVal === 0) {
          currVal = true // 启用
        } else {
          currVal = false
        }
        this.currEnable = currVal
      },
      handleJsonVaild (res) {
        var code = res.data.Code
        if (code === 0) {
          this.$Message.success('编辑成功')
          this.$router.go(-1)
        } else {
          this.$Message.error('编辑失败：' + res.data.Msg)
        }
      },
      // 批量编辑-监听input值
      handleGetActiveDnsVal (val) {
        this.activeDnsState = 1
      },
      handleGetBackupDnsVal () {
        this.backupDnsState = 1
      },
      handleGetGatewayVal () {
        this.gatewayState = 1
      },
      handleGeStartSchemaVal () {
        this.startSchemaState = 1
      },
      handleGetEnableVal (a) {
        this.enableState = 1
      },
      handleGetStartSchemaVal () {
        this.startSchemaState = 1
      },
      handleGetSubnetVal (val) {
        this.subnetState = 1
      },
      handleSubmit (name) {
        this.$refs[name].validate(valid => {
          if (valid) {
            let masterip = this.masterip
            setPcConf({ mac: this.formValidate.mac, pc: this.formValidate.pc, ip: this.formValidate.ip, disable: this.formValidate.disable, pcGp: this.formValidate.pcGp }, masterip).then((resp) => {
              this.$emit('childByValue')
            }, (error) => {
              console.log(error)
            })
          }
        })
      },
      handleCheckSubmit (name) {
        this.handleFormatEnable()
        if (this.$route.query.data) { // 单个编辑
          this.handleSubmitSingleEdit(name)
        } else {
          this.handleSubmitBatchEdit(name) // 批量编辑
        }
      },
      handleReset (name) {
        this.$refs[name].resetFields()
        this.$emit('childByValue')
      }
    }
  }
</script>

<style scoped>
</style>

