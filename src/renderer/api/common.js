import request from '@/utils/request'
export function setValue (info) {
  let data = {
    'key': info.key,
    'value': {
      'key': info.key,
      'value': info.value
    }
  }
  return request({
    url: `/v1/customconfig/setValue`, // search?gameType=1&offset=0&limit=10
    method: 'post',
    data
  })
}

export function getMasterIp () {
  return request({
    url: `/v1/customconfig/getValue?key=master`, // search?gameType=1&offset=0&limit=10
    method: 'get'
  })
}

export function getSafeStrategy () {
  return request({
    url: `/v1/safedefend/getall`, // search?gameType=1&offset=0&limit=10
    method: 'get'
  })
}

export function addSafeStrategy (data) {
  return request({
    url: `/v1/safedefend/add`, // search?gameType=1&offset=0&limit=10
    method: 'post',
    data
  })
}

export function getSafeStrategybyId (data, type = 0) {
  return request({
    url: `/v1/safedefend/getDefendItemDetail?itemcode=${data.item_code}&type=${type}`, // search?gameType=1&offset=0&limit=10
    method: 'get',
    data
  })
}

export function saveSafeStrategybyId (data) {
  return request({
    url: `/v1/safedefend/edit`,
    method: 'post',
    data
  })
}

export function deleteSafeStrategybyId (id) {
  return request({
    url: `/v1/safedefend/${id}`,
    method: 'DELETE'
  })
}
export function enableSafeStrategy (data) {
  return request({
    url: `/v1/safedefend/enable`,
    method: 'POST',
    data
  })
}
export function disableSafeStrategy (data) {
  return request({
    url: `/v1/safedefend/disable`,
    method: 'POST',
    data
  })
}

export function deleteSafeStrategy (data) {
  return request({
    url: `/v1/safedefend/${data}`,
    method: 'Delete'
  })
}

export function autobind (data) {
  return request({
    url: `/v1/safedefend/autobind`,
    method: 'post',
    data
  })
}

export function defaultparam () {
  return request({
    url: `/v1/safedefend/defaultparam`,
    method: 'post'
  })
}

// export function getUpdate (ip) {
//   return request({
//     baseURL: `http://10.88.66.158:88/update.json`,
//     method: 'get'
//   })
// }
/**
 * 获取更新地址
 */

export function getUpdate (barid) {
  return request({
    url: `/v1/sysbase/getUpgradeUrl?barid=${barid}`,
    method: 'get'

  })
}
