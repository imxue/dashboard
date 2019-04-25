<template>
  <div>
    type2 -> subtype2-3
  </div>
</template>

<script>
  export default {
    name: 'subType2-3',
    data () {
      return {
      }
    },
    created () {
      // console.log(this.$route.matched[0])
      // console.log('hello', JSON.stringify(this.routes))
      // this.test()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      test () {
        let matched = this.$route.matched.filter(item => item.name)
        console.log(matched)
      }
    }
  }
</script>

<style scoped>

</style>