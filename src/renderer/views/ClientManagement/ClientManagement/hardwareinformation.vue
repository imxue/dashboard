<template>
<div>
  <div class="header">
     <Input class="search" search :enter-button="this.$t('Search')" :placeholder="this.$t('MachineName')" @on-search="hadnleSearch" />
    <Button type="info" @click="handleConfirm">{{$t('Confirm')}}</Button>
  </div>
    <Table @on-sort-change="onSortChange" :row-class-name="rowClassName" @on-row-dblclick="onCheck" border ref="selection" :columns="columns1" :data="data1" @on-selection-change="handleChange" ></Table>
    <div class="item">
      <Page :total="pageinfo.count" show-total  :current="currentPage" :page-size="limit" @on-change="HandleChangePage"/>
    </div>
    <Modal
        v-model="modal1"
        :title="this.$t('HardwareInformationComparison')"
        width="740px"
        @on-ok="ok"
     >

        <table style="width:100%">
          <thead>
            <tr>
              <th>
                {{$t('HardwareType')}}
              </th>
               <th>
                {{$t('OriginalHardware')}}
              </th>
               <th>
                 {{$t('NewHardware')}}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr :class='{isActive:oldDatax.main_board !== Datax.main_board}'>
              <td>
                 {{$t('MainBoard')}}
              </td>
              <td>{{oldDatax.main_board || '-'}}</td>
              <td>{{Datax.main_board || '-'}}</td>
            </tr>
            <tr :class='{isActive:oldDatax.cpu !== Datax.cpu}'>
              <td>
                {{$t('Cpu')}}
              </td>
             <td>{{oldDatax.cpu || '-'}}</td>
             <td>{{Datax.cpu || '-'}}</td>
            </tr>
            <tr :class='{isActive:oldDatax.memory_board !== Datax.memory_board}'>
              <td> {{$t('RAM')}}</td>
              <td>{{oldDatax.memory_board || '-'}}</td>
              <td>{{Datax.memory_board || '-'}}</td>
            </tr>
            <tr :class='{isActive:oldDatax.graphics_card !== Datax.graphics_card}'>
             <td>{{$t('GraphicsCard')}}</td>
              <td>{{oldDatax.graphics_card || '-'}}</td>
              <td>{{Datax.graphics_card || '-'}}</td>
            </tr>
            <tr :class='{isActive:oldDatax.network_card !== Datax.network_card}'>
              <td>{{$t('NetworkCard')}}</td>
              <td>{{oldDatax.network_card || '-'}}</td>
              <td>{{Datax.network_card || '-'}}</td>
            </tr>
          </tbody>
          <tfoot>

          </tfoot>
        </table>
    </Modal>
</div>
</template>

