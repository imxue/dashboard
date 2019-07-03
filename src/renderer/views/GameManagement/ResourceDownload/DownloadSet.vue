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
              <Select v-model="formItem.select1"  class="topColumn" >
                <Option v-for="item in gameList" :value="item.value" :key="item.Id" placeholder="全部游戏类型">{{ item.value }}</Option>
              </Select>
            </i-col>
          </Row>
        </FormItem>
        <FormItem label="">
          <Row>
            <i-col span="3">{{this.$t('DownloadSpeedlimit')}}：</i-col>
            <i-col span="5">
              <div class="x">
                <Input v-model="formItem.select2"   placeholder="" />
                  <i-col span="12">
                  <span >KB/s ({{this.$t('0ExpressSpeed')}})</span>
                    </i-col>
              </div>
            </i-col>
          </Row>
        </FormItem>
        <FormItem label="">
          <Row>
            <i-col span="3">{{$t('DefaultDownloadPaht')}}：</i-col>
            <i-col span="8">
              <Table border ref="selection" :columns="tableColumns" :data="tableData"></Table>
            </i-col>
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
        input: '',
        select1: '',
        select2: ''
      },
      model1: '',
      gameList: [
        { Id: 0, value: 1 },
        { Id: 1, value: 2 },
        { Id: 2, value: 3 }
      ],
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
                  this.handleSelectValue(params.row)
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
      tableData: []
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
    HandleGetData () {
      getDownloadSettings().then((resp) => {
        this.formItem.select1 = resp.data.max_download_task
        this.formItem.select2 = resp.data.download_speed_limit
        let test = []
        let obj = resp.data.default_download_disk
        debugger
        for (let i in obj) {
          let x = {}
          switch (i) {
            case '网络游戏':
              i = this.$t('OnlineGame')
              break
            case '单机游戏':
              i = this.$t('ConsoleGame')
              break
            case '休闲游戏':
              i = this.$t('CasualGame')
              break
            case '棋牌游戏':
              i = this.$t('ChessGame')
              break
            case '辅助游戏':
              i = this.$t('AuxiliaryGame')
              break
            case '系统工具':
              i = this.$t('SystemTool')
              break
          }
          x['TypeGame'] = i
          x['disk'] = obj[i]
          test.push(x)
        }
        this.tableData = test
      }, (err) => {
        console.log(err)
      })
    },
    handleButtonDW () {
      let info = {
        max_download_task: this.formItem.select1,
        download_speed_limit: this.formItem.select2,
        default_download_disk: {
          '网络游戏': 'C:',
          '单机游戏': 'D:',
          '休闲游戏': 'E:',
          '棋牌游戏': 'F:',
          '辅助工具': 'G:',
          '系统工具': 'H:'
        }
      }
      setDownloadSettings(info).then((resp) => {
        console.log(resp)
      }, (err) => {
        console.log(err)
      })
    },
    handleButtonBack () {
      this.$router.go(-1)
    }
    // handleSelect1Value () {
    //   alert(this.formItem.select1)
    // },
    // handleSelect2Value (id) {
    //   alert(this.formItem.select2)
    // },
    // handleSelectValue (index) {
    //   alert(index.id)
    // }
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

