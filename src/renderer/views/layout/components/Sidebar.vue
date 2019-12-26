<template>
  <div class="nav" >
    <Menu :active-name="activeName" theme="light" width="auto" :open-names="openname" ref="side_menu" class="nav">
      <template v-for="(item,index) in routes.children">
        <Submenu :name="index + ''" :key="index">
          <template slot="title">
            <Icon type="ios-keypad"></Icon>
            {{ $t(item.meta.title) }}
          </template>
          <template v-for="(subItem) in item.children" >
           <!-- {{subItem.redirect||routes.path + '/' + item.path + '/' + subItem.path}} -->
           
            <Menu-item :name="subItem.redirect||routes.path + '/' + item.path + '/' + subItem.path" v-if="!subItem.hidden"  :to="subItem.redirect||routes.path + '/' + item.path + '/' + subItem.path" :key="subItem.path">
            <template v-if="'HardwareInformation' === subItem.meta.title && flag.length !== 0">
            <!-- <Icon type="md-warning"  class="flag"/> -->
            <Badge :count="flag.length">
            {{ $t(subItem.meta.title) }} 
            </Badge>
            </template>
             <template v-else> 
          {{ $t(subItem.meta.title) }} 
             </template>
            </Menu-item>
          </template>
        </Submenu>
      </template>
    </Menu>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        openname: ['0', '1', '2', '3'],
        activeName: ''
      }
    },
    created () {
      console.log(this.$store.state.app.HardwareInformation)
    },
    computed: {
      routes () {
        let matched = this.$router.options.routes.filter(item => {
          return item.path === this.$route.matched[0].path
        })
        this.openname = ['0', '1', '2', '3']
        this.$nextTick(() => {
          this.$refs.side_menu.updateOpened()
          this.activeName = matched[0]['redirect']
          // this.$refs.side_menu.updateActiveName()
        })
        return matched[0]
      },
      flag () {
        return this.$store.state.app.HardwareInformation
      }
    },
    methods: {
      getSubItemName (itemIndex, subItemIndex) {
        return itemIndex + '-' + subItemIndex
      }
    }
  }
</script>

<style scoped>
</style>
