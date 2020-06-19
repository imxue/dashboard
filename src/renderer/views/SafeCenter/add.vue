<template>
 <Form :model="form">
    <FormItem
        v-for="(item, index) in form"
        :key="index"
        :prop="item.filed"
        :label="item.filed">
        <Input type="text" v-model="item.value" placeholder="Enter something..." :key="index" />
    </FormItem>
  <FormItem>
            <Button type="primary" @click="handleSubmit('formCustom')">Submit</Button>
            <Button @click="handleReset('formCustom')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
</template>


<script>
import { addSafeStrategy } from '../../api/common'
export default {
  name: 'add',
  props: ['code', 'addItem'],
  data () {
    return {
      form: this.addItem
    }
  },
  methods: {
    handleSubmit () {
      console.log(this.form)

      addSafeStrategy()
    },
    handleReset () {}
  }
}
</script>

