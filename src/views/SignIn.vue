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
    const { signIn, signOut } = signInWithGoogle();
    return { signIn, signOut };
  },
  methods: {
    redirectSignIn() {
      const provider = new firebase.auth.GoogleAuthProvider();
      const ismobild = window.matchMedia('only screen and (max-width: 760px)').matches;
      firebase.auth().languageCode = 'ko';
      if (ismobild) {
        firebase.auth().signInWithRedirect(provider);
      } else {
        firebase.auth().signInWithPopup(provider);
      }
    },
  },
};
</script>
