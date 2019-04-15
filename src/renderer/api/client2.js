import axios from 'axios'

export default {
  getClientList (query, cb, errorCb) {
    axios.post('/v1/client/queryAll' + query).then(function (response) {
      // console.log('data=' + JSON.stringify(response.data))
      if (response.data.Code === 0) {
        cb(response.data)
      } else {
        errorCb(response.data.Msg)
      }
    }).catch(function (error) {
      errorCb(error)
    })
  },
  // 找回密码
  editClient (activeDns, backupDns, enable, gateway, id, ip, mac, startSchema, subnet, cb, errorCb) {
    axios.post('v1/user/resetPassword', {
      ActiveDns: activeDns,
      BackupDns: backupDns,
      Enable: enable,
      Gateway: gateway,
      Id: id,
      Ip: ip,
      Mac: mac,
      StartSchema: startSchema,
      Subnet: subnet
    }).then(function (response) {
      if (response.data.Code === 0) {
        cb(response.data.Data)
      } else {
        // console.log(response.data.message)
        errorCb(response.data.Msg)
      }
    }).catch(function (error) {
      errorCb(error)
    })
  }
}
