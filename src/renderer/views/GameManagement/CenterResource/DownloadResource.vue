<template>
  <div>
    <div class="topItem">
      <Button type="primary" class="topColumn" @click="handleButtonDW">下载</Button>
      <Button type="primary" class="topColumn" @click="handleButtonBack">返回</Button>
    </div>
    <!-- table -->
    <div class="mainCenter">
            <!-- <Select v-model="model1"  class="topColumn" style="width:150px;">
              <Option v-for="item in gameList" :value="item.value" :key="item.value" placeholder="全部游戏类型">{{ item.label }}</Option>
            </Select> -->
      <Form :model="formItem" :label-width="80">
        <FormItem label="">
          <Row>
            <i-col span="2">下载磁盘：</i-col>
            <i-col span="4">
              <Select v-model="formItem.select1"  class="topColumn" style="width:150px;" @on-change="handleSelect1Value">
                <Option v-for="item in gameList" :value="item.value" :key="item.Id" placeholder="全部游戏类型">{{ item.value }}</Option>
              </Select>
            </i-col>
            <i-col span="14">下载盘可用空间： 250.55 GB  游戏占用空间：10.00 GB</i-col>
          </Row>
        </FormItem>
        <FormItem label="">
          <Row>
            <i-col span="2">服务器分配：</i-col>
            <i-col span="8">
              <Table border ref="selection" :columns="tableColumns" :data="tableData" :no-data-text="this.$t('Nodata')"></Table>
            </i-col>
          </Row>
        </FormItem>
      </Form>
    </div>
    
  </div>
</template>

<script>
  export default {
    name: 'subtype1-1-download',
    data () {
      return {
        formItem: {
          input: '',
          select1: ''
        },
        model1: '',
        gameList: [
          { Id: 0, value: 'E:(默认盘)' },
          { Id: 1, value: 'E:(热门盘)' }
        ],
        tableColumns: [
          { type: 'selection', width: 60, align: 'center' },
          { title: '服务器IP', key: 'ip' },
          {
            title: '同步磁盘',
            key: 'disk',
            // render: (h, params) => {
            //   return h('Select', {
            //     props:{
            //       value: this.data[params.index].disk,
            //     },
            //     on: {
            //       'on-change':(value) => {
            //         this.data[params.index].disk = value;
            //       }
            //     }
            //   },
            //   this.disk.map (function(type) {
            //     return h('Option', {
            //       props: {value: type}
            //     }, type)
            //   })
            // )}
            render: (h, params) => {
              return h('Select', {
                props: {
                  value: '000'
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
                    value: '111'
                  }
                }, '自动分配'),
                h('Option', {
                  props: {
                    id: 1,
                    value: '222'
                  }
                }, '不同步'),
                h('Option', {
                  props: {
                    id: 2,
                    value: '111'
                  }
                }, 'E:(默认盘)'),
                h('Option', {
                  props: {
                    id: 3,
                    value: '222'
                  }
                }, 'F:(热门盘)')
              ])
            }
          }
        ],
        tableData: [
          { id: 0, ip: '10.0.0.1', disk: 'E' },
          { id: 1, ip: '10.0.0.1', disk: 'E' },
          { id: 2, ip: '10.0.0.1', disk: 'E' },
          { id: 3, ip: '10.0.0.1', disk: 'E' }
        ]
      }
    },
    created () {
      // console.log(this.$route.matched[0])
      // console.log('hello', JSON.stringify(this.routes))
      // this.test()
    },
    computed: {
      routes () {
        return this.$router.options.routes
      }
    },
    methods: {
      handleButtonDW () {
        this.$router.push('subtype1-1-download')
      },
      handleButtonBack () {
        this.$router.go(-1)
      },
      handleSelect1Value () {
        alert(this.formItem.select1)
      },
      handleSelect2Value (id) {
        alert(this.formItem.select2)
      },
      handleSelectValue (index) {
        alert(index.id)
      }
    }
  }
</script>

<style scoped>
  .ivu-input-icon{right:55px;}
</style>

