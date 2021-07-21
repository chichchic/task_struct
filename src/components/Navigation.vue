<template>
  <section class="navigation">
    <div class="logo">LOGO</div>
    <i icon class="el-icon-date" v-if="currentRouteName === 'Todo'" @click.prevent="$router.push('Calendar')"></i>
    <i
      icon
      class="el-icon-tickets"
      v-else-if="currentRouteName === 'Calendar'"
      @click.prevent="$router.push('Todo')"
    ></i>
    <i icon class="el-icon-user-solid" :class="{ disable: $store.state.user.uid === null }"></i>
  </section>
</template>
<script>
export default {
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
};
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

    cursor: pointer;

    &.disable {
      cursor: inherit;
      color: #c2c9d1;
    }
  }
}
</style>
