<template>
  <div class="main">
    <Form
      ref="clientTemplate"
      :model="clientTemplate"
      label-position="left"
      :label-width="90"
      :rules="ruleValidate"
    >
      <FormItem label="机器名前缀" prop="prefix">
        <Input v-model="clientTemplate.prefix"/>
      </FormItem>
      <FormItem label="编号长度" prop="numbetLength">
        <Input v-model="clientTemplate.numbetLength"/>
      </FormItem>
      <FormItem label="起始编号" prop="numberBegin">
        <Input v-model="clientTemplate.numberBegin"/>
      </FormItem>
      <FormItem label="起始IP" prop="ipBegin">
        <Input v-model="clientTemplate.ipBegin"/>
      </FormItem>

      <FormItem label="添加方式" prop="addMode">
        <Select v-model="clientTemplate.addMode" style="width:200px">
          <Option value="disable">禁用客户机添加</Option>
          <Option value="inputNumber">输入编号添加</Option>
          <Option value="inputEnter">回车添加</Option>
        </Select>
      </FormItem>

      <FormItem label="pc分组" prop="pcGp">
        <Input v-model="clientTemplate.pcGp"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('clientTemplate')">应用</Button>
        <Button @click="handleReset('clientTemplate')" style="margin-left: 8px">Reset</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import {
  editDHCPConfigx,
  getPcConfig,
  getPcGroup,
  getDHCPConfig
} from '@/api/wupan'
export default {
  data () {
    return {
      showPopup: false,
      clientTemplate: {
        prefix: '',
        numbetLength: '',
        numberBegin: '',
        ipBegin: '',
        addMode: '',
        pcGp: ''
      },
      ruleValidate: {
        prefix: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        numbetLength: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        numberBegin: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        ipBegin: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        addMode: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        pcGp: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ]
      },
      clientTable: [
        {
          title: '机器名前缀',
          key: 'prefix'
        },
        {
          title: '编号长度',
          key: 'numbetLength'
        },
        {
          title: '起始编号',
          key: 'numberBegin'
        },
        {
          title: '起始IP',
          key: 'ipBegin'
        },
        {
          title: '客户机添加方式 ',
          key: 'addMode'
        },
        {
          title: 'pc分组',
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
      let that = this
      that.$refs[name].validate(valid => {
        if (valid) {
          editDHCPConfigx(that.clientTemplate, localStorage.getItem('masterip'))
            .then(e => {
              that.$Message.success('DPCP设置成功')
            })
            .catch(() => {
              that.$Message.error('网络出问题了')
            })
        } else {
        }
      })
    },
    handleGetPcConf (mac) {
      getPcConfig(mac)
      getPcGroup()
    },
    getDHCP (ip) {
      getDHCPConfig(ip).then(resp => {
        if (resp.data.error === null) {
          this.clientTemplate = resp.data.result
        } else {
          this.$Message.error(resp.data.error)
        }
      })
    }
  },
  created () {
    let ip = localStorage.getItem('masterip')
    this.getDHCP(ip)
  }
}
</script>

<style scoped>
.main {
  display: flex;
  justify-content: flex-start;
}
</style>
