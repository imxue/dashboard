// // import { param2Obj } from '@/utils'
// import Mock from 'mockjs'

// let serverList = []
// for (let i = 0; i < 20; i++) {
//   serverList.push(Mock.mock({
//     'id|+1': 0,
//     serverIp: '172.17.88.112',
//     guid: '11111',
//     online: '1', // 服务器是否在线,1为在线，0为离线，2 为主服务器不一样在线状态
//     fun: 'writebackDisk'
//   }))
// }

// var imageList = []
// for (let i = 0; i < 20; i++) {
//   imageList.push(Mock.mock({
//     id: '@increment',
//     name: +Mock.Random.date('T'),
//     size: '@first',
//     fileSizeB: '@first',
//     fun: 'writebackDisk'
//   }))
// }

// function makeSuccessResponse () {
//   return {
//     error: null,
//     result: {}
//   }
// }

// // function makeSuccessResponseWithData (result) {
// //   return {
// //     error: null,
// //     result: result
// //   }
// // }

// // function makeFaildResponse (error) {
// //   return {
// //     error: error,
// //     result: {}
// //   }
// // }

// function login ({ password }) {
//   return makeSuccessResponse()
// }

// function controllServer ({ controlServerType, controlServerAction }) {
//   return makeSuccessResponse()
// }

// function passwordReset ({ oldPassword, newPassword }) {
//   return makeSuccessResponse()
// }

// function getDiskStatus () {
//   return makeSuccessResponse()
// }

// function setDiskFunction ({ path, diskFunctionType, cacheSizeMB, isFormat, volume }) {
//   return makeSuccessResponse()
// }

// function getImageList () {
//   return makeSuccessResponse()
//   // var imageList = []
//   // for (let i = 0; i < 20; i++) {
//   //   imageList.push(Mock.mock({
//   //     id: '@increment',
//   //     name: +Mock.Random.date('T'),
//   //     size: '@first',
//   //     fileSizeB: '@first',
//   //     fun: 'writebackDisk'
//   //   }))
//   // }
//   // return {
//   //   result: {
//   //     list: imageList
//   //   }
//   // }
// }

// function createImage ({ name, sizeGB, title, path, cacheSizeMB, mountVolume, isImportFormMaster }) {
//   return makeSuccessResponse()
// }

// function editImage ({ name, title, mountVolume }) {
//   return makeSuccessResponse()
// }

// function deleteImage ({ name }) {
//   return makeSuccessResponse()
// }

// function createImageProject ({ image, projectNO, restoreNo, name, title }) {
//   return makeSuccessResponse()
// }

// function deleteImageProject ({ image, projectNO }) {
//   return makeSuccessResponse()
// }

// function editImageProject ({ image, projectNO, name, title }) {
//   return makeSuccessResponse()
// }

// function mergeImageProject ({ image, projectNO }) {
//   return makeSuccessResponse()
// }

// function deleteImageRestore ({ image, projectNO, restoreNO }) {
//   return makeSuccessResponse()
// }

// // function revertImageRestore ({ image, projectNO, restoreNO }) {
// //   return makeSuccessResponse()
// // }

// function editImageRestore ({ image, projectNO, restoreNO, comment }) {
//   return makeSuccessResponse()
// }

// // function getImageRestore ({ image, projectNO }) {
// //   return makeSuccessResponse()
// // }

// function imageMount ({ image, projectNO, volume }) {
//   return makeSuccessResponse()
// }

// function imageUnMount ({ image, restoreNO, isSave, volume, isSetUse, comment }) {
//   return makeSuccessResponse()
// }

// function initImage ({ image }) {
//   return makeSuccessResponse()
// }

// function getImage ({ image }) {
//   return makeSuccessResponse()
// }

// function getNetwork () {
//   return makeSuccessResponse()
// }

// function setVdiskEthernet ({ list }) {
//   return makeSuccessResponse()
// }

