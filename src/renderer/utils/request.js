import axios from 'axios'
import qs from 'qs'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: 'http://10.88.66.153:8080',
  // baseURL: 'http://142.10.179.220:13302/jsonrpc',
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 30000 // request timeout

})

service.interceptors.request.use(

  // (request) => {
  //   console.log(request)
  //   let x = request.url.indexOf('startHttpRequest')
  //   if (x === -1) {
  //     return request
  //   }
  //   let data = qs.parse(request.data)
  //   console.log(typeof data)
  //   request.data.method = 'POST'
  //   request.data.param = data
  //   return request
  // },
  (error) => {
    console.log('===')
    console.log(error)
    console.log('===')
    return error
  }
)

// response interceptor
service.interceptors.response.use(
  response => { return response },

  error => {
    return Promise.reject(error)
  }
)

export default service
