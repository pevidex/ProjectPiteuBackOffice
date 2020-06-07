<template>
  <v-app>
    <Login v-if="!isLoggedIn"/>
    <div v-else>
      <Toolbar></Toolbar>
      <Navigation 
        :collapsed="collapsed"
        :set-collapsed="setCollapsed"
        />
      <div id="main-content" :class="{'collapsed' : collapsed}">
        <v-content>
          <div class="container">
            <div class="row">
              <div class="col">
                <router-view/>
              </div>
            </div>
          </div>
        </v-content>
      </div>
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
    collapsed: true,
  }),
  computed : {
      isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
    },
  methods : {
    setCollapsed(collapse){
      this.collapsed=collapse
    }
  }
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
  padding-left: 350px;
  transition: 0.3s ease;
}
#main-content.collapsed {
  padding-left: 50px;
}
</style>
