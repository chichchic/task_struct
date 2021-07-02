<template>
  <section class="setting">
    <h1>Setting</h1>
    <el-button type="text">{{ $t('default.set_inquiry') }}</el-button>
    <el-button type="text">공지</el-button>
    <el-button type="text" @click="$router.push('withdraw')">{{ $t('default.set_withdraw') }}</el-button>
  </section>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.setting {
  display: flex;
  flex-direction: column;
  align-items: center;

  & h1 {
    font-size: 10rem;
  }

  & .el-button--text {
    font-size: 10rem;
    color: #333;
  }
}
</style>
