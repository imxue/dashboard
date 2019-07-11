import request from '@/utils/request'

export function getAllGame (query) {
  return request({
    url: '/v1/all_game/search' + query, // search?gameType=1&offset=0&limit=10
    method: 'get'
  })
}

export function repairGame (id) {
  const data = {
    CenterId: id // num
  }
  return request({
    url: '/v1/all_game/repair',
    method: 'post',
    data
  })
}

export function deleteGame (ids, isDeleteFile) {
  const data = {
    Ids: ids, // array
    IsDeleteFile: isDeleteFile // true or false
  }
  return request({
    url: '/v1/all_game/multiDelete',
    method: 'post',
    data
  })
}
export function downloadGame (centerId, dir) {
  const data = {
    CenterId: centerId, // num
    Dir: dir // string
  }
  return request({
    url: '/v1/all_game/download',
    method: 'post',
    data
  })
}

export function getDirList () {
  return request({
    url: '/v1/public/dirList',
    method: 'get'
  })
}

// today updata games
export function getTodayGame (query) {
  return request({
    url: '/v1/today_update/search' + query, // search?gameType=1&offset=0&limit=10
    method: 'get'
  })
}

export function repairTodayGame (id) {
  const data = {
    CenterId: id // num
  }
  return request({
    url: '/v1/today_update/repair',
    method: 'post',
    data
  })
}

export function deleteTodayGame (ids, isDeleteFile) {
  const data = {
    Ids: ids, // array
    IsDeleteFile: isDeleteFile // true or false
  }
  return request({
    url: '/v1/today_update/multiDelete',
    method: 'post',
    data
  })
}
export function downloadTodayGame (centerId, dir) {
  const data = {
    CenterId: centerId, // num
    Dir: dir // string
  }
  return request({
    url: '/v1/today_update/download',
    method: 'post',
    data
  })
}
/**
 * 获取下载游戏设置
 */
export function getDownloadSettings () {
  return request({
    url: '/v1/downloadsetting/getDownloadSettings',
    method: 'get'
  })
}
/**
 * 获取下载游戏设置
 */
export function setDownloadSettings (info) {
  const data = { ...info }
  return request({
    url: '/v1/downloadsetting/setDownloadSettings',
    method: 'post',
    data
  })
}
/**
 * 获取游戏类型
 */
export function getAllCenterGameTypes () {
  return request({
    url: '/v1/centerresource/getAllCenterGameTypes',
    method: 'get'
  })
}
