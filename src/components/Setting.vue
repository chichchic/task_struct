<template>
  <el-drawer custom-class="setting" :model-value="drawerSetting" direction="ltr" size="100%">
    <template v-slot:title>
      <h1>설정</h1>
    </template>
    <div class="menu">
      <p>
        계정 <span>{{ $store.state.user.email }}</span>
      </p>
      <p>
        언어
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
      <p>
        문의하기
        <span>
          <i class="el-icon-arrow-right"></i>
        </span>
      </p>
      <p>
        공지사항
        <span>
          <i class="el-icon-arrow-right"></i>
        </span>
      </p>
      <p>
        계정삭제
        <span>
          <i class="el-icon-arrow-right"></i>
        </span>
      </p>
      <p>
        로그아웃
        <span>
          <i class="el-icon-arrow-right"></i>
        </span>
      </p>
    </div>
    <p>
      지금 까지 will be done과 함께<br />
      완료한 할 일 총 <span>{{ doneCount }}</span> 개
    </p>
  </el-drawer>
</template>
<script>
export default {
  props: {
    drawerSetting: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    doneCount: 33,
    langList: [
      { label: '한국어', lang: 'ko' },
      { label: 'English', lang: 'en' },
    ],
  }),
  watch: {
    drawerSetting(val) {
      if (val) {
        this.doneCount++;
      }
    },
  },
  methods: {
    changeLang(lang) {
      this.$i18n.locale = lang;
    },
  },
};
</script>
<style lang="scss">
.setting {
  padding: 1rem;

  .el-drawer__header {
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
.setting {
  h1 {
    font-size: 2.2rem;
    text-align: center;
  }

  .el-drawer__body > p {
    font-size: 2.2rem;
    text-align: center;
    margin-top: 5rem;

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
    }
  }

  .selected-lang {
    color: #f56e71;
  }
}
</style>
