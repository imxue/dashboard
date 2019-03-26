<template>
  <div>
    <div class="topItem">
      <Row>
        <i-col span="12"><span style="float:left;" >搜索路径:</span><Input class="topColumn" search enter-button="开始搜索" placeholder="请选择搜索的目录..." clearable style="width: 300px; float:left;" /></i-col>
        <i-col span="6">匹配中心游戏个数 1</i-col>
      </Row>
    </div>
    <!-- table -->
    <div class="mainCenter">
            <!-- <Select v-model="model1"  class="topColumn" style="width:150px;">
              <Option v-for="item in gameList" :value="item.value" :key="item.value" placeholder="全部游戏类型">{{ item.label }}</Option>
            </Select> -->
      <Form ref="formValidate" :model="formValidate">
        <FormItem label="">
          <Table border ref="selection" :columns="tableColumns" :data="tableData"  @on-selection-change="handleCheckBox"></Table>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">添加</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">返回</Button>
        </FormItem>
      </Form>
    </div>
    
  </div>
</template>

<script>
  export default {
    name: 'subtype3-2-add',
    data () {
      return {
        formValidate: {},
        getCheckboxVal: [], // 勾选复选框值
        tableSelectVal: [],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: '游戏路径', key: 'path' },
          { title: '执行文件', key: 'file' },
          { title: '游戏名称', key: 'name' },
          { title: '中心游戏ID', key: 'gameId' },
          { title: '游戏类型', key: 'type' },
          { title: '匹配度', key: 'match' }
        ],
        tableData: [
          { id: 0, path: 'D:单机游戏愤怒的小鸟', file: 'E', name: '愤怒的小鸟', gameId: 111, type: '单机游戏', match: '完全匹配' },
          { id: 1, path: 'D:单机游戏愤怒的小鸟', file: 'E', name: '愤怒的小鸟', gameId: 111, type: '单机游戏', match: '完全匹配' },
          { id: 2, path: 'D:怒的小鸟', file: 'E', name: '愤怒的小鸟', gameId: 111, type: '单机游戏', match: '完全匹配' },
          { id: 3, path: 'D:愤怒的小鸟', file: 'E', name: '愤怒的小鸟', gameId: 111, type: '单机游戏', match: '完全匹配' }
        ]
      }
    },
    created () {
      // console.log(this.$route.matched[0])
      console.log('this.$route.query.id= ' + this.$route.query.id)
      // this.test()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
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
        if (this.getCheckboxVal.length === 0) {
          this.$Message.error('请至少选择列表中的一项')
        } else {
          alert('需移除ID:' + JSON.stringify(this.getCheckboxVal))
        }
        // var self = this
        // this.$refs[name].validate((valid) => {
        //   if (valid) {
        //     this.$store.dispatch(types.SETTING_TEMPLATE, {
        //       id: encodeURIComponent(self.$route.query.from),
        //       gameMode: parseInt(this.formValidate.gameTempalte)
        //     }).then(() => {
        //       this.$Message.success('提交成功!')
        //       self.$router.push('Main')
        //     }, (a) => {
        //       alert(a)
        //     })
        //   } else {
        //     this.$Message.error('表单验证失败!')
        //   }
        // })
      },
      handleReset (name) {
        this.getCheckboxVal = []
        this.$refs[name].resetFields()
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
  .ivu-input-icon{right:55px;}
</style>

