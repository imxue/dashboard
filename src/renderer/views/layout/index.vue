<template>
  <div class="layout">
    <div class="navbar">
      <Navbar></Navbar>
    </div>
   
      <div class="wrapper">
        <Col  class="siderbar" style="background:#fff" :xxl="{ span: 4, offset: 0 }" :xl="{ span: 4, offset: 0 }" :lg="{span: 4, offset: 0 }"	:md="{ span: 4, offset: 0 }" :xs='{span:4,offset: 0}'>
          <Sidebar ref="test" ></Sidebar>
        </Col>
         <Col  class="main" >
            <Breadcrumb :style="{margin: '10px 10px'}">
              <template v-for="item  in levelList" >
                <BreadcrumbItem :key="item.path">
                <router-link :to="item.path">
                   {{$t(item.meta.title)}}
                </router-link>
                </BreadcrumbItem>
              </template>
            </Breadcrumb>
          <div class="mainWrapper" >
              <Card dis-hover :style="{margin: '0 10px'}" ref="mainWrapper">
                <AppMain></AppMain>
            </Card>
          </div>
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
      requestAnimationFrame(this.setHeight)
      window.addEventListener('resize', () => {
        requestAnimationFrame(this.setHeight)
      })
    },
    methods: {
      setHeight () {
        this.$refs.test.$el.style.height = (document.body.clientHeight - 60) + 'px'
        this.$refs.mainWrapper.$el.style.height = (document.body.clientHeight - 122) + 'px'
      },
      getBreadcrumb () {
        let matched = this.$route.matched.filter(item => item.name)
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
    width: 100%;
    background: #f5f7f9;
  }
  .navbar{
    width: 100%;
    position: fixed;
    z-index: 1030;
  }
  .wrapper {
    position: relative;
    top: 60px;
  }
  .siderbar{
    position: fixed;
    top: 60px;
    z-index: 1030;
    bottom: 0;
    overflow-y: scroll; 
    width: 180px;
  }
  .siderbar::-webkit-scrollbar{
    display: none; 
  }
  .main{
    position: relative;
    margin-left: 180px;
    background: #f5f7f9;
    height: calc(100vh - 60px);
  }
  .mainWrapper {
    overflow: auto;
    /* height: calc(100vh - 122px); */
  }
</style>


