import router from '../router'
import alert from '../utils/alert'
import { getNetCafe, login } from '../api/login'
import store from '../store/index'

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    next()
    return
  }
  if (store.state.app.barinfo) {
    if (!localStorage.getItem('token')) {
      login(store.state.app.barinfo.bar_id).then(res => {
        localStorage.setItem('token', res.token)
      }, () => {
        next()
      })
    } else {
      next()
    }
  } else {
    getNetCafe().then(resp => {
      if (resp.data.bar_id.toString()) {
        store.dispatch('saveBarInfo', resp.data)
        login(resp.data.bar_id).then(res => {
          localStorage.setItem('token', res.token)
          next()
        }, (error) => {
          console.log(error)
        })
      } else {
        router.push('/login')
      }
    }, (e) => {
      alert.notifyUserOfError('barinfoError')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    })
  }
})
