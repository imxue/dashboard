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
/**
 * 分配游戏
 * @param {*} id
 */
export function distributeGame (info) {
  const data = info
  return request({
    url: '/v1/servergame/allocateGame',
    method: 'post',
    data
  })
}
/**
 * 取消分配游戏
 * @param {*} id
 */
export function canceldistributeGame (id) {
  const data = {
    servergameids: id
  }
  return request({
    url: '/v1/servergame/unallocateGame',
    method: 'post',
    data
  })
}
/**
 * 添加同步任务
 * @param {*} id
 */
export function syncGame (id) { // 添加同步任务
  const data = {
    'servergameids': id
  }
  return request({
    url: '/v1/syncgame/syncGames',
    method: 'post',
    data
  })
}
/**
 *  开始同步任务
 * @param {*} id
 */
export function multiAddSyncTask (id) {
  const data = {
    'taskids': id
  }
  return request({
    url: '/v1/synctask/startSyncGameTasks',
    method: 'post',
    data
  })
}
/**
 *  暂停同步任务
 * @param {*} id
 */
export function stopSyncGameTask (id) {
  const data = {
    'taskids': id
  }
  return request({
    url: '/v1/synctask/startSyncGameTasks',
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

export function getPolicys () { // 策略
  return request({
    url: '/v1/server_game_sync/policys',
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
/**
 * 删除同步任务
 * @param {*} id
 */
export function deleteSyncQueue (id) { // 删除同步任务
  const data = {
    'taskids': id
  }
  return request({
    url: 'v1/synctask/delSyncGameTasks',
    method: 'post',
    data
  })
}

/**
 * 获取同步任务
 */
export function getSyncQueue (info) {
  return request({
    url: `/v1/gamesync/getAllSyncTask?offset=${info.offset}&limit=${info.limit}`,
    method: 'get'
  })
}

/**
 * 设置数据扩展盘
 */
export function setDiskAttribute (info) {
  const data = {
    'server_ip': info.ip,
    'device_path': info.devicePath,
    'disk_type': 1,
    'extend_disk_type': info.extend,
    'disk_symbol': info.disk
  }
  return request({
    url: `/v1/serverdisk/setDiskAttribute`,
    method: 'post',
    data
  })
}
/**
 * 获取所有同步任务
 */
export function getAllSyncGameTasks (info) {
  return request({
    url: `/v1/synctask/getAllSyncGameTasks?offset=${info.offset}&limit=${info.limit}`,
    method: 'get'
  })
}

/**
 * 获取服务器列表
 */

export function getAllServers () {
  return request({
    url: `/v1/server/getAllServers`,
    method: 'get'
  })
}
/**
 * 获取服务器磁盘
 */

export function getAllServerDisks (ip) {
  return request({
    url: `/v1/server/getAllServerDisks?serverip=${ip}`,
    method: 'get'
  })
}
/**
 * 获取全部中心游戏
 */

export function getAllServerGamesByIp (info) {
  return request({
    url: `/v1/servergame/getAllServerGames?offset=${info.offset}&limit=${info.limit}&orderby=${info.orderby}&serverdiskid=${info.serverdiskid || ''}&serverip=${info.serverip}&gametype=${info.gametype || ''}&firstletter=${info.letter || ''}`,
    method: 'get'
  })
}
/**
 * 获取同步日志
 */

export function getAllSyncGameLogs (info) {
  return request({
    url: `/v1/synctask/getAllSyncGameLogs?offset=${info.offset}&limit=${info.limit}`,
    method: 'get'
  })
}
