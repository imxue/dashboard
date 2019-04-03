<template>
    <div class="main">
       
      
  
     <Form ref="clientTemplate" :model="clientTemplate" label-position="left" :label-width="90" :rules="ruleValidate" >
         <FormItem  label="机器名前缀" prop="prefix">
            <Input v-model="clientTemplate.prefix"></Input>
        </FormItem>
        <FormItem label="编号长度" prop="numbetLength">
            <Input  v-model="clientTemplate.numbetLength"></Input>
        </FormItem>
        <FormItem label="起始编号" prop="numberBegin">
            <Input  v-model="clientTemplate.numberBegin"></Input>
        </FormItem>
           <FormItem label="起始IP" prop="ipBegin">
            <Input  v-model="clientTemplate.ipBegin"></Input>
        </FormItem>
         </FormItem>
           <FormItem label="添加方式" prop="addMode">
                  <Select v-model="clientTemplate.addMode" style="width:200px">
        <Option value="disable">禁用客户机添加</Option>
        <Option value="inputNumber">输入编号添加</Option>
        <Option value="inputEnter">回车添加</Option>
    </Select>
        </FormItem>
        </FormItem>
           <FormItem label="pc分组" prop="pcGp">
            <Input  v-model="clientTemplate.pcGp"></Input>
        </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('clientTemplate')">应用</Button>
            <Button @click="handleReset('clientTemplate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
     </Form>
 
    </div>
</template>
<script>

import { editDHCPConfig, getPcConfig, getPcGroup } from '@/api/wupan'
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
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        numbetLength: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        numberBegin: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        ipBegin: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        addMode: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        pcGp: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
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
      ],
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ]

    }
  },
  methods: {
    handUp () {
      this.showPopup = true
    },
    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          editDHCPConfig(this.clientTemplate)
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleGetPcConf (mac) {
      getPcConfig(mac)
    }
  },
  created: {
    handleGetPcGroup () {
      getPcGroup().then(() => {

      })
    }

  }

}
</script>

<style scoped>
.main{
    display: flex;
    justify-content: flex-start;
}
</style>
