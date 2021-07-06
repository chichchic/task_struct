<template>
  <!-- <el-button type="danger" icon="el-icon-s-unfold" circle @click="drawer = true"></el-button> -->
  <router-view />
  <!-- <Menu :drawer="drawer" @changeDrawer="changeDrawer" /> -->
</template>

<script>
// NOTE: side-menu 기획 수정
// import Menu from '@/components/Menu.vue';
export default {
  name: 'App',
  components: {
    // Menu,
  },
  data: () => ({
    drawer: false,
  }),
  methods: {
    changeDrawer(status) {
      this.drawer = status;
    },
  },
};
</script>
