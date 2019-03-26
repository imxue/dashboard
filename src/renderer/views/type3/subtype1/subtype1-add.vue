<template>
  <div style="margin-top:50px;">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
        
        <Row>
          <i-col span="6" offset="2">
            <FormItem label="客户机MAC:" prop="mac">
              <Input v-model="formValidate.mac" placeholder="..." :disabled="disabledMAC"/>
            </FormItem>
            <FormItem label="IP:" prop="ip">
              <Input v-model="formValidate.ip" placeholder="..." :disabled="disabledIP"/>
            </FormItem>
            <FormItem label="子网:" prop="subnet">
              <Input v-model="formValidate.subnet" placeholder="..."  @input="handleGetSubnetVal"/>
            </FormItem>
            <FormItem label="网关:" prop="gateway">
              <Input v-model="formValidate.gateway" placeholder="..."  @input="handleGetGatewayVal"/>
            </FormItem>
            <FormItem label="首选DNS:" prop="dns01">
              <Input v-model="formValidate.dns01" placeholder="..." @input="handleGetActiveDnsVal"/>
            </FormItem>
            <FormItem label="备用DNS:" prop="dns02">
              <Input v-model="formValidate.dns02" placeholder="..." @input="handleGetBackupDnsVal"/>
            </FormItem>
            <FormItem label="状态:" prop="enable">
                <Select v-model="formValidate.enable"  class="topColumn"  placeholder="全部游戏类型"   @on-change="handleGetEnableVal">
                  <Option v-for="item in enableList" :value="item.value" :key="item.label">{{ item.label }}</Option>
                </Select>
            </FormItem>
          </i-col>
          <i-col span="8">
            <FormItem label="CPU:">
              <Input v-model="formValidate.cpu" placeholder="..."  style="width:250px;" disabled/>
              <span class="text">//只读</span>
            </FormItem>
            <FormItem label="主板:">
              <Input v-model="formValidate.mainBord" placeholder="" style="width:250px;" disabled/>
              <span class="text">//只读</span>
            </FormItem>
            <FormItem label="网卡">
              <Input  v-model="formValidate.netCard" placeholder="..." style="width:250px;" disabled/>
              <span class="text">//只读</span>
            </FormItem>
            <FormItem label="显卡:">
              <Input v-model="formValidate.graphicsCard" placeholder="..." style="width:250px;" disabled/>
              <span class="text">//只读</span>
            </FormItem>
            <FormItem label="声卡:">
              <Input v-model="formValidate.soundCard" placeholder="..." style="width:250px;" disabled/>
              <span class="text">//只读</span>
            </FormItem>
            <FormItem label="方案:" prop="project">
                <Select v-model="formValidate.project" @on-change="handleGetStartSchemaVal"  class="topColumn" placeholder="默认启动方案" style="width:250px;">
                  <Option v-for="item in projectList" :value="item.value" :key="item.label" >{{ item.label }}</Option>
                </Select>
            </FormItem>
          </i-col>
        </Row>
        <FormItem class="buttonList">
            <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
  </div>
</template>

