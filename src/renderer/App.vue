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
  /* CSS */
  .topItem{ height: 60px;line-height: 32px;}
  .topColumn{ float:left; margin-right:10px;}
  .modalBox .ivu-modal-footer{ display: none !important;}
</style>
