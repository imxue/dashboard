<template>
  <div>
    <Menu active-name="0-0" theme="light" width="auto" :open-names="['0']">
      <template v-for="(item,index) in routes.children">
        <Submenu :name="index + ''" :key="index">
          <template slot="title">
            <Icon type="ios-keypad"></Icon>
            {{ item.meta.title }}
          </template>
          <template v-for="(subItem,subIndex) in item.children" v-if="!subItem.hidden">
            <Menu-item :name="getSubItemName(index, subIndex)" :to="subItem.redirect||routes.path + '/' + item.path + '/' + subItem.path" :key="subItem.path">{{ subItem.meta.title }} </Menu-item>
          </template>
        </Submenu>
      </template>
    </Menu>
  </div>
</template>

<script>
  export default {
    created () {
      // console.log('hello', JSON.stringify(this.routes), this.$route)
      // this.test()
    },
    computed: {
      routes () {
        let matched = this.$router.options.routes.filter(item => {
          return item.path === this.$route.matched[0].path
        })
        return matched[0]
      }
    },
    methods: {
      getSubItemName (itemIndex, subItemIndex) {
        return itemIndex + '-' + subItemIndex
      },
      test () {
        // console.log('1', this.$router.options.routes)
        let matched = this.$router.options.routes.filter(item => {
          return item.path === this.$route.matched[0].path
        })
        console.log(matched)
      }
    }
  }
</script>

<style scoped>
</style>
