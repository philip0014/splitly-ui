<template>
  <v-app>
    <v-row v-if="isLoggedIn" no-gutters class="pa-2">
      <v-col md="2">
        <SideNav fromParent="accessToken" v-on:menuChanged="menuChanged"/>
      </v-col>
      <VLine/>
    </v-row>
    <Auth v-on:signedIn="signIn" v-else/>
  </v-app>
</template>

<script>
import SideNav from './components/SideNav';
import VLine from './components/VLine';
import Auth from './components/auth/Auth';
// import { apiHelper } from './utilities/ApiHelper'

export default {
  name: 'App',

  components: {
    SideNav,
    VLine, 
    Auth,
  },

  data: () => ({
    isLoggedIn: false,
    accessToken: '',
    profile: {}
  }),
  methods: {
    signIn: function (accessToken, profile) {
      this.isLoggedIn = true
      this.accessToken = accessToken
      this.profile = profile
    },
    menuChanged: function (menuIndex) {
      console.log(menuIndex)
      switch(menuIndex) {
        case 1:
          // apiHelper.get('custom URL')
          break
      }
    }
  }
};
</script>