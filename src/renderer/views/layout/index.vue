<template>
  <div class="layout">
    <Row>
      <Col :xxl="{ span: 24, offset: 0 }" :xl="{ span: 24, offset: 0 }" :lg="{span: 24, offset: 0 }"	:xs='{span:24,offset: 0}'>
      <Navbar></Navbar>
    </Col>
    </Row>
   
      <div class="xx">
        <Col  class="siderbar" style="background:#fff" :xxl="{ span: 4, offset: 0 }" :xl="{ span: 4, offset: 0 }" :lg="{span: 4, offset: 0 }"	:md="{ span: 4, offset: 0 }" :xs='{span:4,offset: 0}'>
          <Sidebar ></Sidebar>
        </Col>
        <Col  class="main" :xxl="{ span: 20, offset: 4 }" :xl="{ span: 20, offset: 4 }" :lg="{span: 20, offset: 4 }"	:md="{ span: 20, offset: 4 }" :xs='{span:20,offset: 4}'>

            <Breadcrumb :style="{margin: '10px 10px'}">
              <template v-for="item  in levelList" >
                <BreadcrumbItem :key="item.path">
                <router-link :to="item.path">
                   {{$t(item.meta.title)}}
                </router-link>
                </BreadcrumbItem>
              </template>
            </Breadcrumb>
            <!-- <Card dis-hover :style="{margin: '0 10px',minHeight: '800px'}"> -->
              <Card dis-hover :style="{margin: '0 10px'}">
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
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f7f9;
  }
  .xx {
    display: flex;
    flex-grow:1; 
  }
  .siderbar{
    position: absolute;
    top:60px;
    bottom: 0;
  }
  .main{
    position: absolute;
  }
</style>


