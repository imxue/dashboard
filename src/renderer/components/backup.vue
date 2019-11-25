<template>
  <div>
    <Button @click="click">备份文件</Button>
    <Modal v-model="modal1" title="备份文件" footer-hide>
      <template v-for="item in fileArray">
      <Card >
        {{item}}
      </Card>
      </template>
      <Checkbox v-model="PcGroup">启动方案</Checkbox>
      <Checkbox v-model="DHCP">DHCP设置</Checkbox>
      <Checkbox v-model="Client">客户机管理</Checkbox>
      <Button @click="CreateBack">生成新的备份文件</Button>

    </Modal>
  </div>
</template>

<script>
import { getPcGroupx, getDHCPConfig, getPcListConfig } from '@/api/wupan'
const fs = require('fs')
const path = require('path')
const app = require('electron').remote.app
export default {
  name: 'back',
  data () {
    return {
      modal1: false,
      PcGroup: true,
      DHCP: true,
      Client: true,
      dirpath: path.resolve(app.getAppPath(), '../backup'),
      data: {
        PcGroup: '',
        DHCPConfig: '',
        PcListConfig: ''
      },
      fileArray: []
    }
  },
  methods: {
    click () {
      this.modal1 = true
    },
    HandleGetgetPcGroup () {
      return new Promise(async (resolve, reject) => {
        try {
          let resp = await getPcGroupx(localStorage.getItem('masterip'))
          resolve({ PcGroup: resp.data.result.list })
        } catch (error) {
          reject(error)
        }
      })
    },
    HandleGetgetDHCPConfig () {
      return new Promise(async (resolve, reject) => {
        try {
          let resp = await getDHCPConfig(localStorage.getItem('masterip'))
          resolve({ DHCPConfig: resp.data.result })
        } catch (error) {
          reject(error)
        }
      })
    },
    HandleGetgetPcListConfig () {
      return new Promise(async (resolve, reject) => {
        try {
          let resp = await getPcListConfig(localStorage.getItem('masterip'))
          resolve({ PcListConfig: resp.data.result.list })
        } catch (error) {
          reject(error)
        }
      })
    },
    CreateBack () {
      const dirpath = path.resolve(app.getAppPath(), '../backup')
      Promise.all([this.HandleGetgetPcGroup(), this.HandleGetgetDHCPConfig(), this.HandleGetgetPcListConfig()]).then((e) => {
        this.data = e
      })
      if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath)
      }
      fs.readdir(dirpath, (e, f) => {
        if (e) {
          console.log(e)
        }
        if (f.length > 10) {
          console.log(10)
        } else {
          fs.writeFile(path.resolve(app.getAppPath(), `../backup/${new Date().getTime()}.json`), JSON.stringify(this.data, null, 4), err => {
            if (err) {
              console.log(err)
            } else {
              console.log('创建成功')
            }
          })
        }
      })
    }

  },
  watch: {
    modal1 (e) {
      if (e) {
        fs.readdir(this.dirpath, (e, f) => {
          if (e) {
            return
          }
          this.fileArray = f
        })
      }
    }
  }
}
</script>
