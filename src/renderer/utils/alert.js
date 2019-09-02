import iView from 'iview'
import i18n from '../locale'
function notifyUserOfError (error) {
  iView.Message.error({
    content: i18n.t(error)
  })
}

function notifyUserOfDiskError (error) {
  iView.Message.error({
    content: i18n.t(`kxLinuxErr.${error}`)
  })
}
function notifyUserOfSucess (error) {
  iView.Message.success({
    content: i18n.t(error)
  })
}
function notifyUser (type, data) {
  iView.Message[type]({
    content: i18n.t(data),
    closable: true,
    duration: 5
  })
}
const test = {
  notifyUserOfError,
  notifyUserOfDiskError,
  notifyUserOfSucess,
  notifyUser
}

export default test
