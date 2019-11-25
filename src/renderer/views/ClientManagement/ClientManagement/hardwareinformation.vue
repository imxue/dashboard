<template>
<div>
  <div class="header">
     <Input class="search" search enter-button="Search" placeholder="Enter something..." @on-search="hadnleSearch" />
    <Button type="info" @click="handleConfirm">{{$t('Confirm')}}</Button>
  </div>
    <Table :row-class-name="rowClassName" border ref="selection" :columns="columns1" :data="data1" @on-selection-change="handleChange" ></Table>
    <div class="item">
      <Page :total="pageinfo.count" show-total  :current="currentPage" :page-size="limit" @on-change="HandleChangePage"/>
    </div>
</div>
</template>

<script>
import { getAllPcConfigs, confirm, getConfigChangeDetail } from '@/api/client'
import expandRow from '../../../components/table-expand'
export default {
  name: 'hardwareinformation',
  components: { expandRow },
  data () {
    return {
      modal1: false,
      oldData: '',
      newData: '',
      columns1: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params
              }
            })
          }
        },
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: this.$t('ConfigState'),
          key: 'config_state',
          width: 100,
          render: (h, params) => {
            if (params.row.config_state === 1) {
              return h('span', this.$t('Change'))
            } else if (params.row.config_state === 2) {
              return h('span', this.$t('confirmed'))
            }
          }
        },
        {
          title: this.$t('MachineName'),
          key: 'name',
          width: 90
        },
        {
          title: this.$t('MainBoard'),
          key: 'main_board'
        },
        {
          title: this.$t('Cpu'),
          key: 'cpu'
        },
        {
          title: this.$t('GraphicsCard'),
          key: 'graphics_card'
        },
        {
          title: this.$t('NetworkCard'),
          key: 'network_card'
        },
        {
          title: this.$t('RAM'),
          key: 'memory_board'
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
      offset: 0
    }
  },
  created () {
    this.HandleGetInfo({ offset: this.offset, limit: this.limit, orderby: 'config_state' })
  },
  methods: {
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
      this.HandleGetInfo({ offset: (e - 1) * this.limit, limit: this.limit, orderby: 'config_state' })
    },
    async handleConfirm () {
      let str = ''
      if (this.selectData.length > 0) {
        this.selectData.forEach(item => {
          str += `${item.name},`
        })
      }
      try {
        let resp = await confirm({ pcnames: str.substring(0, str.length - 1) })
        this.$Message.success({ content: `${resp.data}`, 'closable': true })
      } catch (error) {
        this.$Message.info({ content: `${error.data.error}`, 'closable': true })
      } finally {
        this.HandleGetInfo({ offset: this.offset, limit: this.limit, orderby: 'config_state' })
        this.$refs.selection.selectAll(false)
      }
    },
    // async handleConfirmSinger (row) {
    //   try {
    //     let resp = await confirm({ pcnames: row.name })
    //     this.$Message.success({ content: `${resp.data}`, 'closable': true })
    //   } catch (error) {
    //     this.$Message.info({ content: `${error.data.error}`, 'closable': true })
    //   } finally {
    //     this.HandleGetInfo({ offset: this.offset, limit: this.limit, orderby: 'config_state' })
    //     this.$refs.selection.selectAll(false)
    //   }
    // },
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
</style>