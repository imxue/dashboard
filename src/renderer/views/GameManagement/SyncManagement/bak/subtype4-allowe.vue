<template>
  <div>
    <div class="topItem">
      <Select v-model="serverVal"  class="topColumn" style="width:150px;"  placeholder="全部服务器" >
        <Option v-for="item in serverList" :value="item.value" :key="item.value" @on-change="handleSelectServerValue(item.id)">{{ item.label }}</Option>
      </Select>
      <Select v-model="gameValue"  class="topColumn" style="width:150px;" placeholder="——全部游戏盘——">
        <Option v-for="item in gameList" :value="item.value" :key="item.value"  @on-change="handleSelectGameValue(item.id)">{{ item.label }}</Option>
      </Select>
      <Select v-model="diskValue"  class="topColumn" style="width:150px;"  placeholder="——全部盘符——">
        <Option v-for="item in diskList" :value="item.value" :key="item.value" @on-change="handleSelectDiskValue(item.id)">{{ item.label }}</Option>
      </Select>
    </div>
    <!-- table -->
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
      <FormItem>
        <Table border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="handleCheckBox"></Table>
      </FormItem>
      <FormItem class="buttonList">
          <Button type="primary" @click="handleSubmit('formValidate')">分配</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button>
      </FormItem>
      <Row style="margin-top:10px; ">
        <i-col span="4">资源：3000 &nbsp;&nbsp;&nbsp;&nbsp;已下载：1000</i-col>
        <i-col span="20"><Page :total="100"  style=" float:right;"/></i-col>
      </Row>
    </Form>
  </div>
</template>

<script>
  export default {
    name: 'subtype4-allow',
    data () {
      return {
        serverVal: '',
        gameValue: '',
        diskValue: '',
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        gameList: [
          { Id: 0, value: '热门游戏', label: '热门游戏' },
          { Id: 1, value: '网络游戏', label: '网络游戏' },
          { Id: 2, value: '单机游戏', label: '单机游戏' },
          { Id: 3, value: '休闲游戏', label: '休闲游戏' },
          { Id: 4, value: '辅助游戏', label: '辅助游戏' }
        ],
        serverList: [
          { Id: 1, value: '192.168.100.200 E（1.83 TB）', label: '192.168.100.200 E（1.83 TB）' },
          { Id: 2, value: '192.168.100.200 E（1.83 TB）', label: '192.168.100.200 E（1.83 TB）' },
          { Id: 3, value: '192.168.100.200  E（1.83 TB）', label: '192.168.100.200 E（1.83 TB）' }
        ],
        diskList: [
          { Id: 1, value: '192.168.100.200 E（1.83 TB）', label: '192.168.100.200 E（1.83 TB）' },
          { Id: 2, value: '192.168.100.200 E（1.83 TB）', label: '192.168.100.200 E（1.83 TB）' },
          { Id: 3, value: '192.168.100.200  E（1.83 TB）', label: '192.168.100.200 E（1.83 TB）' }
        ],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: '目标服务器IP', key: 'ip' },
          { title: '磁盘类型', key: 'type' },
          { title: '目标盘符', key: 'name' },
          { title: '盘符大小', key: 'size' },
          { title: '默认存放游戏', key: 'path' }
        ],
        tableData: [
          { id: 1, ip: '10.30.25.66', type: '游戏盘', path: '全部游戏', size: '10.85 GB', name: 'e:' },
          { id: 2, ip: '10.30.25.66', type: '游戏盘', path: '网络游戏', size: '10.85 GB', name: 'e:' },
          { id: 3, ip: '10.30.25.66', type: '游戏盘', path: '', size: '10.85 GB', name: 'e:' },
          { id: 4, ip: '10.30.25.66', type: '游戏盘', path: '', size: '10.85 GB', name: 'e:' }
        ]
      }
    },
    created () {
      // console.log(this.$route.matched[0])
      // console.log('hello', JSON.stringify(this.routes))
      // this.test()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleSelectServerValue (val) {
        alert(val)
      },
      handleSelectGameValue (val) {
        alert(val)
      },
      handleSelectDiskValue (val) {
        alert(val)
      },
      handleCheckBox (arr) {
        var data = arr
        var list = []
        for (var i in arr) {
          list.push(data[i].id)
        }
        this.getCheckboxVal = list.join(',')
        console.log(this.getCheckboxVal)
        return this.getCheckboxVal
      },
      handleSubmit (name) {
        var val = this.getCheckboxVal.length
        if (val !== 0) {
          this.$Message.success('表单验证成功!')
        } else {
          this.$Message.error('请至少选择一个')
        }
      },
      handleReset (name) {
        this.checkAll = true
        this.selectVal = []
        this.$refs[name].resetFields()
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
  .topItem{ height: 60px;}
  .topColumn{ float:left; margin-right:10px;}
  .ivu-input-icon{right:55px;}
</style>

