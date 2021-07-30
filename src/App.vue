<template>
  <Navigation />
  <router-view />
</template>

<script>
import Navigation from '@/components/Navigation.vue';
export default {
  name: 'App',
  components: {
    Navigation,
  },
  data: () => ({
    drawer: false,
  }),
  methods: {
    changeDrawer(status) {
      this.drawer = status;
    },
  },
  mounted() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight / 100}px`);
  },
};
</script>
