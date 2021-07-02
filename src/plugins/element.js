import {
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElInput,
  ElTabs,
  ElTabPane,
  ElButton,
  ElDrawer,
  ElSpace,
} from 'element-plus';
import lang from 'element-plus/lib/locale/lang/ko';
import locale from 'element-plus/lib/locale';
import '@/assets/style/element-variables.scss';

export default (app) => {
  locale.use(lang);
  app.use(ElCheckbox);
  app.use(ElCheckboxButton);
  app.use(ElCheckboxGroup);
  app.use(ElInput);
  app.use(ElTabs);
  app.use(ElTabPane);
  app.use(ElButton);
  app.use(ElDrawer);
  app.use(ElSpace);
};
