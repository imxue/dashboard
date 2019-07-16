<template>
  <div class="layout">
    <Row>
      <Col :xxl="{ span: 24, offset: 0 }" :xl="{ span: 24, offset: 0 }" :lg="{span: 24, offset: 0 }"	:xs='{span:24,offset: 0}'>
      <Navbar></Navbar>
    </Col>
    </Row>
   
      <div style="flex-grow:1" class="xx">
        <Col  style="background:#fff" :xxl="{ span: 4, offset: 0 }" :xl="{ span: 4, offset: 0 }" :lg="{span: 3, offset: 0 }"	:md="{ span: 3, offset: 0 }" :xs='{span:3,offset: 0}'>
          <Sidebar ></Sidebar>
        </Col>
        <Col :xxl="{ span: 20, offset: 0 }" :xl="{ span: 20, offset: 0 }" :lg="{span: 21, offset: 0 }"	:md="{ span: 21, offset: 0 }" :xs='{span:21,offset: 0}'>

            <Breadcrumb :style="{margin: '10px 10px'}">
              <template v-for="item  in levelList" >
                <BreadcrumbItem :key="item.path">
                <router-link :to="item.path">
                   {{$t(item.meta.title)}}
                </router-link>
                </BreadcrumbItem>
              </template>
            </Breadcrumb>
            <Card dis-hover :style="{margin: '0 10px',height: '90%'}">
              <AppMain></AppMain>
            </Card>
        </col>
      </div>
  </div>  

</template>

<script>
  import { Navbar, Sidebar, AppMain, FooterBar } from './components'

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
      FooterBar
    },
    data () {
      return {
        levelList: null
      }
    },
    watch: {
      $route () {
        this.getBreadcrumb()
      }
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    created () {
      this.getBreadcrumb()
    },
    methods: {
      getBreadcrumb () {
        let matched = this.$route.matched.filter(item => item.name)
        console.log(matched)
        this.levelList = matched
      }
    }
  }
</script>

<style scoped>
  .layout{
    min-width: 1190px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .xx {
    display: flex;
  }

</style>


