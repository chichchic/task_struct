<template>
  <section class="sign-in">
    <el-button @click="redirectSignIn">로그인</el-button>
    <el-button @click="signOut">로그아웃</el-button>
  </section>
</template>
<script>
import signInWithGoogle from '@/components/common/signInWithGoogle.js';
export default {
  setup() {
    const { signIn, signOut } = signInWithGoogle();
    return { signIn, signOut };
  },
  methods: {
    async redirectSignIn() {
      try {
        await this.signIn();
        this.$router.push('Todo');
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
