import axios from 'axios'
// import qs from 'qs'
// import store from '@/store'
// import { getToken } from '@/utils/auth'
// create an axios instance
import i18n from '../../language'
import iView from 'iview'
const service = axios.create({
  baseURL: 'http://10.88.66.153:8080/',
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 20000 // request timeout

})

service.interceptors.request.use(
  // (config) => {
  //   if (localStorage.getItem('token')) {
  //     config.headers['Authorization'] = localStorage.getItem('token')
  //   }
  //   return config
  // },

  (request) => {
    if (localStorage.getItem('token')) {
      request.headers['Authorization'] = localStorage.getItem('token')
    }
    // let x = request.url.indexOf('startHttpRequest')
    // if (x === -1) {
    //   return request
    // } else {
    //   request.data.url = request.url1
    //   request.data.param = {
    //     method: request.data.method,
    //     params: request.data.params
    //   }
    //   request.data.method = 'POST'
    //   return request
    // }
    return request
  },

  (error) => {
    // console.log('请求错误===')
    // console.log(error)
    // console.log('请求结束===')
    return error
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response.data.error) {
      iView.Notice.error({
        desc: i18n.t(`kxLinuxErr.${response.data.error}`)
      })
      return response
    } else {
      return response
    }
  },

  error => {
    // 状态码不对会执行这里，并且包装成Promise的reject状态 ，在第一个then 的第二个函数执行
    return Promise.reject(error)
  }
)

export default service
