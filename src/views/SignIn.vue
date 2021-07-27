<template>
  <section class="sign-in">
    <el-button @click="redirectSignIn">로그인</el-button>
    <el-button @click="signOut">로그아웃</el-button>
  </section>
</template>
<script>
import firebase from 'firebase/app';
import signInWithGoogle from '@/components/common/signInWithGoogle.js';
export default {
  setup() {
    const { signIn, signInRedirect, signOut } = signInWithGoogle();
    return { signIn, signInRedirect, signOut };
  },
  methods: {
    redirectSignIn() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    },
  },
};
</script>
