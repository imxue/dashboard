import i18n from '../locale'
/**
 * Created by jiachenpan on 16/11/18.
 */
// export function handleCallBackVaild (res) {
//   var code = res.data.Code
//   if (code === 0 || res.data.state === 'OK') {
//     this.$Message.success('操作成功')
//   } else {
//     this.$Message.error('操作失败：' + res.data.Msg)
//   }
// }
export function formatSize (value) {
  var limit = parseFloat(value)
  var size = ''
  if (value === '0' || value === 'undefined' || value === 'null') {
    size = '0KB/s'
  } else if (limit < 0.1 * 1024) { // 小于0.1KB，则转化成B
    size = limit.toFixed(2) + 'KB/s'
  } else if (limit < 0.1 * 1024 * 1024) { // 小于0.1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + 'MB/s'
  } else if (limit < 0.1 * 1024 * 1024 * 1024) { // 小于0.1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'GB/s'
  } else { // 其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'TB/s'
  }

  // var sizeStr = size + '' // 转成字符串
  // var index = sizeStr.indexOf('.') // 获取小数点处的索引
  // var dou = sizeStr.substr(index + 1, 2) // 获取小数点后两位的值
  // if (dou === '00') { // 判断后两位是否为00，如果是则删除00
  //   return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  // }
  return size
}

export function bytesToSize3 (bytes) {
  if (bytes === 0 || bytes === '0') return '0'
  var k = 1024 // or 1000
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

// 数据容量单位转换(kb,mb,gb,tb)
export function bytesToSize (bytes) {
  if (bytes === 0 || bytes === '0') return '0'
  var k = 1024 // or 1000
  var sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var i = Math.floor(Math.log(bytes) / Math.log(k))
  // console.log((bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i])
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

export function bytesToSize2 (bytes) {
  if (bytes === 0 || bytes === '0') return '0'
  var k = 1024 // or 1000
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

// 数据容量单位转换速率
export function bytesToRate (bytes) {
  if (!bytes) return '-'
  if (bytes === '0' || bytes === '0') return '0'
  var k = 1024 // or 1000
  var sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i] + '/s'
}

// 数据容量单位转换速率
export function bytesToRate1 (bytes) {
  if (!bytes) return '-'
  if (bytes === '0' || bytes === '0') return '0'
  var k = 1024 // or 1000
  var sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i] + '/s'
}

export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return [ '日', '一', '二', '三', '四', '五', '六' ][ value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export function formatTime (time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function getQueryObject (url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

export function transformTime (timestamp = +new Date()) {
  var date = new Date(timestamp * 1000)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = date.getDate() + ' '
  var h = date.getHours() + ':'
  var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
  var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
  return Y + M + D + h + m + s
}

function PadZero (str) {
  // 补零
  return new RegExp(/^\d$/g).test(str) ? `0${str}` : str
}

export function formatTime1 (_seconds) {
  _seconds = parseInt(_seconds)
  let hours, mins, seconds
  let result = ''
  seconds = parseInt(_seconds % 60)
  mins = parseInt(_seconds % 3600 / 60)
  hours = parseInt(_seconds / 3600)

  if (hours) { result = `${PadZero(hours)}:${PadZero(mins)}:${PadZero(seconds)}` } else { result = `${PadZero(mins)}:${PadZero(seconds)}` }
  return result
}
export function cleanArray (actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param (json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

export function param2Obj (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  )
}

export function html2Text (val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge (target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

export function toggleClass (element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export function getTime (type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function uniqueArr (arr) {
  return Array.from(new Set(arr))
}

export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function UploadImg (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader(file)
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      resolve(e)
    }
    reader.onerror = (e) => {
      reject(e)
    }
  })
}

/**
 * 验证ip
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function checkIpformat (rule, value, callback) {
  if (!value) {
    return callback(new Error(i18n.i('Thisfieldcannotbeempty')))
  } else {
    let reg = '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.' +
      '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
      '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
      '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$'
    let regexp = new RegExp(reg)
    if (regexp.test(value)) {
      let exits = this.clientIp.some(item => {
        return item === value
      })
      if (exits) {
        return callback(new Error(i18n.i('NotrepeatIP')))
      }
      callback()
    } else {
      return callback(new Error(i18n.i('IPAddressIsIncorrect')))
    }
  }
}
export function CreateAt (dom, wh, height) {
  var _this = this

  var bar = document.createElement('div')
  var content = document.createElement('div')
  bar.appendChild(content)
  bar.style.width = '19px'
  bar.id = 'bar'
  bar.style.overflowY = 'scroll'
  bar.style.backgroundColor = 'white'
  bar.style.overflowX = 'hidden'
  content.style.backgroundColor = 'white'
  content.id = 'content'
  content.style.borderRadius = '10px'
  content.style.width = '1px'
  this.bar = bar
  this.content = content

  if (typeof dom === 'string') {
    dom = document.getElementById(dom)
  }
  dom.innerHTML = ''
  dom.appendChild(this.bar)
  this.created = true
  if (!_this.created) return
  _this.bar.style.height = wh + 'px'
  _this.content.style.height = height + 'px'
}

export function CreateScroll (dom, contentHe, contentHeight, allhe, AllHeight, position = 0) {
  contentHe.appendChild(allhe)
  dom.appendChild(contentHe)
  dom.style.height = contentHeight + 'px'
  contentHe.style.height = contentHeight + 'px' // 展示的内容的高
  allhe.style.height = AllHeight + 'px' // 所有元素的高
  contentHe.style.overflow = 'auto'
  contentHe.style.width = '17px'
  contentHe.style.overflowX = 'hidden'
  if (contentHeight === AllHeight) {
    contentHe.scrollTop = 0
  } else {
    contentHe.scrollTop = position
  }

  return contentHe
}

export function OnScroll (dom, d) {
  this.bar.scrollTop += d
}
