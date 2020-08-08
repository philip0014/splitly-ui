import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Router from 'vue-router'
import App from './App.vue'
import Home from './components/Home.vue'
import Register from './components/auth/Register.vue'
import SignIn from './components/auth/SignIn.vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import vuetify from './plugins/vuetify';

var VueCookie = require('vue-cookie');

Vue.use(Vuelidate)
Vue.use(Router)
Vue.use(VueCookie);
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false

const DEFAULT_TITLE = 'Splitly'
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: DEFAULT_TITLE + ' | Home'
      }
    },
    {
      path: '/friends',
      name: 'Friends',
      component: Home,
      meta: {
        title: DEFAULT_TITLE + ' | Friends'
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Home,
      meta: {
        title: DEFAULT_TITLE + ' | Profile'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        title: DEFAULT_TITLE + ' | Register'
      }
    },
    {
      path: '/sign-in',
      name: 'Sign In',
      component: SignIn,
      meta: {
        title: DEFAULT_TITLE + '| Sign In'
      }
    }
  ]
})

router.afterEach((to) => {
  Vue.nextTick(() => {
      document.title = to.meta.title || DEFAULT_TITLE;
  });
});

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