<script>
import { getAllPcConfigs, confirm, getConfigChangeDetail } from '@/api/client'
export default {
  name: 'hardwareinformation',
  data () {
    return {
      modal1: false,
      oldData: '',
      newData: '',
      columns1: [

        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: this.$t('ConfigState'),
          key: 'config_state',
          width: 127,
          render: (h, params) => {
            if (params.row.config_state === 1) {
              return h('span', this.$t('Change'))
            } else if (params.row.config_state === 2) {
              return h('span', this.$t('confirmed'))
            }
          },
          filterMultiple: false,
          filters: [
            {
              label: this.$t('Change'),
              value: 1
            },
            {
              label: this.$t('confirmed'),
              value: 2
            }
          ],
          filterRemote: this.test
        },

        {
          title: this.$t('MachineName'),
          key: 'name',
          width: 110,
          sortable: 'custom'
        },
        {
          key: 'network_card_rate',
          width: 110,
          render: (h, params) => {
            return h(
              'span',
              `${params.row.network_card_rate || 0} Mb/s`
            )
          },
          renderHeader: (h, params) => {
            return h('span', this.$t('NIC speed'))
          }
        },
        {
          title: this.$t('MainBoard'),
          key: 'main_board',
          width: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: this.$t('Cpu'),
          key: 'cpu',
          ellipsis: true,
          tooltip: true
        },
        {
          title: this.$t('GraphicsCard'),
          key: 'graphics_card',
          ellipsis: true,
          tooltip: true
        },
        {
          title: this.$t('NetworkCard'),
          key: 'network_card',
          ellipsis: true,
          tooltip: true
        },
        {
          title: this.$t('RAM'),
          key: 'memory_board',
          ellipsis: true,
          tooltip: true
        }
        // {
        //   title: this.$t('operation'),
        //   render: (h, params) => {
        //     return h('Button', { props: {
        //       type: 'primary',
        //       size: 'small'
        //     },
        //     on: {
        //       click: () => { this.handleConfirmSinger(params.row) }
        //     } }, this.$t('Confirm'))
        //   }
        // }
      ],
      srcdData: '',
      data1: [],
      count: 0,
      currentPage: 1,
      limit: 10,
      pageinfo: {},
      selectData: [],
      offset: 0,
      ConfigState: '',
      Datax: {},
      oldDatax: {}
    }
  },
  created () {
    this.init()
    this.HandleGetInfo({ offset: this.offset, limit: this.limit, orderby: 'config_state', config_state: this.ConfigState })
  },

  methods: {
    init () {
      getAllPcConfigs().then(res => {
        let changeClient = res.data.data.filter(item => {
          return item.config_state === 1
        })
        this.$store.dispatch('SAVEHardwareInformation', changeClient)
      })
    },
    HandleDetail (row) {
      this.modal1 = true
      this.oldData = [row]
    },
    rowClassName (row, index) {
      if (row.config_state === 1) {
        return 'demo-table-info-row'
      } else {
        return ''
      }
    },
    HandleGetInfo (info) {
      getAllPcConfigs(info).then((e) => {
        this.data1 = e.data.data
        this.pageinfo = e.data.pageino
      })
    },
    HandleChangePage (e) {
      this.offset = (e - 1) * this.limit
      this.HandleGetInfo({ offset: (e - 1) * this.limit, limit: this.limit, orderby: 'name', config_state: this.ConfigState })
    },
    async handleConfirm () {
      let str = ''
      if (this.selectData.length > 0) {
        this.selectData.forEach(item => {
          str += `${item.name},`
        })
      }
      try {
        await confirm({ pcnames: str.substring(0, str.length - 1) })
        this.$Message.success({ content: `${this.$t('ConfigurationConfirmed')}`, 'closable': true })
      } catch (error) {
        this.$Message.info({ content: `${error.data.error}`, 'closable': true })
      } finally {
        this.HandleGetInfo({ offset: this.offset, limit: this.limit, orderby: 'config_state' })
        this.$refs.selection.selectAll(false)
        this.init()
      }
    },
    handleChange (e) {
      this.selectData = e
    },
    async hadnleSearch (e) {
      try {
        let resp = await getConfigChangeDetail(e)
        this.data1 = resp.data.data
      } catch (error) {
        this.$Message.info(`${error.data.error}`)
      }
    },
    async onCheck (item) {
      try {
        let res = await getConfigChangeDetail(item.name)
        this.oldDatax = res.data
        this.Datax = item
        this.modal1 = true
      } catch (error) {
        this.$Message['info']({
          background: true,
          content: 'Client configuration information has not changed, unable to get configuration change details'
        })
        this.modal1 = false
      } finally {

      }
    },
    test (v, r) {
      this.offset = 0
      this.limit = 10
      this.ConfigState = v
      this.HandleGetInfo({ offset: this.offset, limit: this.limit, orderby: 'config_state', config_state: this.ConfigState })
    },
    onSortChange (v) {
      if (v.order === 'desc') {
        this.HandleGetInfo({ offset: this.offset, limit: this.limit, orderby: v.key, config_state: this.ConfigState })
      } else {
        this.HandleGetInfo({ offset: this.offset, limit: this.limit, orderby: v.key, config_state: this.ConfigState })
      }
    },
    async ok () {
      try {
        await confirm({ pcnames: this.oldDatax.name })
      } catch (error) {

      } finally {
        this.HandleGetInfo({ offset: this.offset, limit: this.limit, orderby: 'config_state' })
        this.$refs.selection.selectAll(false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .item{
     text-align: end;
     margin-top: 10px;
 }
 
 .header{
   margin-bottom: 10px;
   .search {
     width: 300px;
     margin-right: 10px;
   }
   display: flex;
 }
table {
  width: 100%;
  color: #515a6e;
  font-size: 12px;
}
table, th, td {
   border: 1px solid #e8eaec;
   border-collapse: collapse;
   text-align: center;
   th {
    height:40px;
  }
  td {
    height:48px;
  }
   thead {
     font-weight: bold;
     background: #f8f8f9;
   }
   .isActive {
     color: red;
   }
 }
</style>