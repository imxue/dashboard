<template>
  <div class="client-list">
    <h4>{{ $t("ClientList") }}</h4>
    <Table :columns="columns" :data="clientList" border />
    <setSuperModal
      :showSetSuperModal="showSetSuperModal"
      :masterIp="masterIp"
      :selfIp="selfIp"
      @SetSuper="HandleSubmit"
      @handleVisible="handleVisible"
    />

  </div>
</template>
<script>
import setSuperModal from './components/setSuperModal'
import { setSuper } from '@/api/client'
export default {
  name: 'clientList',
  props: {
    clientList: {
      type: Array,
      default: []
    },
    masterIp: {
      type: String,
      default: ''
    }
  },
  components: {
    setSuperModal
  },
  data () {
    return {
      selfIp: '',
      clientData: {},
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
                  props: {
                    type: 'info',
                    disabled: params.row.stat !== '1'
                  },
                  style: { marginRight: '10px' },
                  on: {
                    click: () => {
                      this.$emit('Remote', params.row)
                    }
                  }
                },
                this.$t('Remote')
              ),
              h(
                'Button',
                {
                  props: { type: 'success' },
                  style: { marginRight: '10px' },
                  on: {
                    click: () => {
                      this.handleSetClient(params.row)
                    }
                  }
                },
                this.$t('Edit')
              ),
              h(
                'Button',
                {
                  props: { type: 'primary' },
                  style: { marginRight: '10px' },
                  on: {
                    click: () => {
                      this.setSuper(params.row)
                    }
                  }
                },
                this.$t('SetSuperWorkstation')
              ),
              h(
                'Button',
                {
                  props: { type: 'error' },
                  on: {
                    click: () => {
                      this.$emit('WarkSuper', params.row)
                    }
                  }
                },
                this.$t('Delete')
              )
            ])
            return a
          }
        }
      ]
    }
  },
  methods: {
    setSuper (row) {
      this.showSetSuperModal = true
      this.selfIp = row.ip
    },
    async HandleSubmit (data) {
      try {
        await setSuper(data, this.masterIp)
        this.showSetSuperModal = false
      } catch (error) {
        this.$Message.error(this.$t(`kxLinuxErr.${error}`))
      }
    },
    handleSetClient (data) {
      this.$emit('OpenModal', { type: 'edit', data })
    }
  }
}
</script>
