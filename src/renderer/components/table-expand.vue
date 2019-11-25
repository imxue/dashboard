<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
<div  v-cloak>

    <div  v-if="this.table.name">
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">客户机: </span>
                <span class="expand-value">{{ table.name }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">主板: </span>
                <span class="expand-value">{{ table.main_board }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">cpu: </span>
                <span class="expand-value">{{ table.cpu }}</span>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <span class="expand-key">显卡: </span>
                <span class="expand-value">{{ table.graphics_card }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">网卡: </span>
                <span class="expand-value">{{ table.network_card }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">内存: </span>
                <span class="expand-value">{{ table.memory_board }}</span>
            </Col>
            <Col span="8" style="marginTop:10px;" v-if="this.table.length !== 0">
             <Button type="primary" @click="handleConfirmSinger()">{{this.$t('Confirm')}}</Button>
            </Col>
        </Row>
    </div>
    <div v-show="!this.table.name" v-cloak>
       <span>{{$t('tip1')}}</span>
    </div>
</div>

</template>
<script>
import { getConfigChangeDetail, confirm } from '@/api/client'
export default {
  props: {
    row: Object
  },
  data () {
    return {
      table: {}
    }
  },
  watch: {
    row (val) {
      getConfigChangeDetail(val.row.name).then(resp => {
        this.table = resp.data
      }, () => {

      })
    }
  },
  methods: {
    async handleConfirmSinger () {
      try {
        let resp = await confirm({ pcnames: this.table.name })
        this.$Message.success({ content: `${resp.data}`, 'closable': true })
      } catch (error) {
        this.$Message.info({ content: `${error.data.error}`, 'closable': true })
      } finally {
        // this.HandleGetInfo({ offset: this.offset, limit: this.limit, orderby: 'config_state' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
[v-cloak] {
  display: none;
}
</style>