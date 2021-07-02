<template>
  <div class="about">
    <h1>This is an account page</h1>
    <button @click="verify">Verify</button> <br />
    {{ verifyState }}
    <button @click="loginWithGoogle" v-if="!$store.state.fireUser">Login</button>
    <br />
    <br />
    <button @click="signOut" v-if="$store.state.fireUser">Log Out</button>
    <p v-if="$store.state.fireUser">
      user name: {{ $store.state.fireUser.displayName }} <br />
      user email: {{ $store.state.fireUser.email }} <br />
      if user email verified: {{ $store.state.fireUser.emailVerified }} <br />
      user photo: <img :src="$store.state.fireUser.photoURL" />
    </p>
  </div>
</template>

<script>
import firebase from 'firebase';
export default {
  data() {
    return {
      verifyState: 'not verified',
    };
  },
  methods: {
    async loginWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().languageCode = 'ko';
      this.loading = true;
      try {
        await firebase.auth().signInWithPopup(provider);
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
        console.log('login');
      }
    },
    signOut() {
      firebase.auth().signOut();
    },
    async verify() {
      console.log(this.$store.state.fireUser);
      try {
        const tk = await firebase.auth().currentUser.getIdToken(false);
        if (tk) {
          console.log('verified', tk);
          this.verifyState = 'verified';
        } else {
          console.log('can not verify');
        }
      } catch (err) {
        console.log('failed to verify user token: ', err);
      } finally {
        console.log('finally');
      }
    },
  },
};
</script>
