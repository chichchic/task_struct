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
  ElTag,
} from "element-plus";
import ko from "element-plus/lib/locale/lang/ko";
import ar from "element-plus/lib/locale/lang/ar";
import "@/assets/style/element-variables.scss";

export default (app) => {
  app.use(ko);
  app.use(ar);
  app.use(ElCheckbox);
  app.use(ElCheckboxButton);
  app.use(ElCheckboxGroup);
  app.use(ElInput);
  app.use(ElTabs);
  app.use(ElTabPane);
  app.use(ElButton);
  app.use(ElDrawer);
  app.use(ElSpace);
  app.use(ElTag);
};
