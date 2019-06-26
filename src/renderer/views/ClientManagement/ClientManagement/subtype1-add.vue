<template>
  <div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="width:400px; margin-top:20px;">
        <FormItem label="客户机MAC:" prop="mac" :label-width="100">
              <Input v-model.trim="formValidate.mac" placeholder="输入mac地址"/>
            </FormItem>

            <FormItem label="机器名:" prop="pc" :label-width="100">
              <Input v-model="formValidate.pc" placeholder="输入机器名" />
            </FormItem>

            <FormItem label="服务器地址:" prop="ip" :label-width="100">
              <Input v-model="formValidate.ip" placeholder="输入服务器地址"/>
            </FormItem>

            <FormItem label="启动客户机:" prop="disable" :label-width="100">
                <Select v-model="formValidate.disable"  placeholder="是否启用客户机"   @on-change="handleGetEnableVal">
                  <Option v-for="item in enableList" :value="item.value" :key="item.label">{{ item.label }}</Option>
                </Select>
            </FormItem>

            <FormItem label="启动方案:" prop="pcGp" :label-width="100">
                <Select v-model="formValidate.pcGp"  placeholder="选择客户机方案"   @on-change="handleGetEnableVal">
                  <Option v-for="item in pcGpList" :value="item.name" :key="item.label">{{ item.name }}</Option>
                </Select>
            </FormItem>

            <FormItem class="buttonList">
                <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
                <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
            </FormItem>
    </Form>
  </div>
</template>

<script>
  // import { editClient } from '@/api/client'
  import { setPcConf } from '@/api/client'
  import { getPcGroupx } from '@/api/wupan'
  export default {
    name: 'addClient',
    data () {
      var checkmacAddressformat = (rule, macAddress, callback) => {
        if (!macAddress) {
          return callback(new Error(this.$t('Thisfieldcannotbeempty')))
        }
        var regex = '(([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2})|(([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2})'
        var regexp = new RegExp(regex)
        if (!regexp.test(macAddress)) {
          return callback(new Error(this.$t('MacAddressFormat')))
        }
        callback()
      }
      return {
        data: '',
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
          { id: 1, value: '0', label: '启用' },
          { id: 2, value: '1', label: '停用' }
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
          mac: [{ required: true, validator: checkmacAddressformat, trigger: 'blur' }],
          ip: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          pc: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          pcGp: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }],
          disable: [{ required: true, message: this.$t('Thisfieldcannotbeempty'), trigger: 'blur' }]
        }
      }
    },
    created () {
      // this.handleCheckQuery(this.$route.query)
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
        let masterip = localStorage.getItem('masterip')
        getPcGroupx(masterip).then((e) => {
          this.pcGpList = e.data.result.list
          this.formValidate.pcGp = this.pcGpList[0].name
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
      handleInputVal (data) {
        this.currId = data.Id
        this.formValidate.mac = data.Mac
        this.formValidate.ip = data.Ip
        this.formValidate.subnet = data.Subnet
        this.formValidate.gateway = data.Gateway
        this.formValidate.dns01 = data.ActiveDns
        this.formValidate.dns02 = data.BackupDns
        // this.formValidate.enable = data.Enable // 若是State须接另外一个接口
        this.formValidate.cpu = data.Cpu
        this.formValidate.mainBord = data.MainBoard
        this.formValidate.netCrad = data.NetworkCard
        this.formValidate.graphicsCard = data.GraphicsCard
        this.formValidate.soundCard = data.SoundCard
        this.formValidate.project = data.ConfigureScheme
        if (data.Enable === true) {
          this.formValidate.enable = '0'
        } else {
          this.formValidate.enable = '1'
        }
        this.currEnable = this.formValidate.enable
      },
      handleEditMore (data) {
        console.log('dataList:' + JSON.stringify(data[0]))
        this.currId = data[0].Id
        this.formValidate.mac = data[0].Mac
        this.formValidate.ip = data[0].Ip
        this.formValidate.subnet = data[0].Subnet
        this.formValidate.gateway = data[0].Gateway
        this.formValidate.dns01 = data[0].ActiveDns
        this.formValidate.dns02 = data[0].BackupDns
        // this.formValidate.enable = data[0].Enable // 若是State须接另外一个接口
        this.formValidate.cpu = data[0].Cpu
        this.formValidate.mainBord = data[0].MainBoard
        this.formValidate.netCrad = data[0].NetworkCard
        this.formValidate.graphicsCard = data[0].GraphicsCard
        this.formValidate.soundCard = data[0].SoundCard
        this.formValidate.project = data[0].ConfigureScheme
        if (data[0].Enable === true) {
          this.formValidate.enable = '0'
        } else {
          this.formValidate.enable = '1'
        }
        this.currEnable = this.formValidate.enable
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
            let masterip = localStorage.getItem('masterip')
            setPcConf(this.formValidate, masterip).then((resp) => {
              this.$router.go(-1)
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
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
</style>

