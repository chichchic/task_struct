<template>
  <div class="swiper">
    <div class="container" ref="container">
      <div class="main">
        <slot name="main"></slot>
      </div>

      <div class="tail">
        <slot name="tail"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tailWidth: Number,
  },
  watch: {
    tailWidth(newVal) {
      if (newVal > 0) {
        newVal = 0;
      }
      this.translate(newVal);
    },
  },
  methods: {
    translate(width) {
      this.$refs.container.style.WebkitTransform = `translateX(${width}px)`;
      this.$refs.container.style.msTransform = `translateX(${width}px)`;
      this.$refs.container.style.transform = `translateX(${width}px)`;
    },
  },
};
</script>
<style lang="scss" scoped>
.swiper {
  width: 100%;
  height: 62px;
  position: relative;
  overflow-y: visible;
  overflow-x: hidden;

  .container {
    width: 100%;
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    transition: transform 0.5s;
    will-change: transform;

    .main {
      flex: 1 0 calc(100% + 1px);
    }

    .tail {
      display: flex;
    }
  }
}
</style>
