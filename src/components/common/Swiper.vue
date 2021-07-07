<template>
  <li class="swiper">
    <div class="container" ref="container">
      <div class="main">
        <slot name="main"></slot>
      </div>
      <div class="tail">
        <slot name="tail"></slot>
      </div>
    </div>
  </li>
</template>
<script>
export default {
  props: {
    tailWidth: String,
    isOpen: Boolean,
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.open();
      } else {
        this.close();
      }
    },
  },
  methods: {
    open() {
      // Code for Chrome, Safari, Opera
      this.$refs.container.style.WebkitTransform = `translateX(-${this.tailWidth})`;
      // Code for IE9
      this.$refs.container.style.msTransform = `translateX(-${this.tailWidth})`;
      // Standard syntax
      this.$refs.container.style.transform = `translateX(-${this.tailWidth})`;
    },
    close() {
      // Code for Chrome, Safari, Opera
      this.$refs.container.style.WebkitTransform = `translateX(0)`;
      // Code for IE9
      this.$refs.container.style.msTransform = `translateX(0)`;
      // Standard syntax
      this.$refs.container.style.transform = `translateX(0)`;
    },
  },
};
</script>
<style lang="scss" scoped>
.swiper {
  width: 100%;
  overflow: hidden;

  .container {
    display: flex;
    transition: transform 0.5s ease-out;

    .main {
      flex: 1 0 100%;
    }

    .tail {
      display: flex;
    }
  }
}
</style>
