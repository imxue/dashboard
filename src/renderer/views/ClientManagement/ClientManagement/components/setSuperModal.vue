<template>
    <Modal
      :title="this.$t('SetSuperWorkstation')"
      v-model="showSetSuperModal"
      @on-visible-change='handleVisible'
      footer-hide
      width="500"
    >
      <Form
        ref="formValidatex"
        :model="model"
        :rules="rule"
        :label-width="100"
      >
        <FormItem :label="this.$t('Mirror')" prop="imglist">
          <Select
            v-model="model.imgName"
            :placeholder="this.$t('pleaseInput')"
          >
            <Option
              v-for="item in imglist"
              :value="item.name"
              :key="item.name"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem :label="this.$t('Configure')" prop="profileList">
          <Select
            v-model="model.profile"
            :placeholder="this.$t('pleaseInput')"
          >
            <template v-if="profileList">
              <Option
                v-for="item in profileList"
                :value="item.name"
                :key="item.name"
                >{{ item.name }}</Option
              >
            </template>
          </Select>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            @click="handleSubmit('formValidatex')"
            :loading="loadBtnSuper"
            >{{ $t("SetSuperWorkstation") }}</Button
          >
        </FormItem>
      </Form>
    </Modal>
</template>

<script>
import {
  getImageListx
} from '@/api/wupan'
export default {
  name: 'setSuperModal',
  props: {
    masterIp: {
      type: String,
      default: ''
    },
    showSetSuperModal: {
      type: Boolean,
      default: false
    },
    selfIp: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loadBtnSuper: false,
      model: {
        imgName: '',
        profile: ''
      },
      rule: {},
      imglist: []
    }
  },
  created () {
    this.fetchImgList()
  },
  computed: {
    profileList () {
      let list = this.imglist && this.imglist.filter(item =>
        item['name'] === this.model.imgName)
      if (list.length === 1) {
        list = list[0].profileList
        this.model.profile = list[0].name
      }
      return list
    }
  },
  methods: {
    async fetchImgList () {
      let resp = await getImageListx(this.masterIp)
      if (resp.data.result) {
        this.imglist = resp.data.result.list
        this.model.imgName = this.imglist[0].name
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        let param = {
          ip: this.selfIp,
          image: this.model.imgName,
          profile: this.model.profile
        }
        this.$emit('SetSuper', param)
      })
    },
    handleVisible (show) {
      this.$emit('handleVisible', show)
    }

  }
}
</script>