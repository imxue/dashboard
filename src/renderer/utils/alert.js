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

function notify (error) {
  iView.Message.error({
    content: error + ''
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
  notifyUser,
  notify
}

export default test
