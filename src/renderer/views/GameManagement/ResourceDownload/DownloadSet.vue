<template>
  <div>
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonDW">{{$t('Save')}}</Button>
      <Button type="primary" class="topColumn" @click="handleButtonBack">{{$t('return')}}</Button>
    </div>
    <!-- table -->
    <div class="mainCenter">
      <Form :model="formItem">
        <FormItem label="">
          <Row>
            <i-col span="3">{{this.$t('MaxdownloadTasks')}}：</i-col>
            <i-col span="5">
               <Input v-model.number="formItem.global_max_dl_tasks"  @on-change="handeChange"  class="topColumn"  placeholder="" />
            </i-col>
          </Row>
               <Row style="marginTop:10px" >
            <i-col span="3">{{this.$t('MaxUpTasks')}}：</i-col>
            <i-col span="5">
               <Input v-model.number="formItem.global_max_up_tasks"  @on-change="handeChange"  class="topColumn"  placeholder="" />
            </i-col>
          </Row>

        </FormItem>
        <FormItem label="">
          <Row style="marginTop:10px">
            <i-col span="3">{{this.$t('DownloadSpeedlimit')}}：</i-col>
            <i-col span="5">
              <div class="x">
                <Input v-model.number="formItem.global_max_dl_speed"  @on-change="handeChange" placeholder="" />
                  <i-col span="12">
                  <span >KB/s ({{this.$t('0ExpressSpeed')}})</span>
                    </i-col>
              </div>
            </i-col>
          </Row >
                    <Row style="marginTop:10px">
            <i-col span="3">{{this.$t('UpSpeedlimit')}}：</i-col>
            <i-col span="5">
              <div class="x">
                <Input v-model.number="formItem.global_max_up_speed" @on-change="handeChange"  placeholder="" />
                  <i-col span="12">
                  <span >KB/s ({{this.$t('0ExpressSpeed')}})</span>
                    </i-col>
              </div>
            </i-col>
          </Row>
        </FormItem>

               <FormItem label="">
          <Row>
            <i-col span="3">{{this.$t('ListenerPort')}}：</i-col>
            <i-col span="5">
              <div class="x">
                <Input v-model.number="formItem.listen_port"  @on-change="handeChange"  placeholder="" />
                  <i-col span="12">
                    </i-col>
              </div>
            </i-col>
          </Row>

          </Row>
        </FormItem>
      </Form>
    </div>
    
  </div>
</template>

<script>
import { getDownloadSettings, setDownloadSettings } from '../../../api/game'
export default {
  name: 'downloadSet',
  data () {
    return {
      formItem: {
        global_max_up_tasks: '',
        global_max_up_speed: '',
        global_max_dl_speed: '',
        global_max_dl_tasks: '',
        listen_port: ''
      },
      change: false,
      tableColumns: [
        { key: 'TypeGame', renderHeader: (h, params) => { return h('span', this.$t('TypeName')) } },
        {
          title: '同步磁盘',
          key: 'disk',
          renderHeader: (h, params) => { return h('span', this.$t('SynchronizeDisk')) },
          render: (h, params) => {
            return h('Select', {
              props: {
                value: params.row.disk
              },
              on: {
                'on-change': (event) => {
                  this.change = true
                  this.tableData[params.index].disk = event
                }
              }
            },
            [
              h('Option', {
                props: {
                  id: 0,
                  value: 'C:'
                }
              }, 'C'),
              h('Option', {
                props: {
                  id: 1,
                  value: 'D:'
                }
              }, 'D'),
              h('Option', {
                props: {
                  id: 2,
                  value: 'E:'
                }
              }, 'E'),
              h('Option', {
                props: {
                  id: 3,
                  value: 'H:'
                }
              }, 'H'),
              h('Option', {
                props: {
                  id: 4,
                  value: 'F:'
                }
              }, 'F'),
              h('Option', {
                props: {
                  id: 5,
                  value: 'G:'
                }
              }, 'G')
            ])
          }
        }
      ],
      tableData: [],
      srcData: []
    }
  },
  created () {
    this.HandleGetData()
  },
  computed: {
    routes () {
      return this.$router.options.routes
    }
  },
  methods: {
    handeChange (e) {
      this.change = true
      console.log(this.srcData)
    },
    HandleGetData () {
      getDownloadSettings().then((resp) => {
        this.formItem.global_max_dl_tasks = resp.data[0].global_max_dl_tasks
        this.formItem.global_max_dl_speed = resp.data[0].global_max_dl_speed
        this.formItem.global_max_up_tasks = resp.data[0].global_max_up_tasks
        this.formItem.global_max_up_speed = resp.data[0].global_max_up_speed
        this.formItem.listen_port = resp.data[0].listen_port
        this.srcData = { ...this.formItem }
        for (const key in this.formItem) {
          if (this.formItem.hasOwnProperty(key)) {
            this.srcData[key] = this.formItem[key]
          }
        }
        // let test = []
        // let obj = resp.data.default_download_disk
        // for (let i in obj) {
        //   let o = i // 保存原来的key值
        //   let x = {}
        //   switch (i) {
        //     case '网络游戏':
        //       i = this.$t('OnlineGame')
        //       break
        //     case '单机游戏':
        //       i = this.$t('ConsoleGame')
        //       break
        //     case '休闲游戏':
        //       i = this.$t('CasualGame')
        //       break
        //     case '棋牌游戏':
        //       i = this.$t('ChessGame')
        //       break
        //     case '辅助游戏':
        //       i = this.$t('AuxiliaryGame')
        //       break
        //     case '系统工具':
        //       i = this.$t('SystemTool')
        //       break
        //   }
        //   x['TypeGame'] = i
        //   x['disk'] = obj[o]
        //   test.push(x)
        // }
        // this.tableData = test
      }, (err) => {
        console.log(err)
      })
    },
    handleButtonDW () {
      var obj = {}
      for (var item in this.tableData) {
        obj[this.tableData[item].TypeGame] = this.tableData[item].disk
      };
      let info = { ...this.formItem }
      setDownloadSettings(info).then((resp) => {
        this.change = false
        this.$Message.success({
          content: this.$t('OperationSuccessful')
        })
      }, () => {
        this.$Message.error({
          content: this.$t('operation') + this.$t('fail')
        })
      })
    },
    handleButtonBack () {
      this.$router.go(-1)
    }
  },
  beforeRouteLeave (to, from, next) {
    let answer
    if (this.change) {
      for (const key in this.srcData) {
        if (this.srcData.hasOwnProperty(key)) {
          if (this.srcData[key] !== this.formItem[key]) {
            answer = window.confirm('你没有提交你修改的信息，直接离开将不会保存，请知晓')
            console.log('存在不一样')
          }
        }
      }
      if (answer) {
        next()
      } else if (typeof answer === 'undefined') {
        next()
      }
    } else {
      next()
    }
  }
}
</script>

<style scoped>
  .x{
    display: flex;
    justify-content: space-between;
    text-align: right;
  }
  .mainCenter {
    height:800px;
  }
  .ivu-table-wrapper {
    overflow:visible;
  }
</style>

