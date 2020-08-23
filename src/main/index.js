
import WindowManager from './windows'

import EventManager from './events'

class AppManager {
  constructor () {
    this.windowManager = new WindowManager(this)
    this.eventManager = new EventManager(this)
  }

  initApp () {
    this.windowManager.createAll()
  }
}
const app1 = new AppManager()
export default app1
