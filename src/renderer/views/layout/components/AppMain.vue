<template>
  <div style="min-height: 700px">
      <Button v-if="this.showBackBtn === true"><Icon type="ios-arrow-back" /> 返回上一页</Button>
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        showBackBtn: false,
        isRouterAlive: true,
        computed: {
          routes () {
            return this.$router.options.routes
          }
        }
      }
    },
    provide () {
      return {
        reload: this.reload
      }
    },
    methods: {
      reload () {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
    }

  }
</script>

<style>
  .ivu-table-tbody .ivu-table-row td:last-child span {cursor: pointer;}
</style>
