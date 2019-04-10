import request from '@/utils/request'

// export function loginByUsername (username, password) {
//   const data = {
//     username,
//     password
//   }
//   return request({
//     url: '/login/login',
//     method: 'post',
//     data
//   })
// }
function makeRequestx (method, param, ip) {
  const data = {
    method: method,
    params: [
      param
    ]
  }
  return request({
    url: `http://${ip}:13302/jsonrpc`,
    method: 'post',
    data
  })
}

export function setClienConf ({ list }, ip) {
  return makeRequestx('Set_PcConf', { list }, ip)
}

export function getClientList (query) {
  return request({
    url: '/v1/client/queryAll' + query,
    method: 'get'
  })
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
    method: 'post',
    data
  })
}
