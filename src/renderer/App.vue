<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'my-project'
  }
</script>

<style>
  * {
    box-sizing: border-box;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  html, body {
    height:100%;
    width: 100%;
  }
  #app{
    height: 100%;
    background: #f5f7f9;
    width: 100%;
    min-width: 1200px
  }
  
  .topItem{ height: 60px;line-height: 32px;}
  .topColumn{ float:left; margin-right:10px;}
  .modalBox .ivu-modal-footer{ display: none !important;}
</style>
