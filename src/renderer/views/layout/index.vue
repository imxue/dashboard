<template>
  <div class="layout"> 
    <header>
      <Navbar></Navbar>
    </header>
    <article>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Sidebar></Sidebar>
        </Sider>
        <Layout>
          <Content :style="{padding: '0 10px 10px'}">
            <Breadcrumb :style="{margin: '10px 0'}">
              <template v-for="item  in levelList" >                
                <BreadcrumbItem :key="item.path">
                  {{item.meta.title}}
                  <!-- <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{item.meta.title}}</span>
                  <router-link v-else :to="item.redirect||item.path">
                    {{item.meta.title}} {{ item.hidden }}
                  </router-link> -->
                </BreadcrumbItem>
              </template>
            </Breadcrumb>
            <Card dis-hover>
              <AppMain></AppMain>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </article>
    <!-- <footer>
      <FooterBar></FooterBar>
    </footer> -->
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
        // const first = matched[0]
        // if (first && first.name !== 'home') {
        //   matched = [{ path: '/home', meta: { title: '首页' } }].concat(matched)
        // }
        this.levelList = matched
        // console.log('+', this.$route.matched)
      }
    }
  }
</script>

<style scoped>
  article {
    flex: auto;
  }

  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    min-width: 1500px !important;
    
  }
</style>


