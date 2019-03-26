import request from '@/utils/request'

export function login (password) {
  const data = {
    Password: password
  }
  return request({
    url: '/v1/console/login',
    method: 'post',
    data
  })
}

export function netbarRegister (id, password) {
  const data = {
    Id: id,
    Password: password
  }
  return request({
    url: '/console/netbarRegister',
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
