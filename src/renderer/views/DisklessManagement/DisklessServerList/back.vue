<template>
    <div class="back">
        <div class="header">
            <Button @click="handleCreate">新建备份</Button>
        </div>
        <div class="main">
<template v-for="item in fileArray">
    <Card>
        <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            {{item | formatDate}}
        </p>
        <div class="center">
            <div class="wrapper">
            <span>启用</span>
            <span>删除</span>
            </div>
        </div>
    </Card>
</template>
        </div>
        <Modal
        v-model="modal1"
        title="备份选项"
        @on-ok="ok"
       >
       <CheckboxGroup v-model="back">
        <Checkbox label="Mirror">
            <span>镜像</span>
        </Checkbox>
        <Checkbox label="Startup">
            <span>启动方案</span>
        </Checkbox>
        <Checkbox label="DHCP">
            <span>DHCP</span>
        </Checkbox>
        </CheckboxGroup>
    </Modal>
    </div>
</template>


<script>
import { getImageListx, getPcGroupx, getDHCPConfig } from '@/api/wupan'
const fs = require('fs')
const path = require('path')
const app = require('electron').remote.app
export default {
  name: 'back',
  data () {
    return {
      modal1: false,
      back: ['Mirror', 'Startup', 'DHCP'],
      dirpath: path.resolve(app.getAppPath(), '../backup'),
      fileArray: [],
      mapFunction: {
        Mirror: this.HandleGetImageList
      }

    }
  },
  mounted () {
    this.HandleReader()
  },
  methods: {
    handleEdit (data) {
      if (!fs.existsSync(this.dirpath)) {
        fs.mkdirSync(this.dirpath)
      }
      fs.writeFile(path.resolve(app.getAppPath(), `../backup/${new Date().getTime()}.json`), JSON.stringify(data, null, 4), err => {
        if (err) {
          console.log(err)
        } else {
          this.HandleReader()
        }
      })
    },
    handleCreate () {
      this.modal1 = true
    },
    HandleReader () {
      this.fileArray = []
      fs.readdir(this.dirpath, (e, f) => {
        if (e) {
          console.log(e)
        } else {
          let src = f
          src.forEach(item => {
            this.fileArray.push(this.splitFileName(item))
          })
        }
      })
    },
    splitFileName (text) {
      var pattern = /\.{1}[a-z]{1,}$/
      if (pattern.exec(text) !== null) {
        return (text.slice(0, pattern.exec(text).index))
      } else {
        return text
      }
    },
    HandleGetImageList () {
      return new Promise(async (resolve, reject) => {
        try {
          let resp = await getImageListx(this.$store.state.app.masterip)
          resolve({ Image: resp.data.result.list })
        } catch (error) {
          reject(error)
        }
      })
    },
    HandleGetStartList () {
      return new Promise(async (resolve, reject) => {
        try {
          let resp = await getPcGroupx(this.$store.state.app.masterip)
          resolve({ StartList: resp.data.result.list })
        } catch (error) {
          reject(error)
        }
      })
    },
    HandleGetDHCP () {
      return new Promise(async (resolve, reject) => {
        try {
          let resp = await getDHCPConfig(this.$store.state.app.masterip)
          resolve({ DHCP: resp.data.result })
        } catch (error) {
          reject(error)
        }
      })
    },
    ok () {
      if (this.back.indexOf('Mirror') !== -1) {
        Promise.all([this.HandleGetImageList(), this.HandleGetStartList(), this.HandleGetDHCP()]).then(resp => {
          this.handleEdit(resp)
        })
      }
    }
  },
  filters: {
    formatDate (sec) {
      let date = new Date(Number(sec))
      let years = date.getFullYear()
      let months = date.getMonth() + 1
      let days = date.getDate()
      let hours = date.getHours()
      let minutes = date.getMinutes()
      let seconds = date.getSeconds()
      return `${years}-${months}-${days} ${hours}:${minutes}:${seconds}`
    }
  }

}
</script>

<style lang="scss" scoped>
.back {
    display: flex;
    flex-direction: column;
    .ivu-card {
        padding-bottom:10%;
        margin-top: 10px;
        margin-right: 10px;
        &:hover {
            background: rgb(221, 221, 221);
        span {
            color: white;
        }
        .wrapper {
            display: flex;
        }
        }
    }
    .center {
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        margin-top:20px;
        .wrapper {
            flex-direction: column;
            display: none;
            span {
                cursor: pointer;
            margin-bottom: 10px;
            border:1px solid;
            border-radius: 50%;
            padding: 10px;
        }
        }
    }
}
.main {
    display: flex;
}
</style>

