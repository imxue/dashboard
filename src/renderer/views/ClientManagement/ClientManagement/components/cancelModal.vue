<template>
    <Modal
      :title="this.$t('CancleSuperS')"
      v-model="showCancelModal"
      footer-hide
      :styles="{ top: '220px' }"
    >
      <Form
        ref="formValidate1"
        :model="formValidate"
        :rules="rule"
        :label-width="100"
      >
        <FormItem :label="this.$t('operation')" prop="action">
          <Select v-model="formValidate.action" @on-change="changeCommon">
            <Option value="apply">{{ $t("apply") }}</Option>
            <Option value="discard">{{ $t("cancelText") }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="this.$t('comment')" prop="comment">
          <Input v-model="formValidate.comment" type="text" />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            @click="handleCancelaction('formValidate1')"
            :loading="loadBtnCancel"
            >{{ $t("Save") }}</Button
          >
          <!-- <Button
            @click="handleReset('formValidate1')"
            style="margin-left: 8px"
            >{{ $t("cancelText") }}</Button -->
          >
        </FormItem>
      </Form>
    </Modal>
</template>

<script>
export default {
  name: 'CancelModal',
  props: {
    showCancelModal: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      loadBtnCancel: false,
      formValidate: {
        action: '',
        comment: ''
      },
      rule: {}
    }
  },
  methods: {
    async handleCancelaction (name) {
      this.$refs[name].validate(valid => {
        let param = {
          ip: this.canceledip,
          action: this.formValidate1.action,
          comment: this.formValidate1.comment
        }
        this.$emit('save', param)
      })
    },
    changeCommon () {}

  }
}
</script>>