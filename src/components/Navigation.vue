<template>
  <section class="navigation">
    <div class="logo">LOGO</div>
    <i icon class="el-icon-date"></i>
    <i icon class="el-icon-user-solid"></i>
  </section>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.navigation {
  height: 30px;
  display: flex;
  align-items: center;

  .logo {
    margin-left: 50%;
    margin-right: auto;
    width: 5rem;
    transform: translateX(-50%);
    text-align: center;
  }

  i {
    font-size: 20px;

    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>
