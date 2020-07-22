<template>
  <div id="app">
    <router-view></router-view>
    <div class="footerbar">

     <div v-if="barinfo">
        <span>{{$t('BarId')}} : {{barinfo.bar_id}}</span>
        <span>{{$t('OnlineTerminal')}} / {{$t('AllTerminal')}}: {{barinfo.online_client_count}} / {{barinfo.client_count}}</span>
        <span>{{$t('AuthorizationIsValidUntil')}}: {{handleExpireTime(barinfo.expire_time)}}</span>
      </div>

      <div v-if="propraminfo">
      <span>{{$t('softVer')}}: {{propraminfo.Version || '-'}}</span>
      </div>
      <div v-else>
        <span>{{$t('NoUpdate')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'my-project',
  computed: {
    barinfo () {
      return this.$store.state.app.barinfo
    },
    propraminfo () {
      return this.$store.state.app.propraminfo
    }
  },
  methods: {
    handleExpireTime (time) {
      let date = new Date(time)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      return `${year} / ${month} / ${day}`
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

/* .ive-table-tip {
  overflow: hidden !important;
} */
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
.ivu-modal-mask  {
  z-index: 1082 !important;
}
.ivu-modal-wrap {
 z-index: 9999 !important;
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
.footerbar {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 8px;
  background: #515a6e;
  z-index: 999999999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #CCD1D1;
}
.footerbar  span{
  padding-left:10px;
}

*::-webkit-scrollbar {
  height:10px;
  width:10px;
}
*::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 6px;
}
*::-webkit-scrollbar-thumb:hover {
    background-color: #777;
}
*::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px #ccc;
    /* border-radius: 10px; */
}
.ivu-icon  {
  font-size: 18px !important;
  vertical-align: sub !important;
}
.ggggg .ivu-table-wrapper  {
  overflow: visible !important;
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
