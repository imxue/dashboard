import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from 'iview/dist/locale/en-US'
import zh from 'iview/dist/locale/zh-CN'
import zhTw from 'iview/dist/locale/zh-TW'

import zhCn from './zh-CN.json'
import enUs from './en-US.json'
import zhTW from './CT.json'

Vue.use(VueI18n)
const navLang = navigator.language

if (!localStorage.getItem('lang')) {
  localStorage.setItem('lang', 'zh-TW')
}
const lang = localStorage.getItem('lang') || navLang || 'en-US'

Vue.locale = () => {}
const messages = {
  'en-US': { ...enUs, ...en },
  'zh-CN': { ...zhCn, ...zh },
  'zh-TW': { ...zhTw, ...zhTW }
}

const i18n = new VueI18n({
  locale: lang, // set locale
  messages, // set locale messages
  silentFallbackWarn: true
})

export default i18n
