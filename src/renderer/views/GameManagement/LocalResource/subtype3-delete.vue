<template>
  <div style="margin:50px 0 0 50px;">
    <!-- <CheckboxGroup  @on-change="checkGroupChange">
        <Checkbox v-for="item in delFileList" :label="item.value" :key="item.Id">{{item.value}}</Checkbox>
    </CheckboxGroup> -->
    <Row>
      <Checkbox v-model="isDeleteFile">删除服务器文件</Checkbox>
    </Row>
    <Row style="margin-top:20px;">
      <Button type="primary" @click="handleConfirm">确定</Button>
      <Button @click="handleCancle" style="margin-left: 8px">取消</Button>
    </Row>

  </div>
</template>

<script>
  import { netbarMultiDelete } from '@/api/localGame'
  export default {
    name: 'subType3-delete',
    data () {
      return {
        ids: [],
        isDeleteFile: false,
        delFileList: [
          { Id: 1, value: '删除服务器文件' }
        ]
      }
    },
    created () {
      console.log(this.$route.query.ids)
      this.ids = this.$route.query.ids
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleCallBackVaild (res) {
        var code = res.data.Code
        if (code === 0 || res.data.state === 'OK') {
          this.$Message.success('操作成功')
          this.$router.go(-1)
        } else {
          this.$Message.error('操作失败：' + res.data.Msg)
        }
      },
      handleConfirm () {
        netbarMultiDelete(this.ids, this.isDeleteFile).then((res) => {
          this.handleCallBackVaild(res)
        }, () => {
          this.$Message.error('请求出错，请稍后再试')
        })
      },
      handleCancle () {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>

</style>