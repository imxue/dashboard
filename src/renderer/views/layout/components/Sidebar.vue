<template>
  <div>
    <Menu :active-name="activeName" theme="light" width="auto" :open-names="openname" ref="side_menu">
      <template v-for="(item,index) in routes.children">
        <Submenu :name="index + ''" :key="index">
          <template slot="title">
            <Icon type="ios-keypad"></Icon>
            {{ item.meta.title }}
          </template>
          <template v-for="(subItem,subIndex) in item.children" >
            <Menu-item :name="subItem.redirect||routes.path + '/' + item.path + '/' + subItem.path" v-if="!subItem.hidden"  :to="subItem.redirect||routes.path + '/' + item.path + '/' + subItem.path" :key="subItem.path">{{ subItem.meta.title }} </Menu-item>
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
      // this.activeName = itemIndex + '-' + subItemIndex
      //  console.log(itemIndex + '-' + subItemIndex)
        return itemIndex + '-' + subItemIndex
      },
      test () {
        // console.log('1', this.$router.options.routes)
        let matched = this.$router.options.routes.filter(item => {
          return item.path === this.$route.matched[0].path
        })
        console.log(matched)
      }
    },
    watch: {
      // '$route': function (to) {
      //    console.log(to.matched[1])
      //    this.activeName = to.matched[1]
      // }
    }
  }
</script>

<style scoped>
</style>
