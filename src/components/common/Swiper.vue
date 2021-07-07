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
    tailWidth: Number,
    isOpen: Boolean,
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.open(-this.tailWidth);
      } else {
        this.close();
      }
    },
  },
  mounted() {
    let startPoint = null;
    const touchmove = (e) => {
      const dif = Math.floor(e.touches[0].pageX - startPoint);
      if (dif > 0) {
        this.close();
      } else {
        this.open(dif);
      }
    };
    this.$refs.container.addEventListener('touchstart', (e) => {
      startPoint = e.touches[0].pageX;
      this.$refs.container.addEventListener('touchmove', touchmove);
    });

    this.$refs.container.addEventListener('touchend', (e) => {
      this.$refs.container.removeEventListener('touchmove', touchmove);
      const dif = Math.floor(e.changedTouches[0].pageX - startPoint);
      if (dif < Math.floor(-this.tailWidth / 2)) {
        this.open(-this.tailWidth);
      } else {
        this.close();
      }
    });
  },
  methods: {
    open(width = null) {
      if (width < -this.tailWidth) {
        width = -this.tailWidth;
      }
      this.$refs.container.style.WebkitTransform = `translateX(${width}px)`;
      this.$refs.container.style.msTransform = `translateX(${width}px)`;
      this.$refs.container.style.transform = `translateX(${width}px)`;
    },
    close() {
      this.$refs.container.style.WebkitTransform = `translateX(0)`;
      this.$refs.container.style.msTransform = `translateX(0)`;
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
      flex: 1 0 calc(100% + 1px);
    }

    .tail {
      display: flex;
    }
  }
}
</style>
