<template>
  <el-drawer
    custom-class="delete-account"
    :model-value="deleteDrawer"
    @update:modelValue="$emit('close')"
    direction="rtl"
    :size="drawerSize"
  >
    <template v-slot:title>
      <h1>{{ $t('default.delete_account_title') }}</h1>
    </template>
    <p class="description">
      {{ $t('default.delete_account_guide_0') }}<br />
      {{ $t('default.delete_account_guide_1') }}
    </p>
    <ol>
      <li>
        {{ $t('default.delete_account_guide_2') }} <strong>{{ $t('default.delete_account_guide_bold_0') }}</strong
        >{{ $t('default.delete_account_guide_3') }}
      </li>
      <li>
        {{ $t('default.delete_account_guide_4') }} <strong>{{ $t('default.delete_account_guide_bold_1') }}</strong
        >{{ $t('default.delete_account_guide_5') }}
      </li>
    </ol>
    <p class="warning">
      {{ $t('default.delete_account_guide_final_0') }}<br />
      <span class="red">{{ $t('default.delete_account_guide_red') }}</span
      >{{ $t('default.delete_account_guide_final_1') }}
    </p>
    <p class="button-content">
      <button @click="deleteUserCollection">{{ $t('default.delete_account_btn') }}</button>
    </p>
  </el-drawer>
</template>
<script>
export default {
  props: {
    deleteDrawer: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close'],
  computed: {
    uid() {
      return this.$store.state.user.uid;
    },
    drawerSize() {
      if (!window.matchMedia('only screen and (max-width: 760px)').matches) {
        return '30%';
      } else {
        return '100%';
      }
    },
  },
  methods: {
    async getWithdrawStatic() {
      const { $firestore, uid } = this;
      const userInfo = await $firestore.collection('users').doc(uid).get();
      const todoList = await $firestore.collection('users').doc(uid).collection('todoListItem').get();
      const createdAt = new Date(userInfo.data().createdAt.seconds);
      const withdrawAt = new Date();
      const doneCount = userInfo.data().doneCount;
      const listCount = todoList.size;
      await $firestore.collection('withdrawStatic').doc().set({ createdAt, withdrawAt, doneCount, listCount });
    },
    async deleteUserCollection() {
      const { $firestore, uid, $store } = this;
      $store.commit('base/setLoading', true);
      try {
        await this.getWithdrawStatic();
        //NOTE: 하위 collection은 지워지지 않음(todolistItem).
        //NOTE: 작업하지 못한 이유: https://firebase.google.com/docs/firestore/solutions/delete-collections.
        await $firestore.collection('users').doc(uid).delete();
        this.$analytics.logEvent('withdraw_btn');
        this.$router.push('SignIn');
      } catch (e) {
        console.error(e);
      } finally {
        $store.commit('base/setLoading', false);
      }
    },
  },
};
</script>
<style lang="scss">
.delete-account {
  padding: 2rem 1rem 1rem;

  .el-drawer__header {
    padding: 0;
    flex-direction: row-reverse;
    color: #212121;
  }

  .el-icon-close::before {
    font-family: 'Material Icons', sans-serif;
    content: 'arrow_back';
    -webkit-font-feature-settings: 'liga' 1;
    -moz-font-feature-settings: 'liga' 1;
    font-feature-settings: 'liga' 1;
  }
}
</style>
<style lang="scss" scoped>
.delete-account {
  h1 {
    font-size: 2.2rem;
    text-align: center;
  }

  .description {
    font-size: 1.8rem;
  }

  ol {
    margin: 25px 0 45px;
    list-style: none;
    font-size: 1.8rem;
  }

  .warning {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;
  }

  .button-content {
    text-align: center;

    button {
      width: 25rem;
      height: 4rem;
      background: #ededed;
      border: none;
      font-size: 2rem;
      box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.25);
      line-height: 4rem;
      border-radius: 3rem;
      font-weight: bold;
    }
  }

  .red {
    color: red;
  }
}
</style>
