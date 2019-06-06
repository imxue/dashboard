import axios from 'axios'

// import qs from 'qs'

import i18n from '../locale'
import iView from 'iview'
const service = axios.create({
  baseURL: 'http://10.88.66.153:8080/',
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 20000 // request timeout

})

service.interceptors.request.use(
  (request) => {
    if (localStorage.getItem('token')) {
      request.headers['Authorization'] = localStorage.getItem('token')
    }
    let x = request.url.indexOf('startHttpRequest')
    if (x === -1) {
      return request
    } else {
      request.data.url = request.url1
      request.data.param = {
        method: request.data.method,
        params: request.data.params
      }
      request.data.method = 'POST'
      return request
    }
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
    let x
    if (response.data.ok) {
      if (response.data.data && response.data.data.error) {
        x = Number(response.data.data.error)
      }
    }
    if (x) {
      response.data.error = i18n.t(`kxLinuxErr.${x}`)
      iView.Notice.error({
        desc: response.data.error
      })
      return response
    } else {
      return response
    }
  },

  error => {
    if (error.response.status === 401) {

    }
    return Promise.reject(error)
  }
)

export default service
