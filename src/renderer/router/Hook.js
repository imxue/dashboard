import router from '../router'
// import store from '../store'
router.beforeEach((to, from, next) => {
  // console.log(store.state.user.Netcafe)
  // console.log(to)
  console.log(to.path)
  next()
})
