import router from '../router'

import { getNetCafe, login } from '../api/login'
import store from '../store/index'

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    next()
  }
  if (store.state.app.barinfo) {
    if (!localStorage.getItem('token')) {
      login(store.state.app.barinfo.bar_id).then(res => {
        localStorage.setItem('token', res.token)
      })
    }
    next()
  } else {
    getNetCafe().then(resp => {
      if (resp.data.bar_id.toString()) {
        store.dispatch('saveBarInfo', resp.data)
        login(1).then(res => {
          localStorage.setItem('token', res.token)
          next()
        }, (error) => {
          console.log(error)
        })
      } else {
        router.push('/login')
      }
    }, (err) => {
      console.log(err)
      router.push('/login')
    })
  }
})