// function getClientStatus () {
//   return makeSuccessResponse()
// }

// function getServerStatus () {
//   return makeSuccessResponse()
// }

// function getDHCPConfig () {
//   return makeSuccessResponse()
// }

// function editDHCPConfig ({ prefix, numbeLength, numberBegin, ipBegin, dhcpConfigAddMode, pcGroup }) {
//   return makeSuccessResponse()
// }

// function getPcConfig ({ mac }) {
//   return makeSuccessResponse()
// }

// function editPcConfig ({ mac, pc, ip, isDisable, pcGroup }) {
//   return makeSuccessResponse()
// }

// function getPcListConfig () {
//   return makeSuccessResponse()
// }

// function editPcsConfig ({ macList, pcGroup, isDisable }) {
//   return makeSuccessResponse()
// }

// function deletePcsConfig ({ macList }) {
//   return makeSuccessResponse()
// }

// function deletePcGroup ({ list }) {
//   return makeSuccessResponse()
// }

// function editPcGroup ({ name, networkMask, networkGateway, dns1, dns2, dataServerIP, isBalance, isDisable, writeLimitGB, imageList, imageTimeout, cacheMB, pixelWidth, pixelHeight, refresh, colorDepth }) {
//   return makeSuccessResponse()
// }

// function getPcGroup () {
//   return makeSuccessResponse()
// }

// function ctrlPcsConfig ({ macList, pcsConfigOperate }) {
//   return makeSuccessResponse()
// }

// function getSuperIP () {
//   return makeSuccessResponse()
// }

// function editSuperIP ({ ip, image, profile, vdiskInfoMajor, vdiskInfoMinor, vdiskInfoMac }) {
//   return makeSuccessResponse()
// }

// function deleteSuperIP ({ ip, superIpAction, comment }) {
//   return makeSuccessResponse()
// }

// function changeMaster ({ masterRole, masterIP }) {
//   return makeSuccessResponse()
// }

// function getVersion () {
//   return makeSuccessResponse()
// }

// function updateVersion ({ isoPath, rpmPath }) {
//   return makeSuccessResponse()
// }

// function getLog ({ pageIndex, length, logType, isFlush }) {
//   return makeSuccessResponse()
// }

// function clearLog () {
//   return makeSuccessResponse()
// }

// function ctrlSyncImage ({ syncImageOperate, no, speedCtrl, sourceIp, targetIp, image, syncImageMode, comment }) {
//   return makeSuccessResponse()
// }

// function getVDiskInfo () {
//   return makeSuccessResponse()
// }

// function register ({ username, password }) {
//   return makeSuccessResponse()
// }

// function getRegisterInfo () {
//   return makeSuccessResponse()
// }

// function updateRegisterInfo () {
//   return makeSuccessResponse()
// }

// function getErrorStringList () {
//   return makeSuccessResponse()
// }

// function getServersNode () {
//   return makeSuccessResponse()
// }

// function editServersNode ({ masterIp, isSyncImage, isOverload }) {
//   return makeSuccessResponse()
// }

// function addServers ({ serverIp, guid }) {
//   return makeSuccessResponse()
// }

// function delServers ({ serverIp }) {
//   return makeSuccessResponse()
// }

// function getServers () {
//   return makeSuccessResponse()
// }

// function clearServersNode () {
//   return makeSuccessResponse()
// }

// function getServersStatus () {
//   return makeSuccessResponse()
// }

// function getSyncLog ({ date }) {
//   return makeSuccessResponse()
// }

// function deleteSyncLog ({ date }) {
//   return makeSuccessResponse()
// }

