<template>
  <el-drawer title="Logo" :modelValue="drawer" @close="$emit('changeDrawer', false)" direction="ltr">
    <section class="menu">
      <el-button type="text" v-for="{ name, label } in routes" :key="label" @click="moveRoute(name)">{{
        label
      }}</el-button>
      <div class="space"></div>
      <div>
        <span>언어: </span>
        <el-space spacer="|">
          <el-button type="text" v-for="lang in langList" :key="lang" @click="changeLang(lang)">{{ lang }}</el-button>
        </el-space>
      </div>
      <el-button type="text" @click="moveRoute('setting')">setting</el-button>
    </section>
  </el-drawer>
</template>
<script>
export default {
  name: 'Menu',
  props: {
    drawer: Boolean,
  },
  emits: ['changeDrawer'],
  data: () => ({
    routes: [
      { name: 'todo', label: 'task' },
      { name: 'todo', label: 'done' },
    ],
    langList: ['ko', 'en'],
  }),
  methods: {
    moveRoute(name) {
      this.$router.push(name);
      this.$emit('changeDrawer', false);
    },
    changeLang(lang) {
      this.$i18n.locale = lang;
      this.$emit('changeDrawer', false);
    },
  },
};
</script>
<style lang="scss" scoped>
.menu {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  color: black;

  .space {
    margin: auto 0;
  }

  & .el-button + .el-button {
    margin: 0;
  }
}
</style>
