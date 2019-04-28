<template>
<div class="container">
    <div class="containerHeader">
      <p>业主平台</p>
    </div>

<div class="main">
    <div class="header">
    <span>1.手机验证</span>
    <span>2.填写用户信息</span>
    <span>3.注册完成</span>
    </div>
    <div class="footer">
          <Form ref="formInline" :model="formItem" :rules="ruleInline" :label-width="80" label-position="right" inline>
         <FormItem :label="$t('PhoneNumber')">
            <Input v-model="formItem.input" placeholder="Enter something..." style="width:400px;" size="large"/>
        </FormItem>
        <div>
         <FormItem :label="$t('PhoneNumber')">
            <Input v-model="formItem.input" placeholder="Enter something..." style="width:400px;" size="large"/>
        </FormItem>
        </div>
       
    </Form>
    </div>
</div>

    
   <router-link to="/login">back</router-link>
  
  </div>
</template>
<script>
export default {
  name: 'enroll',
  data () {
    return {
      formItem: {
        input: ''
      }
    }
  }

}
</script>

<style scoped>
    .main{
        height: 500px;
    }
    .containerHeader {
        height: 100px;
        margin-bottom:20px;
        border-bottom: 1px solid;
    }
    p{
        line-height: 100px;
        color:12px;
    }
    span {
        font-size: 16px;
        height: 40px;
        border-bottom:1px solid black;
        flex:1;
        text-align: center;
        padding-bottom:20px;
    }
    span:hover{
        border-bottom:4px solid #F87C00;
    }
    .header{
        width: 1200px;
        margin:0 auto;
        display: flex;
        justify-content: space-between;
    }
    .footer{
        border: 1px solid;
        text-align: center
    }
   Form{
       margin-top:50px;
   }
</style>
