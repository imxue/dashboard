import { downloadGame } from '@/api/game'
/**
 * 下载游戏
 * @param {*} vue
 * @param {*} CenterGameId  中心游戏id
 * @param {*} DiskSymbol 盘符
 */
async function download (vue, CenterGameId, DiskSymbol) {
  try {
    let resp = await downloadGame(CenterGameId, DiskSymbol)
    return resp
  } catch (error) {
    vue.notifyUser('error', error.data.error)
    return 0
  }
}

export {
  download
}
