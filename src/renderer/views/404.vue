<template>
  <div>
    <p>页面失踪了啊啊啊</p>
    <Button type="primary" @click="handleBack">返回</Button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        lastUrlPath: ''
      }
    },
    created () {
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.lastUrlPath = from.path
      })
    },
    methods: {
      handleBack () {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>

</style>

