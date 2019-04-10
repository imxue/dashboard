import request from '@/utils/request'

function makeRequest (method, param) {
  const data = {
    method: method,
    params: [
      param
    ]
  }
  return request({
    // url: '/wupan',
    method: 'post',
    data
  })
}

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

// Get_ImgList 获取服务器类表
export function getServers () {
  return makeRequest('Get_Servers', {})
}

export function getServersx (ip) {
  return makeRequestx('Get_Servers', {}, ip)
}

export function login (password) {
  return makeRequest('Login', {
    rootPwd: password
  })
}

// var ControlServer_Type = {
//   vdisk: 'vdisk',
//   boot: 'boot',
//   machine: 'machine'
// }

// var ControlServer_Action = {
//   restart: 'restart',
//   start: 'start',
//   stop: 'stop'
// }

export function controllServer (controlServerType, controlServerAction) {
  return makeRequest('Ctrl_Srv', {
    action: controlServerAction,
    name: controlServerType
  })
}
export function passwordReset (oldPassword, newPassword) {
  return makeRequest('Pwd_Set', {
    oldPwd: oldPassword,
    newPwd: newPassword
  })
}

export function getDiskStatus () {
  return makeRequest('Get_DiskStatus', {
  })
}

export function getDiskStatusx (url) {
  return makeRequestx('Get_DiskStatus', {
  }, url)
}

// var DiskFunction_Type = {
//   imageDisk: 'imageDisk',
//   dataDisk: 'dataDisk',
//   writebackDisk: 'writebackDisk',
//   unUsed: 'unUsed'
// }

export function setDiskFunctionx (path, diskFunctionType, cacheSizeMB, isFormat, volume, ip) {
  return makeRequestx('Set_DiskFun', {
    path: path,
    fun: diskFunctionType,
    cacheSize: cacheSizeMB,
    isFormat: isFormat ? 'yes' : 'no',
    vol: volume
  }, ip)
}

export function getImageList () {
  return makeRequest('Get_ImgList', {
  })
}

export function createImage (name, sizeGB, title, path, cacheSizeMB, mountVolume, isImportFormMaster) {
  return makeRequest('Create_Img', {
    name: name,
    size: sizeGB,
    menuItemName: title,
    path: path,
    cacheSize: cacheSizeMB,
    mountVol: mountVolume,
    isImportFormMaster: isImportFormMaster ? 'yes' : 'no'
  })
}

export function editImage (name, title, mountVolume) {
  return makeRequest('Set_Img', {
    name: name,
    menuItemName: title,
    mountVol: mountVolume
  })
}

export function deleteImage (name) {
  return makeRequest('Delete_Img', {
    name: name
  })
}

export function createImageProject (image, projectNO, restoreNo, name, title) {
  if (restoreNo === '') {
    return makeRequest('Cre_ImgPro', {
      image: image,
      pno: projectNO,
      name: name,
      menuItemName: title
    })
  } else {
    return makeRequest('Cre_ImgPro', {
      image: image,
      pno: projectNO,
      rno: restoreNo,
      name: name,
      menuItemName: title
    })
  }
}

export function deleteImageProject (image, projectNO) {
  return makeRequest('Del_ImgPro', {
    image: image,
    pno: projectNO
  })
}

export function editImageProject (image, projectNO, name, title) {
  return makeRequest('Set_ImgPro', {
    image: image,
    pno: projectNO,
    name: name,
    menuItemName: title
  })
}

export function mergeImageProject (image, projectNO) {
  return makeRequest('Mer_ImgPor', {
    image: image,
    pno: projectNO
  })
}

export function deleteImageRestore (image, projectNO, restoreNO) {
  return makeRequest('Del_ImgBol', {
    image: image,
    pno: projectNO,
    rno: restoreNO
  })
}

export function revertImageRestore (image, projectNO, restoreNO) {
  return makeRequest('To_ImgBol', {
    image: image,
    pno: projectNO,
    rno: restoreNO
  })
}

export function editImageRestore (image, projectNO, restoreNO, comment) {
  return makeRequest('Set_ImgBol', {
    image: image,
    pno: projectNO,
    rno: restoreNO,
    comment: comment
  })
}

export function getImageRestore (image, projectNO) {
  return makeRequest('Get_ImgBol', {
    image: image,
    pno: projectNO
  })
}

