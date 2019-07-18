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
