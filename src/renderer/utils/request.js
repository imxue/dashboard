import axios from 'axios'
// import router from '../router'
// // import qs from 'qs'
import store from '../store/index'
import { login } from '../api/login'
let result = JSON.parse(localStorage.getItem('connectNet')) || { ip: '10.88.66.71', port: 12880 }
let ip = result.ip
let port = result.port
const service = axios.create({
  baseURL: `http://${ip}:${port}`,
  // baseURL: 'http://10.88.66.71:12880',
  timeout: 60000 // request timeout
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
    if (error.request && error.request.status === 401) {
      if (store.state.app.barinfo) {
        login(store.state.app.barinfo.bar_id).then(resp => {
          localStorage.setItem('token', resp.token)
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
