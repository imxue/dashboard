import router from '../router'

import { getNetCafe, login } from '../api/login'
import store from '../store/index'

router.beforeEach(async (to, from, next) => {
  if (store.state.app.barinfo) {
    next()
  } else {
    getNetCafe().then(resp => {
      if (resp.data.bar_id.toString()) {
        store.dispatch('saveBarInfo', resp.data)
        login(1).then(res => {
          localStorage.getItem('token', res.token)
          router.push('/')
        }, (error) => {
          console.log(error)
        })
      } else {
        router.push('/login')
      }
    })

    if (to.path === '/login') {
      next()
    }
  }
})
