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
    this.$Message.config({
      top: 80,
      duration: 8
    })
    // localStorage.setItem('connectNet', { ip: '127.0.0.1', port: 12880 })
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
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.ivu-table .demo-table-info-row td {
  background-color: #cce4f7;
}
.ivu-table td.demo-table-infox-column {
  background-color: #B3D6D4;
  color: black;
}
.topItem {
  height: 60px;
  line-height: 32px;
}
.topColumn {
  float: left;
  margin-right: 10px;
}
.modalBox .ivu-modal-footer {
  display: none !important;
}
.ivu-badge-count {
    position: relative !important;
    box-shadow: none !important;
  }
</style>
