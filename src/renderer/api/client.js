import request from '@/utils/request'

function makeRequestx (method, param, ip) {
  const data = {
    method: method,
    params: [
      param
    ]
  }
  return request({
    // Forwardflag: true,
    url: `/v1/sysbase/startHttpRequest`,
    url1: `http://${ip}:13302/jsonrpc`,
    method: 'post',
    data
  })
}
/**
 * 设置客户机属性
 * @param {*} param0
 * @param {*} ip
 */
export function setClienConf ({ list }, ip) {
  return makeRequestx('Set_PcConf', { list }, ip)
}

export function getClientList (query) {
  return request({
    url: '/v1/client/queryAll' + query,
    method: 'get'
  })
}

export function setSuper (data, ip) {
  return makeRequestx('Set_SupIp', data, ip)
}

export function setCancelSuper (data, ip) {
  return makeRequestx('Del_SupIp', data, ip)
}

export function getSuper (ip) {
  return makeRequestx('Get_SupIp', {}, ip)
}

export function editClient (activeDns, backupDns, enable, gateway, id, ip, mac, startSchema, subnet) {
  const data = {
    ActiveDns: activeDns,
    BackupDns: backupDns,
    Enable: enable,
    Gateway: gateway,
    Id: id,
    Ip: ip,
    Mac: mac,
    StartSchema: startSchema,
    Subnet: subnet
  }
  return request({
    url: '/v1/client/edit',
    method: 'post',
    data
  })
}
export function batchEditClient (dataList) {
  const data = {
    Pcs: dataList
  }
  // const data = 'Pcs:' + [{
  //   ActiveDns: activeDns,
  //   BackupDns: backupDns,
  //   Enable: enable,
  //   Gateway: gateway,
  //   Id: id,
  //   StartSchema: startSchema,
  //   Subnet: subnet
  // }]
  return request({
    url: '/v1/client/multiEdit',
    method: 'post',
    data
  })
}
export function deleteClient (query) {
  return request({
    url: '/v1/client/' + query,
    method: 'delete'
  })
}
export function changeSchema (id, startSchema) { // 移动至方案
  const data = {
    Id: id,
    StartSchema: startSchema
  }
  return request({
    url: '/v1/client/changeSchema',
    method: 'POST',
    data
  })
}
export function setSchemeBasics (info) {
  const data = {
    is_display_menu: info.is_display_menu,
    is_sync_server_time: info.is_sync_server_time,
    is_hide_pallet_icon: info.is_hide_pallet_icon,
    is_single_click_startup: info.is_single_click_startup,
    is_open_game_archive: info.is_open_game_archive,
    archive_server_ip: info.archive_server_ip
  }
  return request({
    url: '/v1/scheme/setSchemeBasics',
    method: 'POST',
    data
  })
}
/**
 * 获取设置
 * */
export function getSchemeBasics () {
  return request({
    url: '/v1/scheme/getSchemeBasics',
    method: 'GET'
  })
}
/**
 * 获取客户机启动方案
 */
export function getAllScheme () {
  return request({
    url: '/v1/scheme/getAllScheme',
    method: 'GET'
  })
}
/**
 * 获取图标
 */
export function getSchemeIcon (info) {
  return request({
    url: `/v1/scheme/getSchemeIcon${info.global ? `?is_global=${info.global}` : '?'}${info.schemeId ? `scheme_id=${info.schemeId}` : ''}`,
    method: 'GET'
  })
}
/**
 * 获取批处理
 */
export function getSchemeBatch (info) {
  return request({
    url: `/v1/scheme/getSchemeBatch${info.global ? `?is_global=${info.global}` : '?'}${info.schemeId ? `scheme_id=${info.schemeId}` : ''}`,
    method: 'GET'
  })
}
/**
 * 设置批处理
 */
export function setSchemeBatch (info) {
  const data = { ...info }
  return request({
    url: `/v1/scheme/setSchemeBatch`,
    method: 'post',
    data
  })
}
/**
 * 设置方案图标
 */
export function setSchemeIcon (info) {
  const data = { ...info }
  return request({
    url: `/v1/scheme/setSchemeIcon`,
    method: 'post',
    data
  })
}
/**
 * 设置客户机
 */
export function setPcConf (data, ip) {
  return makeRequestx('Set_PcConf', { ...data }, ip)
}
/**
 *  重新启动
 */
export function restart (info) {
  let data = {
    macaddrs: info
  }
  return request({
    url: `/v1/pc/restart`,
    method: 'POST',
    data
  })
}
/**
 *  关闭
 */
export function shutdown (info) {
  let data = {
    macaddrs: info
  }
  return request({
    url: `/v1/pc/shutdown`,
    method: 'POST',
    data
  })
}

/**
 *  唤醒
 */
export function wakeup (info) {
  let data = {
    macaddrs: info
  }
  return request({
    url: `/v1/pc/wakeup`,
    method: 'POST',
    data
  })
}
/**
 *  远程
 */
export function remoteControl (info) {
  let data = {
    macaddrs: info
  }
  return request({
    url: `/v1/pc/remoteControl`,
    method: 'POST',
    data
  })
}
