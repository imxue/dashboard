<template>
    <div class="super-workstation">
        <h4>{{ $t("SuperWorkstation") }}</h4>
        <Table :columns="columns" :data="Workstation" border/>
        <CancelModal :show="showCancelModal" @save="HandleCancel" />
    </div>
</template>
<script>
import {
  getSuper

} from '@/api/client'
import CancelModal from './components/cancelModal'
export default {
  name: 'SuperWorkstation',
  props: {
    'Workstation': {
      type: Array,
      default: []
    },
    'masterIp': String
  },
  components: {
    CancelModal
  },
  data () {
    return {
      data: [],
      showCancelModal: false,
      columns: [
        {
          renderHeader: (h, params) => {
            return h('span', this.$t('Status'))
          },
          key: 'stat',
          minWidth: 70,
          maxWidth: 80,
          render: (h, params) => {
            let a = ''
            switch (params.row.stat) {
              case '1':
                a = h('Icon', {
                  props: { type: 'md-desktop', size: '20', color: '#33AFFF' }
                })
                break
              case '0':
                a = h('Icon', {
                  props: { type: 'md-desktop', size: '20', color: '#B5B6BE' }
                })
                break
            }
            return a
          }
        },
        {
          key: 'ip',
          minWidth: 80,
          maxWidth: 120,
          renderHeader: (h, params) => {
            return h('span', this.$t('ClientIP'))
          }
        },
        {
          key: 'pc',
          minWidth: 90,
          maxWidth: 90,
          renderHeader: (h, params) => {
            return h('span', this.$t('MachineName'))
          }
        },
        {
          key: 'mac',
          minWidth: 100,
          maxWidth: 140,
          renderHeader: (h, params) => {
            return h('span', this.$t('ClientMAC'))
          }
        },
        {
          key: 'pcGp',
          minWidth: 100,
          maxWidth: 100,
          renderHeader: (h, params) => {
            return h('span', this.$t('StartUpPlan'))
          }
        },
        {
          key: 'curImg',
          minWidth: 110,
          maxWidth: 110,
          renderHeader: (h, params) => {
            return h('span', this.$t('MirrorName'))
          }
        },
        {
          key: 'super',
          renderHeader: (h, params) => {
            return h('span', this.$t('operation'))
          },
          render: (h, params) => {
            let a = h('div', [
              h(
                'Button',
                {
                  props: { type: 'error' },
                  style: { marginRight: '10px' },
                  on: {
                    click: () => {
                      this.setcancle(params.row)
                    }
                  }
                },
                this.$t('cancelText')
              ),
              h(
                'Button',
                {
                  props: { type: 'info', ghost: true, disabled: params.row.stat !== '0' },
                  style: { marginRihgt: '10px' },
                  on: {
                    click: () => {
                      this.$emit('WarkSuper', params.row)
                    }
                  }
                },
                this.$t('wakeup')
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'info',
                    disabled: params.row.stat !== '1',
                    ghost: true
                  },
                  style: { marginLeft: '10px' },
                  on: {
                    click: () => {
                      this.$emit('Remote', params.row)
                    }
                  }
                },
                this.$t('Remote')
              )
            ])
            return a
          }
        }
      ]
    }
  },
  created () {
    this.fetchClient()
  },
  methods: {
    async fetchClient () {
      try {
        let resp = await getSuper(this.masterIp)
        if (resp.data.result && resp.data.result.length > 0) {
          this.data = [resp.data.result]
        }
        this.$emit('SuperIp', this.data.length > 0 ? this.data[0].ip : '')
      } catch (error) {
        this.$Message.error(error)
      }
    },
    async setcancle (row) {
      this.showCancelModal = true
    },
    async HandleCancel (row) {
      console.log(row)
    }
  }
}
</script>