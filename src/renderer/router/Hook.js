import router from '../router'
import alert from '../utils/alert'
import { getNetCafe, login } from '../api/login'
import store from '../store/index'
import iView from 'iview'
router.beforeEach(async (to, from, next) => {
  const barinfo = store.state.app.barinfo
  if (to.path !== '/login') {
    iView.Message.destroy()
  }
  if (to.path === '/login') {
    next()
  }
  if (barinfo) {
    if (localStorage.getItem('token')) {
      next()
    } else {
      try {
        let resp = await login(Number(barinfo.bar_id))
        localStorage.setItem('token', resp.token)
        next('/')
      } catch (error) {
        alert.notifyUser('error', '获取token失败')
        router.push('/login')
      }
    }
  } else {
    try {
      // alert.notifyUser('info', '获取信息中...')
      iView.Spin.show({
        render: (h) => {
          return h('div', '获取网吧信息...')
        }
      })
      let resp = await getNetCafe()
      iView.Spin.hide()
      store.dispatch('saveBarInfo', resp.data)
      next('/')
    } catch (error) {
      iView.Spin.hide()
      alert.notifyUser('error', error)
      router.push('/login')
    }
  }
})
