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
  overflow: hidden;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.ivu-table-overflowX {
  overflow-x: hidden !important;
}
.ive-table-tip {
  overflow: hidden !important;
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
.ivu-menu-item {
  font-size: 12px !important; 
}
.ivu-menu-vertical.ivu-menu-light:after {
    display: none !important;
    content: '';
    display: block;
    width: 1px;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):after {
    display: none !important;
    content: '';
    display: block;
    width: 2px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    /* background: #2d8cf0; */
}
/*     
.ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title {
    padding: 14px 10px !important;
    position: relative;
    cursor: pointer;
    z-index: 1;
    -webkit-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
} */
</style>