export function imageMount (image, projectNO, volume) {
  return makeRequest('ImgMout', {
    image: image,
    pno: projectNO,
    vol: volume
  })
}

export function imageUnMount (image, restoreNO, isSave, volume, isSetUse, comment) {
  return makeRequest('ImgUnMout', {
    image: image,
    no: restoreNO,
    vol: volume,
    saveChange: isSave ? 'yes' : 'no',
    isSetUse: isSetUse ? 'yes' : 'no',
    comment: comment
  })
}

export function initImage (image) {
  return makeRequest('Img_InitConf', {
    image: image
  })
}

export function getImage (image) {
  return makeRequest('Get_Img', {
    image: image
  })
}

export function getNetwork () {
  return makeRequest('Get_Net', {
  })
}

export function getNetworkx (ip) {
  return makeRequestx('Get_Net', {
  }, ip)
}

// list = ['eth0', 'eth1']
// export function setVdiskEthernet (list) {
//   return makeRequest('Set_VdiskEth', {
//     list: list
//   })
// }
export function setVdiskEthernetx (list, ip) {
  return makeRequestx('Set_VdiskEth', {
    list: list
  }, ip)
}
export function getClientStatus () {
  return makeRequest('Get_CliStat', {
  })
}

export function getServerStatus () {
  return makeRequest('Get_SrvStat', {
  })
}

export function getDHCPConfig () {
  return makeRequest('Get_DhcpConf', {
  })
}

// var DHCPConfig_AddMode = {
//   disable: 'disable',
//   inputNumber: 'inputNumber',
//   inputEnter: 'inputEnter'
// }

export function editDHCPConfig ({ prefix, numbetLength, numberBegin, ipBegin, addMode, pcGp }) {
  return makeRequest('Set_DhcpConf', {
    prefix: prefix,
    numbetLength: numbetLength,
    numberBegin: numberBegin,
    ipBegin: ipBegin,
    addMode: addMode,
    pcGp: pcGp
  })
}

export function getPcConfig (mac) {
  return makeRequest('Get_PcConf', {
    mac: mac
  })
}

export function editPcConfig (mac, pc, ip, isDisable, pcGroup) {
  return makeRequest('SetPcConf', {
    mac: mac,
    pc: pc,
    ip: ip,
    isDisable: isDisable ? '1' : '0',
    pcGp: pcGroup
  })
}
/**
 * 获取所以客户机属性
 */
export function getPcListConfig () {
  return makeRequest('Get_PcListConf', {
  })
}

export function editPcsConfig (macList, pcGroup, isDisable) {
  return makeRequest('SetPcConf', {
    macList: macList,
    pcGp: pcGroup,
    disable: isDisable ? '1' : '0'
  })
}

export function deletePcsConfig (macList) {
  return makeRequest('Del_PcsConf', {
    macList: macList
  })
}

export function deletePcGroup (list) {
  return makeRequest('Del_PcGp', {
    list: list
  })
}

export function editPcGroup ({ name, netMk, netGW, dns1, dns2, daSV, bala, wrLimG, disable, imgG, imageList, gTim, cach, wieh, hith, resh, deps }) {
  return makeRequest('Set_PcGp', { name, netMk, netGW, dns1, dns2, daSV, bala, wrLimG, disable, imgG, imageList, gTim, cach, wieh, hith, resh, deps })
}
/**
 * 删除启动方案
 * @param {*} list
 */
export function deleteItem (list) {
  return makeRequest('Del_PcGp', {
    list: [
      list
    ]
  })
}
/**
 * 从主服务器删除服务器
 */
export function deleteserver (ip) {
  return makeRequest('Del_Servers', {
    serverIp: ip
  })
}
/**
 * 获取启动方案类别
 */
export function getPcGroup () { // 客户机方案
  return makeRequest('Get_PcGp', {
  })
}

// var PcsConfig_Operate = {
//   shutdown: '1',
//   restart: '2'
// }

export function ctrlPcsConfig (macList, pcsConfigOperate) {
  return makeRequest('Ctrl_PcsConf', {
    macList: macList,
    operate: pcsConfigOperate
  })
}

export function getSuperIP () {
  return makeRequest('Get_SupIp', {
  })
}

