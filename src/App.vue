<template>
  <Navigation />
  <router-view />
</template>

<script>
import Navigation from "@/components/Navigation.vue";
export default {
  name: "App",
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
  watch: {
    "$i18n.locale": function (newData) {
      document.documentElement.lang = newData;
      if (newData === "ar") {
        document.documentElement.dir = "rtl";
      } else {
        document.documentElement.dir = "ltr";
      }
    },
  },
  mounted() {
    document.documentElement.lang = this.$i18n.locale;
    if (this.$i18n.locale === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight / 100}px`
    );
  },
};
</script>
