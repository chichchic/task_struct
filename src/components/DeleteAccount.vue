<template>
  <el-drawer
    custom-class="delete-account"
    :model-value="deleteDrawer"
    @update:modelValue="$emit('close')"
    direction="rtl"
    size="30%"
  >
    <template v-slot:title>
      <h1>계정 삭제</h1>
    </template>
    <p class="description">
      계정을 삭제하시겠습니까?<br />
      아래 유의사항을 반드시 확인해주세요.
    </p>
    <ol>
      <li>1. 지금까지 등록한 <strong>모든 할 일이 삭제</strong>됩니다.</li>
      <li>2. 삭제된 할 일은 <strong>복구가 불가</strong>합니다.</li>
    </ol>
    <p class="warning">
      “계정 삭제하기" 버튼을 누르시면<br />
      계정이 <span class="red">바로 삭제</span>됩니다.
    </p>
    <p class="button-content">
      <button @click="deleteUserCollection">계정 삭제하기</button>
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
    content: '\2190';
    font-size: 2.2rem;
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
