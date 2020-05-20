<template>
    <header class="client_list_header">
        <Input   style="width:200px;margin-right:10px;" search enter-button :placeholder="$t('pleaseInput') + $t('MachineName') + $t('-ip')" />
        <Button style="margin-right:10px;" type="primary"  >{{
          $t("Refresh")
        }}</Button>
        <Button style="margin-right:10px;" type="primary" >{{
          $t("Add")
        }}</Button>
        <Button style="margin-right:10px;" type="primary" >{{
          $t("Edit")
        }}</Button>
        <Button  style="margin-right:10px;" type="error" >{{
          $t("Delete")
        }}</Button>
    </header>
</template>

<script>
export default {
  name: 'clientListHeader'

}
</script>
<style lang="scss" scoped>
 .client_list_header {
     display:flex;
 }
</style>