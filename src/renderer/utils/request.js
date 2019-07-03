import axios from 'axios'
import router from '../router'
// import qs from 'qs'
import i18n from '../locale'
import iView from 'iview'
const service = axios.create({
  // baseURL: 'http://10.88.66.153:8080/',
  baseURL: 'http://10.88.66.71:8080',
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 20000 // request timeout

})
service.interceptors.request.use(
  (request) => {
    if (localStorage.getItem('token')) {
      request.headers['Authorization'] = localStorage.getItem('token')
    }

    // 转发 无盘
    if (request.url.includes('startHttpRequest')) {
      request.data.url = request.url1
      request.data.param = {
        ...request.data
      }
      request.data.method = 'POST'
      delete request.url1
      delete request.data.params
      return request
    }
    return request
  },

  (error) => {
    return error
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.data.ok) {
      if (response.data.data && response.data.data.error) {
        return Promise.reject(response.data.data.error)
      }
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(response)
    }
  },

  error => {
    if (error.response.status === 401) {
      iView.Notice.info({
        desc: i18n.t('loginTmeOut'),
        duration: 3
      })
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default service
