import request from '@/utils/request'

export function login (id) {
  const data = {
    'barid': id
  }
  return request({
    url: '/v1/bar/login',
    method: 'post',
    data
  })
}

export function netbarRegister (id, password) {
  const data = {
    barid: id,
    password: password
  }
  return request({
    url: '/v1/bar/regist',
    method: 'post',
    data
  })
}

export function resetPassword (confirmPassword, newPassword) {
  const data = {
    ConfirmPassword: confirmPassword,
    NewPassword: newPassword
  }
  return request({
    url: '/console/resetPassword',
    method: 'post',
    data
  })
}

export function logout () {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo (token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

/**
 * 获取网吧信息
*/

export function getNetCafe () {
  return request({
    url: '/v1/bar/getBarInfo',
    method: 'get'
  })
}
