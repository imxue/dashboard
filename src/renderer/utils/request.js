import axios from 'axios'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: 'http://10.30.11.6:8080',
  // baseURL: 'http://10.30.18.62:1010',
//   baseURL: 'http://10.88.66.143:13302/jsonrpc', wupan
  baseURL: 'http://10.88.66.21:8080',
  // baseURL: 'http://142.10.179.220:13302/jsonrpc',
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // request timeout

})

service.interceptors.request.use(
  // (config) => {
  //   console.log(config)
  //   return config
  // }

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
