import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        themes: {
            light: {
              primary: '#24a19c',
              secondary: '#6ebfb5',
              accent: '#ffc7c7',
              error: '#ff5f40',
              text: '#999999',
              'google-red': '#df4b37'
            },
          },
    }
});
