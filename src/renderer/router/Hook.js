import router from '../router'
import alert from '../utils/alert'
// import { getNetCafe, login } from '../api/login'
import store from '../store/index'
import iView from 'iview'
import i18n from '../locale/index'
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach(async (to, from, next) => {
  // 获取网吧信息
  iView.Message.destroy()
  if (store.state.app.barinfo) {
    if (to.path === '/login') {
      next({ path: '/' })
    }
    next()
  } else {
    iView.Spin.show({
      render: (h) => {
        return h('div', i18n.t('getBarInfo'))
      }
    })
    if (whiteList.indexOf(to.path) !== -1) {
      iView.Spin.hide()
      next()
    } else {
      iView.Spin.hide()
      store.dispatch('GetbarInfo').then(resp => {
        next({ path: '/' })
      }).catch((e) => {
        if (!e.response) {
          alert.notifyUser('error', e.message)
        } else {
          alert.notifyUser('error', i18n.t('barinfoError'))
        }
        router.push('/login')
      })
    }
  }
})
