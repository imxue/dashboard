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
const test = {
  notifyUserOfError,
  notifyUserOfDiskError,
  notifyUserOfSucess
}

export default test
