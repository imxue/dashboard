import request from '@/utils/request'

export function getLocalGame (query) { // 已下载游戏
  return request({
    url: '/v1/local_game/search' + query,
    method: 'get'
  })
}
export function localMultiSync (id) { // 已下载批量同步
  const data = {
    'Ids': id
  }
  return request({
    url: '/v1/local_game/multiSync',
    method: 'post',
    data
  })
}
export function localMultiDelete (id) { // 已下载批量删除
  const data = {
    'Ids': id,
    'IsDeleteFile': true
  }
  return request({
    url: '/v1/local_game/multiDelete',
    method: 'post',
    data
  })
}
export function localEdit (clientStartPath, isAutoUpdate, localId, runExe, serverSavePath, starterScheme) { // 已下载编辑
  const data = {
    ClientStartPath: clientStartPath,
    IsAutoUpdate: isAutoUpdate,
    LocalId: localId,
    RunExe: runExe,
    ServerSavePath: serverSavePath,
    StarterScheme: starterScheme
  }
  return request({
    url: '/v1/local_game/edit',
    method: 'post',
    data
  })
}
/**
 * 添加游戏同步人物
 * @param {*} id
 */
export function netbarMultiSync (id) { // 本吧批量同步
  const data = {
    servergameid: id
  }
  return request({
    url: '/v1/syncgame/syncGame',
    method: 'post',
    data
  })
}
export function netbarMultiDelete (id, isDeleteFile) { // 本吧批量删除
  const data = {
    Ids: id,
    IsDeleteFile: isDeleteFile
  }
  return request({
    url: '/v1/netbar/multiDelete',
    method: 'post',
    data
  })
}
// export function uploadIcon (id, isDeleteFile) { // 本吧批量删除
//   const data = {
//     Ids: id,
//     IsDeleteFile: isDeleteFile
//   }
//   return request({
//     url: '/v1/netbar/upload',
//     method: 'post',
//     data
//   })
// }
// 本吧批量编辑

export function netbarAdd (name, icondata, path, exepath, exename, isEnableSync) { // 本吧批量添加
  const data = {
    name,
    icondata,
    path,
    exepath,
    exename,
    is_enable_sync: isEnableSync
  }
  return request({
    url: 'v1/localresource/addLocalGame',
    method: 'post',
    data
  })
}

/**
 * 获取全部游戏
 */
export function getAllGame (offset, limit, orderby) { // 本吧批量添加
  const data = {
    offset,
    limit,
    orderby
  }
  return request({
    url: `/v1/centerresource/getAllCenterGames?offset=${data.offset}&limit=${data.limit}&orderby=${data.orderby}`,
    method: 'get',
    data
  })
}
/**
 * 获取盘符
 */
export function getLogicalDrives () { // 本吧批量添加
  return request({
    url: '/v1/sysbase/getLogicalDrives',
    method: 'get'
  })
}

/*
获取游戏队列
*/

export function getLoad (offset, limit, orderby) {
  const data = {
    offset,
    limit,
    orderby
  }
  return request({
    url: `/v1/centerresource/getDownloadProgress?offset=${data.offset}&limit=${data.limit}&orderby=${data.orderby}`,
    method: 'get',
    data
  })
}

/**
 * 获取今日更新游戏

*/

export function getTodayUpdateGames (offset, limit, orderby) {
  const data = { offset, limit, orderby }
  return request({
    url: `/v1/centerresource/getTodayUpdateGames?offset=${data.offset}&limit=${data.limit}&orderby=${data.orderby}`,
    method: 'get',
    data
  })
}

/**
 * 获取所有本地游戏

*/

export function getAllLocalGames (offset, limit, orderby) {
  const data = {
    offset,
    limit,
    orderby
  }
  return request({
    url: `/v1/localresource/getAllLocalGames?offset=${data.offset}&limit=${data.limit}&orderby=${data.orderby}`,
    method: 'get',
    data
  })
}

/**
 * 获取已下载游戏

*/

export function getDownloadedGames (offset, limit, orderby) {
  const data = {
    offset,
    limit,
    orderby
  }
  return request({
    url: `/v1/localresource/getDownloadedGames?offset=${data.offset}&limit=${data.limit}&orderby=${data.orderby}`,
    method: 'get',
    data
  })
}

/**
 * 添加本地游戏

*/
export function addLocalGame ({ name, path, exepath, exename, isEnableSync }, icondata) {
  const data = {
    name,
    'icon_data': icondata,
    'local_path': path,
    'run_path': exepath,
    'run_exe': exename,
    isEnableSync
  }
  return request({
    url: `/v1/localresource/addLocalGame`,
    method: 'post',
    data
  })
}

export function editLocalGame ({ Name, SavePath, RunPath, RunExe, IsEnableSync }, icondata, id) {
  const data = {
    id: id,
    name: Name,
    icon_data: icondata,
    local_path: SavePath,
    run_path: RunPath,
    run_exe: RunExe,
    is_enable_sync: IsEnableSync
  }
  return request({
    url: `/v1/localresource/editLocalGame`,
    method: 'post',
    data
  })
}

/**
 * 删除本地游戏

*/
export function deleteLocalGame (Id) {
  const data = { Id }
  return request({
    url: `/v1/localresource/${data.Id}`,
    method: 'delete',
    data
  })
}
/**
 * 获取停服资源

*/
export function getShelvedGames (offset, limit, orderby) {
  const data = {
    offset,
    limit,
    orderby
  }
  return request({
    url: `/v1/centerresource/getShelvedGames?offset=${data.offset}&limit=${data.limit}&orderby=${data.orderby}`,
    method: 'get',
    data
  })
}
/**
 * 下载游戏
 */

export function downloadGame (CenterGameId, DiskSymbol) {
  const data = {
    centergameid: CenterGameId,
    disksymbol: DiskSymbol
  }
  return request({
    url: `/v1/centerresource/downloadGame`,
    method: 'post',
    data
  })
}
/*
* 修复游戏
*/
export function repairGame (id) {
  const data = {
    centergameid: id
  }
  return request({
    url: `/v1/centerresource/repairGame`,
    method: 'POST',
    data
  })
}
/*
* 删除中心游戏
*/
export function deleteGame (id) {
  const data = {
    centergameid: id,
    confirmdeletegame: true
  }
  return request({
    url: `/v1/centerresource/deleteGame`,
    method: 'POST',
    data
  })
}
/**
 * 日志下载
 */

export function getDownloadLogs (offset, limit, SearchDate) {
  const data = {
    offset,
    limit,
    SearchDate
  }
  return request({
    url: `/v1/centerresource/getDownloadLogs?offset=${data.offset}&limit=${data.limit}SearchDate=${data.SearchDate}`,
    method: 'get',
    data
  })
}
