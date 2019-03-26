import request from '@/utils/request'

export function distribute (id) { // 分配
  const data = {
    DriverId: 0,
    TypeIds: id
  }
  return request({
    url: '/v1/server_game_sync/distribute',
    method: 'post',
    data
  })
}
export function cancelDistribution (id) { // 取消分配
  const data = {
    'Ids': id
  }
  return request({
    url: '/v1/server_game_sync/cancelDistribution',
    method: 'post',
    data
  })
}
export function distributeGame (id) { // 分配游戏
  const data = {
    'Ids': id
  }
  return request({
    url: '/v1/server_game_sync/distributeGame',
    method: 'post',
    data
  })
}
export function multiAddSyncTask (id) { // 添加同步任务
  const data = {
    'Ids': id
  }
  return request({
    url: '/v1/server_game_sync/multiAddSyncTask',
    method: 'post',
    data
  })
}
export function distributePolicy (driverId, id) { // 分配规则
  const data = {
    DriverId: driverId,
    TypeIds: id
  }
  return request({
    url: '/v1/server_game_sync/distributePolicy',
    method: 'post',
    data
  })
}
export function getDrivers () { // 盘符
  return request({
    url: '/v1/server_game_sync/drivers',
    method: 'get'
  })
}
export function getSearch (data) { // 服务器同步设置
  return request({
    url: '/v1/server_game_sync/search?' + data,
    method: 'get'
  })
}
export function getPolicys () { // 策略
  return request({
    url: '/v1/server_game_sync/policys',
    method: 'get'
  })
}
export function getSyncLog (query) { // 同步日志
  return request({
    url: '/v1/sync/syncLog' + query,
    method: 'get'
  })
}
export function resync (id) { // 重新同步
  const data = {
    Id: id
  }
  return request({
    url: '/v1/sync/resync',
    method: 'post',
    data
  })
}
export function getSyncQueue (query) { // 同步任务
  return request({
    url: '/v1/sync/syncQueue' + query,
    method: 'get'
  })
}

export function deleteSyncQueue (id) { // 删除同步任务
  const data = {
    'Ids': id
  }
  return request({
    url: '/v1/sync/multiDelete',
    method: 'post',
    data
  })
}

// export function deleteClient (query) {
//   return request({
//     url: '/v1/client/' + query,
//     method: 'delete'
//   })
// }
// export function changeSchema (id, startSchema) { // 移动至方案
//   const data = {
//     Id: id,
//     StartSchema: startSchema
//   }
//   return request({
//     url: '/v1/client/changeSchema',
//     method: 'post',
//     data
//   })
// }
