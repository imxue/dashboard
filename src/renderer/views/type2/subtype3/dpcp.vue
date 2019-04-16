<template>
  <div class="main">
    <Form
      ref="DHCPTable"
      :model="DHCPTable"
      label-position="left"
      :label-width="90"
      :rules="ruleValidate"
    >
      <FormItem label="机器名前缀" prop="prefix">
        <Input v-model="DHCPTable.prefix"/>
      </FormItem>
      <FormItem label="编号长度" prop="numbetLength">
        <Input v-model="DHCPTable.numbetLength"/>
      </FormItem>
      <FormItem label="起始编号" prop="numberBegin">
        <Input v-model="DHCPTable.numberBegin"/>
      </FormItem>
      <FormItem label="起始IP" prop="ipBegin">
        <Input v-model="DHCPTable.ipBegin"/>
      </FormItem>

      <FormItem label="添加方式" prop="addMode">
        <Select v-model="DHCPTable.addMode" style="width:200px">
          <Option value="disable">禁用客户机添加</Option>
          <Option value="inputNumber">输入编号添加</Option>
          <Option value="inputEnter">回车添加</Option>
        </Select>
      </FormItem>

      <FormItem label="pc分组" prop="pcGp">
        <Input v-model="DHCPTable.pcGp"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('DHCPTable')" :loading="loading">应用</Button>
        <Button @click="handleReset('DHCPTable')" style="margin-left: 8px">重置</Button>
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
      this.loading = true
      let that = this
      that.$refs[name].validate(valid => {
        if (valid) {
          editDHCPConfigx(that.DHCPTable, localStorage.getItem('masterip'))
            .then(e => {
              this.loading = false
              that.$Message.success('DPCP设置成功')
            })
            .catch(() => {
              this.loading = false
              that.$Message.error('网络出问题了')
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
      getPcGroup()
    },
    getDHCP (ip) {
      getDHCPConfig(ip).then(resp => {
        if (resp.data.error === null && resp.data.result) {
          this.DHCPTable = resp.data.result
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