<script>
  // import { editClient } from '@/api/client'
  import { editClient, batchEditClient, getServers } from '@/api/client'
  // getServers 启动方案
  export default {
    name: 'subType1-1',
    data () {
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
        disabledMAC: false,
        disabledIP: false,
        dataList: [],
        enableList: [
          { id: 1, value: '0', label: '启用' },
          { id: 2, value: '1', label: '停用' }
        ],
        projectList: [
          // { id: 1, value: '默认启动方案', label: '默认启动方案' },
          // { id: 2, value: 'windos', label: 'windos' }
        ],
        formValidate: {
          mac: '',
          ip: '',
          subnet: '',
          gateway: '',
          dns01: '',
          dns02: '',
          enable: '',
          cpu: '',
          mainBord: '',
          netCrad: '',
          graphicsCard: '',
          soundCard: '',
          project: ''
        },
        ruleValidate: {
          // mac: [{ required: true, message: '不能为空', trigger: 'blur' }],
          // ip: [{ required: true, message: '不能为空', trigger: 'blur' }],
          // subnet: [{ required: true, message: '不能为空', trigger: 'blur' }],
          // gateway: [{ required: true, message: '不能为空', trigger: 'blur' }],
          // dns01: [{ required: true, message: '不能为空', trigger: 'blur' }],
          // dns02: [{ required: true, message: '不能为空', trigger: 'blur' }],
          // enable: [{ required: true, message: '请至少选择一个', trigger: 'change' }],
          // project: [{ required: true, message: '请至少选择一个', trigger: 'change' }]
        }
      }
    },
    created () {
      this.handleCheckQuery(this.$route.query)
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleGetServerList () {
        getServers().then((a) => {
          if (a.data.error === null) {
            var arr = a.data.result.list
            this.projectList = arr.filter(item => item.name)
          } else {
            this.projectList = []
            this.$Message.error('获取启动方案状态异常')
          }
        })
      },
      handleCheckQuery (query) {
        if (query.data) {
          this.handleInputVal(query.data) // 单个编辑
        }
        if (query.dataList) {
          this.disabledMAC = true
          this.disabledIP = true
          this.handleEditMore(query.dataList) // 批量编辑
        }
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
        this.handleCheckSubmit(name)
      },
      handleCheckSubmit (name) {
        this.handleFormatEnable()
        if (this.$route.query.data) { // 单个编辑
          this.handleSubmitSingleEdit(name)
        } else {
          this.handleSubmitBatchEdit(name) // 批量编辑
        }
      },
      handleSubmitSingleEdit (name) {
        editClient(this.formValidate.dns01, this.formValidate.dns02, this.currEnable, this.formValidate.gateway, this.currId, this.formValidate.ip, this.formValidate.mac, this.formValidate.project, this.formValidate.subnet).then((res) => {
          this.handleJsonVaild(res)
        }, () => {
          this.$Message.error('请求出错，请稍后再试')
        })
      },
      handleCheckInputState () {
        var newList = []
        var arr = this.$route.query.dataList
        // console.log('arr:::' + JSON.stringify(arr))
        var curActiveDns, curBackupDns, curEnable, curGateway, curStartSchema, curSubnet
        for (var i in arr) {
          curActiveDns = arr[i].ActiveDns
          curBackupDns = arr[i].BackupDns
          curEnable = arr[i].Enable
          curGateway = arr[i].Gateway
          curStartSchema = arr[i].StartSchema
          curSubnet = arr[i].Subnet
          if (this.activeDnsState === 1) { curActiveDns = this.formValidate.dns01 }
          if (this.backupDnsState === 1) { curBackupDns = this.formValidate.dns02 }
          if (this.gatewayState === 1) { curGateway = this.formValidate.gateway }
          if (this.subnetState === 1) { curSubnet = this.formValidate.subnet }
          if (this.enableState === 1) { curEnable = this.currEnable }
          if (this.startSchemaState === 1) { curStartSchema = this.formValidate.project }
          newList.push({
            ActiveDns: curActiveDns,
            BackupDns: curBackupDns,
            Enable: curEnable,
            Gateway: curGateway,
            Id: arr[i].Id,
            StartSchema: curStartSchema,
            Subnet: curSubnet
          })
        }
        this.dataList = newList
        console.log('newData: ' + JSON.stringify(this.dataList))
      },
      handleSubmitBatchEdit (name) {
        this.handleCheckInputState()
        batchEditClient(this.dataList).then((res) => {
          this.handleJsonVaild(res)
        }, () => {
          this.$Message.error('请求出错，请稍后再试')
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
  .ivu-input-wrapper{ float:left;}
  .text{ float: left; margin-left: 10px; color: #666;}
  .buttonList{margin-left: 100px;}
</style>

