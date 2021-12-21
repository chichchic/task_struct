<template>
  <section class="navigation">
    <div class="logo" @click.prevent="$router.push('/')">
      <img src="@/assets/images/log-willbedone.png" alt="willbedone" />
    </div>
    <p
      class="icon mr-1"
      v-if="isMobileSize && currentRouteName === 'Todo'"
      @click.prevent="$router.push('Calendar')"
    >
      <mdicon name="calendar-month" size="20" />
    </p>
    <p
      class="icon mr-1"
      v-else-if="isMobileSize && currentRouteName === 'Calendar'"
      @click.prevent="$router.push('Todo')"
    >
      <mdicon name="text-box-outline" size="20" />
    </p>
    <p class="icon" @click="openDrawer" :class="{ disable: isDisable }">
      <mdicon name="account" size="20" />
    </p>

    <Setting :drawerSetting="drawerSetting" @close="drawerSetting = false" />
  </section>
</template>
<script>
import Setting from "@/components/Setting.vue";

export default {
  components: {
    Setting,
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    isDisable() {
      return this.$store.state.user.uid === null;
    },
    isMobileSize() {
      return window.matchMedia("only screen and (max-width: 760px)").matches;
    },
  },
  data: () => ({
    drawerSetting: false,
  }),
  methods: {
    openDrawer() {
      if (!this.isDisable) this.drawerSetting = true;
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
    transform: translateX(-50%);
    text-align: center;
    cursor: pointer;
    font-size: 2rem;
    width: 200px;

    img {
      width: 100%;
    }
  }

  .icon {
    cursor: pointer;

    &.disable {
      cursor: inherit;

      span {
        color: #c2c9d1;
      }
    }
  }

  .mr-1 {
    margin-right: 1rem;
  }
}
html[dir="rtl"] {
  .navigation {
    flex-direction: row-reverse;
  }
}
</style>
