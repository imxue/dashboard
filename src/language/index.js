/**
 * 引入vue-i18n
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'

/**
 * 导入iview自带语言包
 */
import zh from 'iview/dist/locale/zh-CN'
import en from 'iview/dist/locale/en-US'
import zhtw from 'iview/dist/locale/zh-TW'
// /**
//  * 导入APP json语言包
//  */
import Zh from './zh-CN.json'
import En from './en-US.json'
import ct from './CT.json'
Vue.use(VueI18n)

// // 自动设置语言
// // 获取本机系统语言
const navLang = navigator.language

// const localLang = (navLang === 'zh-CN' || navLang === 'en-US' || navLang === 'zh-TW') ? navLang : 'en-US'
const localLang = localStorage.getItem('language') || navLang || 'en-US'

const messages = {
  'zh-CN': Object.assign(Zh, zh),
  'en-US': Object.assign(En, en),
  'zh-TW': Object.assign(zhtw, ct)
}

const i18n = new VueI18n({
  locale: localLang, // 设置地区
  messages // 设置地区信息
})
export default i18n
