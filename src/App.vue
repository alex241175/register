<template>
  <v-app>
   <v-app-bar app>
        <v-toolbar-title>
         課程報名
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn text v-if="userIsAuthenticated">{{ userName }}</v-btn>
          <v-btn text v-if="!userIsAuthenticated" @click="signIn">Sign in</v-btn>
          <v-btn text v-if="userIsAuthenticated" @click="signOut">Sign Out</v-btn>
          <v-btn text to="/events" exact>課程</v-btn>
        </v-toolbar-items>
      </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
  computed:{
    userName(){
      return this.$store.getters.user.displayName
    },
    userIsAuthenticated() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    },
  },
  methods:{
    signIn(){  //google sign in
        this.$store.dispatch('signIn')
    },
    signOut(){
        this.$store.dispatch('signOut')
    }
  }
};
</script>
<style>
    .hand{
      cursor: pointer;
    }

</style>