export function editSuperIP (ip, image, profile, vdiskInfoMajor, vdiskInfoMinor, vdiskInfoMac) {
  return makeRequest('Set_SupIp', {
    ip: ip,
    iamge: image,
    profile: profile,
    vdiskInfo: {
      major: vdiskInfoMajor,
      minor: vdiskInfoMinor,
      mac: vdiskInfoMac
    }
  })
}

// var SuperIP_action = {
//   save: 'apply',
//   discard: 'discard'
// }

export function deleteSuperIP (ip, superIpAction, comment) {
  return makeRequest('Del_SupIp', {
    ip: ip,
    action: superIpAction,
    comment: comment
  })
}

// var Master_Role = {
//   master: 'master',
//   salve: 'serve'
// }

export function changeMaster (masterRole, masterIP) {
  return makeRequest('ChMaster', {
    role: masterRole,
    master: masterIP
  })
}

export function getVersion () {
  return makeRequest('Get_Ver', {
  })
}

export function updateVersion (isoPath, rpmPath) {
  return makeRequest('Up_Ver', {
    iso: {
      path: isoPath
    },
    rpm: {
      path: rpmPath
    }
  })
}

// var Log_type = {
//   all: 'all',
//   deadly: 'deadly',
//   warning: 'warning'
// }

export function getLog (pageIndex, length, logType, isFlush) {
  return makeRequest('Get_Log', {
    pageNo: pageIndex,
    pageRows: length,
    type: logType,
    flush: isFlush ? 'yes' : 'no'
  })
}

export function clearLog () {
  return makeRequest('Ctrl_Log', {
    operate: 'clear'
  })
}

// var SyncImage_Operate = {
//   add: 'add',
//   delete: 'del',
//   setSpeed: 'setSpeed',
//   get: 'get',
//   stop: 'stop'
// }

// var SyncImage_mode = {
//   complete: 'complete',
//   difference: 'difference',
//   auto: 'auto'
// }

export function ctrlSyncImage (syncImageOperate, no, speedCtrl, sourceIp, targetIp, image, syncImageMode, comment) {
  return makeRequest('Mgr_SyncImg', {
    operate: syncImageOperate,
    no: no,
    speedCtrl: speedCtrl,
    source: sourceIp,
    targer: targetIp,
    image: image,
    mode: syncImageMode,
    comment: comment
  })
}

export function getSyncLog (date) {
  return makeRequest('Mgr_SyncLog', {
    operate: 'get',
    date: date
  })
}

export function deleteSyncLog (date) {
  return makeRequest('Mgr_SyncLog', {
    operate: 'remove',
    date: date
  })
}

export function getVDiskInfo () {
  return makeRequest('Get_dataVdisks', {
  })
}

export function register (username, password) {
  return makeRequest('Set_RegInfo', {
    user: username,
    pass: password
  })
}

export function getRegisterInfo () {
  return makeRequest('Get_RegInfo', {
  })
}

export function updateRegisterInfo () {
  return makeRequest('"Up_RegInfo', {
  })
}

export function getErrorStringList () {
  return makeRequest('GetErList', {
  })
}
/**
 * 获取guid
 */
export function getServersNode (url) {
  return makeGuid(url)
}

function makeGuid (url) {
  const data = {
    method: 'Get_Servers_Node',
    params: [
      {}
    ]
  }
  return request({
    method: 'post',
    url: `http://${url}:13302/jsonrpc`,
    data
  })
}

export function editServersNode (masterIp, url, isSyncImage, isOverload) {
  return makeServersNode('Set_Servers_Node', {
    masterIp: masterIp,
    syncimg: isSyncImage ? '1' : '0',
    auba: isOverload ? '1' : '0'
  }, url)
}

function makeServersNode (method, param, url) {
  const data = {
    method: method,
    params: [
      param
    ]
  }
  return request({
    url: `http://${url}:13302/jsonrpc`,
    method: 'post',
    data
  })
}

/**
 * 添加服务器
 * @param {*} serverIp
 * @param {*} guid
 */
export function addServers (serverIp, guid) {
  return makeRequest('Add_Servers', {
    serverIp: serverIp,
    guid: guid
  })
}

export function delServers (serverIp) {
  return makeRequest('Del_Servers', {
    serverIp: serverIp
  })
}

export function clearServersNode () {
  return makeRequest('Cls_Servers_Node', {
  })
}

export function getServersStatus () {
  return makeRequest('Get_Servers_Stat', {
  })
}
