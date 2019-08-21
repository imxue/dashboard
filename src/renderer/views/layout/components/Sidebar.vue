<template>
  <div class="nav">
    <Menu :active-name="activeName" theme="light" width="auto" :open-names="openname" ref="side_menu" class="nav">
      <template v-for="(item,index) in routes.children">
        <Submenu :name="index + ''" :key="index">
          <template slot="title">
            <Icon type="ios-keypad"></Icon>
            {{ $t(item.meta.title) }}
          </template>
          <template v-for="(subItem) in item.children" >
            <Menu-item :name="subItem.redirect||routes.path + '/' + item.path + '/' + subItem.path" v-if="!subItem.hidden"  :to="subItem.redirect||routes.path + '/' + item.path + '/' + subItem.path" :key="subItem.path">{{ $t(subItem.meta.title) }} </Menu-item>
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
      // console.log('hello', JSON.stringify(this.routes), this.$route)
      // this.test()
    },
    computed: {
      routes () {
        let matched = this.$router.options.routes.filter(item => {
          return item.path === this.$route.matched[0].path
        })
        this.openname = ['0', '1', '2', '3']
        this.$nextTick(() => {
          this.$refs.side_menu.updateOpened()
          this.$refs.side_menu.updateActiveName()
        })
        return matched[0]
      }
    },
    methods: {
      getSubItemName (itemIndex, subItemIndex) {
        return itemIndex + '-' + subItemIndex
      },
      test () {
        let matched = this.$router.options.routes.filter(item => {
          return item.path === this.$route.matched[0].path
        })
        console.log(matched)
      }
    }
  }
</script>

<style scoped>
.nav{
}
</style>
