<template>
  <section class="sign-in">
    <h1 class="mb-9">logo</h1>
    <p class="mb-9">
      {{ $t('default.login_wecolme_text_top') }}
      <br />
      <br />
      <b>{{ $t('default.login_wecolme_text_impress') }}</b
      >{{ $t('default.login_wecolme_text_impress_postfix') }}
      <br />
      {{ $t('default.login_wecolme_text_bottom') }}
    </p>

    <button class="sign-in-button" @click="redirectSignIn">
      <img src="@/assets/images/googleSigninButton.png" alt="Google sign in" />
      <div class="img-overlay"></div>
    </button>
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
      const ismobild = window.matchMedia('only screen and (max-width: 760px)').matches;
      try {
        await this.signIn();
        if (ismobild) {
          this.$router.push('Todo');
        } else {
          this.$router.push('Desktop');
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.sign-in {
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    font-size: 20px;
    text-align: center;
  }

  .mb-9 {
    margin-bottom: 90px;
  }

  .sign-in-button {
    border: none;
    cursor: pointer;
    position: relative;
    display: block;
    width: 191px;
    height: 46px;
    background-color: transparent;

    img {
      width: 100%;
    }

    &:hover .img-overlay {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 3px;
      background-color: rgba(128, 128, 128, 0.3);
    }
  }
}
</style>
