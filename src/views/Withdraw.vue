<template>
  <section class="withdraw">
    <h1>{{ $t('default.set_withdraw') }}</h1>
    <p>유의 사항</p>
    <el-button type="text">삭제하기</el-button>
  </section>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.withdraw {
  & h1 {
    font-size: 10rem;
  }

  & .el-button--text {
    font-size: 10rem;
    color: #333;
  }
}
</style>
