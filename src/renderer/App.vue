<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { getMasterIp } from './api/common'
export default {
  name: 'my-project',
  created () {
    this.getMasterip()
  },
  methods: {
    getMasterip () {
      getMasterIp().then((resp) => {
        this.$store.dispatch('saveMaster', resp.data.value || '') // 设置主服务器
      })
    }
  }

}
  </script>

<style>
  * {
    box-sizing: border-box;
  }
  html, body {
    width: 100%;
    height: 100%;
  }
  #app{
    background: #f5f7f9;
    width: 100%;
    min-height: 100vh;
    min-width: 1200px;
    max-height: 1200px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

  .topItem{ height: 60px;line-height: 32px;}
  .topColumn{ float:left; margin-right:10px;}
  .modalBox .ivu-modal-footer{ display: none !important;}
</style>
