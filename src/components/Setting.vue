<template>
  <el-drawer
    custom-class="setting"
    :model-value="drawerSetting"
    @update:modelValue="$emit('close')"
    direction="rtl"
    :size="drawerSize"
  >
    <template v-slot:title>
      <h1>{{ $t("default.set_title") }}</h1>
    </template>
    <div class="menu">
      <p>
        {{ $t("default.set_account") }}
        <span>{{ $store.state.user.email }}</span>
      </p>
      <p>
        {{ $t("default.set_lang") }}
        <el-space spacer="|">
          <el-button
            type="text"
            v-for="{ label, lang } in langList"
            :key="lang"
            :class="{ 'selected-lang': $i18n.locale === lang }"
            @click="changeLang(lang)"
            >{{ label }}</el-button
          >
        </el-space>
      </p>
      <a href="https://open.kakao.com/o/spd4owqd" target="_blank">
        <p class="cursor">
          {{ $t("default.set_inquiry") }}
          <span class="icon">
            <mdicon name="chevron-right" size="20" />
          </span>
        </p>
      </a>
      <a
        target="_blank"
        href="https://carrote.notion.site/will-be-done-6543e1180b4847b88554ff63d66cd920"
      >
        <p class="cursor">
          {{ $t("default.set_notice") }}
          <span class="icon">
            <mdicon name="chevron-right" size="20" />
          </span>
        </p>
      </a>
      <p class="cursor" @click="openWithdrawer">
        {{ $t("default.set_withdraw") }}
        <span class="icon">
          <mdicon name="chevron-right" size="20" />
        </span>
      </p>
      <p class="cursor" @click="doSignOut">
        {{ $t("default.set_logout") }}
        <span class="icon">
          <mdicon name="chevron-right" size="20" />
        </span>
      </p>
    </div>
    <p class="summary">
      {{ $t("default.summary_text") }} <br />
      {{ $t("default.summary_count", { doneCount }) }}
    </p>
  </el-drawer>
  <DeleteAccount :deleteDrawer="deleteDrawer" @close="deleteDrawer = false" />
</template>
<script>
import signInWithGoogle from "@/components/common/signInWithGoogle.js";

import DeleteAccount from "@/components/DeleteAccount.vue";
export default {
  components: {
    DeleteAccount,
  },
  emits: ["close"],
  props: {
    drawerSetting: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const { signOut } = signInWithGoogle();
    return { signOut };
  },
  computed: {
    uid() {
      return this.$store.state.user.uid;
    },
    drawerSize() {
      if (!window.matchMedia("only screen and (max-width: 760px)").matches) {
        return "30%";
      } else {
        return "100%";
      }
    },
  },
  data: () => ({
    doneCount: 0,
    langList: [
      { label: "Korean", lang: "ko" },
      { label: "English", lang: "en" },
      { label: "Arabic", lang: "ar" },
    ],
    deleteDrawer: false,
  }),
  watch: {
    async drawerSetting(val) {
      if (val) {
        try {
          const { $firestore, uid } = this;
          const userData = await $firestore.collection("users").doc(uid).get();
          this.doneCount = userData.data().doneCount;
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
  methods: {
    changeLang(lang) {
      this.$analytics.logEvent("language", { language: lang });
      this.$i18n.locale = lang;
    },
    doSignOut() {
      this.$emit("close");
      this.signOut();
      this.$router.push("SignIn");
    },
    openWithdrawer() {
      this.$analytics.logEvent("withdraw");
      this.deleteDrawer = true;
    },
  },
};
</script>
<style lang="scss">
.setting {
  padding: 2rem 1rem 1rem;

  .el-drawer__header {
    padding: 0;
    flex-direction: row-reverse;
    color: #212121;
  }

  .el-icon-close::before {
    font-family: "Material Icons", sans-serif;
    content: "arrow_back";
    -webkit-font-feature-settings: "liga" 1;
    -moz-font-feature-settings: "liga" 1;
    font-feature-settings: "liga" 1;
  }
}
</style>

<style lang="scss" scoped>
.setting {
  h1 {
    font-size: 2.2rem;
    text-align: center;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .el-drawer__body > p {
    font-size: 2.2rem;
    text-align: center;
    margin-top: 5rem;

    &.summary {
      font-size: 1.8rem;
    }

    span {
      color: #f56e71;
    }
  }

  .menu {
    p {
      color: #333;
      height: 5rem;
      line-height: 5rem;
      border-bottom: 1px solid #f1f1f1;
      font-size: 1.4rem;
      display: flex;
      justify-content: space-between;

      &.cursor {
        cursor: pointer;
      }

      .icon {
        color: #d0d0d0;
      }
    }
  }

  .selected-lang {
    color: #f56e71;
  }

  .pointer {
    cursor: pointer;
  }
}
</style>
