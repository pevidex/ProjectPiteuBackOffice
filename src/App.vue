<template>
  <v-app>
    <Login v-if="!isLoggedIn"/>
    <div v-else>
      <Navigation/>
      <Toolbar/>
      <v-content id="main-content">
        <div class="container">
          <div class="row">
            <div class="col">
              <router-view/>
            </div>
          </div>
        </div>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import Navigation from './components/Navigation';
import Toolbar from './components/Toolbar';
import Login from './components/Login';

export default {
  name: 'App',

  components: {
    Navigation,
    Toolbar,
    Login,
  },

  data: () => ({
    //
  }),
  computed : {
      isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
    },
};
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#main-content {
  margin-left: 50px;
}
</style>
