<template>
  <section class="navigation">
    <div class="logo" @click.prevent="$router.push('/')">LOGO</div>
    <i
      icon
      class="el-icon-date"
      v-if="isMobileSize && currentRouteName === 'Todo'"
      @click.prevent="$router.push('Calendar')"
    ></i>
    <i
      icon
      class="el-icon-tickets"
      v-else-if="isMobileSize && currentRouteName === 'Calendar'"
      @click.prevent="$router.push('Todo')"
    ></i>
    <i
      icon
      class="el-icon-user-solid"
      @click="drawerSetting = true"
      :class="{ disable: $store.state.user.uid === null }"
    ></i>
    <Setting :drawerSetting="drawerSetting" @close="drawerSetting = false" />
  </section>
</template>
<script>
import Setting from '@/components/Setting.vue';

export default {
  components: {
    Setting,
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    isMobileSize() {
      return window.matchMedia('only screen and (max-width: 760px)').matches;
    },
  },
  data: () => ({
    drawerSetting: false,
  }),
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
    cursor: pointer;
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