// export default {
//   wupan: config => {
//     const data = JSON.parse(config.body)
//     const method = data.method
//     const param = data.params[0]
//     switch (method) {
//       case 'Login':
//         return login(param)
//       case 'Ctrl_Srv':
//         return controllServer(param)
//       case 'Pwd_Set':
//         return passwordReset(param)
//       case 'Get_DiskStatus':
//         return getDiskStatus(param)
//       case 'Set_DiskFun':
//         return setDiskFunction(param)
//       case 'Get_ImgList':
//         return getImageList(param)
//       case 'Create_Img':
//         return createImage(param)
//       case 'Set_Img':
//         return editImage(param)
//       case 'Delete_Img':
//         return deleteImage(param)
//       case 'Cre_ImgPro':
//         return createImageProject(param)
//       case 'Del_ImgPro':
//         return deleteImageProject(param)
//       case 'Set_ImgPro':
//         return editImageProject(param)
//       case 'Mer_ImgPor':
//         return mergeImageProject(param)
//       case 'Del_ImgBol':
//         return deleteImageRestore(param)
//       case 'To_ImgBol':
//         return deleteImageRestore(param)
//       case 'Set_ImgBol':
//         return editImageRestore(param)
//       case 'ImgMout':
//         return imageMount(param)
//       case 'ImgUnMout':
//         return imageUnMount(param)
//       case 'Img_InitConf':
//         return initImage(param)
//       case 'Get_Img':
//         return getImage(param)
//       case 'Get_Net':
//         return getNetwork(param)
//       case 'Set_VdiskEth':
//         return setVdiskEthernet(param)
//       case 'Get_CliStat':
//         return getClientStatus(param)
//       case 'Get_SrvStat':
//         return getServerStatus(param)
//       case 'Get_DhcpConf':
//         return getDHCPConfig(param)
//       case 'Set_DhcpConf':
//         return editDHCPConfig(param)
//       case 'Get_PcConf':
//         return getPcConfig(param)
//       case 'SetPcConf':
//         return editPcsConfig(param)
//       case 'Get_PcListConf':
//         return getPcListConfig(param)
//       case 'SetPcSConf':
//         return editPcConfig(param)
//       case 'Del_PcsConf':
//         return deletePcsConfig(param)
//       case 'Del_PcGp':
//         return deletePcGroup(param)
//       case 'Set_PcGp':
//         return editPcGroup(param)
//       case 'Get_PcGp':
//         return getPcGroup(param)
//       case 'Ctrl_PcsConf':
//         return ctrlPcsConfig(param)
//       case 'Get_SupIp':
//         return getSuperIP(param)
//       case 'Set_SupIp':
//         return editSuperIP(param)
//       case 'Del_SupIp':
//         return deleteSuperIP(param)
//       case 'ChMaster':
//         return changeMaster(param)
//       case 'Get_Ver':
//         return getVersion(param)
//       case 'Up_Ver':
//         return updateVersion(param)
//       case 'Get_Log':
//         return getLog(param)
//       case 'Ctrl_Log':
//         return clearLog(param)
//       case 'Mgr_SyncImg':
//         return ctrlSyncImage(param)
//       case 'Get_dataVdisks':
//         return getVDiskInfo(param)
//       case 'Set_RegInfo':
//         return register(param)
//       case 'Get_RegInfo':
//         return getRegisterInfo(param)
//       case 'Up_RegInfo':
//         return updateRegisterInfo(param)
//       case 'GetErList':
//         return getErrorStringList(param)
//       case 'Get_Servers_Node':
//         return getServersNode(param)
//       case 'Set_Servers_Node':
//         return editServersNode(param)
//       case 'Add_Servers':
//         return addServers(param)
//       case 'Del_Servers':
//         return delServers(param)
//       case 'Get_Servers':
//         return getServers(param)
//       case 'Cls_Servers_Node':
//         return clearServersNode(param)
//       case 'Get_Servers_Stat':
//         return getServersStatus(param)
//       case 'Mgr_SyncLog':
//         switch (param.operate) {
//           case 'get':
//             return getSyncLog(param)
//           case 'remove':
//             return deleteSyncLog(param)
//         }
//     }
//   }
// }
