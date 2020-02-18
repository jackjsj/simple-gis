import Vue from 'vue';
import {
  Form,
  FormItem,
  Message,
  Input,
  Button,
  Loading,
  Card,
  Notification,
  Checkbox,
  CheckboxGroup,
  MessageBox,
} from 'element-ui';

Vue.use(Input)
  .use(Button)
  .use(Form)
  .use(FormItem)
  .use(Card)
  .use(Checkbox)
  .use(CheckboxGroup);

Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading.service;
Vue.prototype.$nofity = Notification;
Vue.prototype.$alert = MessageBox.alert;
