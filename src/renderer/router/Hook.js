import router from '../router'

router.beforeEach((to, from, next) => {
  debugger
  console.log(to.path)
  next()
})
