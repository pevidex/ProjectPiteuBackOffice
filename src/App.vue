<template>
  <div class="wrapper " id="app">
    <Login v-if="!isLoggedIn"/>
    <div v-else>
    <Navigation></Navigation>
        <div class="main-panel">
          <!-- Navbar -->
          <nav class="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
            <div class="container-fluid">
              <div class="navbar-wrapper">
                <a class="navbar-brand" href="javascript:;">Dashboard</a>
              </div>
              <button class="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                <span class="sr-only">Toggle navigation</span>
                <span class="navbar-toggler-icon icon-bar"></span>
                <span class="navbar-toggler-icon icon-bar"></span>
                <span class="navbar-toggler-icon icon-bar"></span>
              </button>
              <div class="collapse navbar-collapse justify-content-end">
                <ul class="navbar-nav">
                  <li class="nav-item">
                    <a class="nav-link" href="javascript:;">
                      <i class="material-icons">notifications</i> Notifications
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="javascript:;" v-on:click="logout()">
                      <i class="material-icons">exit_to_app</i> Logout
                    </a>
                  </li>
                  <!-- your navbar here -->
                </ul>
              </div>
            </div>
          </nav>
          <!-- End Navbar -->
          <div class="content">
            <div class="container-fluid">
              <noscript>
                <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
              </noscript>
              <div class="container">
                  <div class="row">
                    <div class="col">
                      <router-view/>
                    </div>
                  </div>
              </div>
            </div>
          </div>
          <footer class="footer">
            <div class="container-fluid">
              <nav class="float-left">
                <ul>
                  <li>
                    <a href="https://github.com/pevidex/ProjectPiteuBackOffice">
                      Github
                    </a>
                  </li>
                </ul>
              </nav>
              <!-- your footer here -->
            </div>
          </footer>
        </div>
    </div>
  </div>
</template>

<script>
import Navigation from './components/Navigation'
import Login from './components/auth/Login'
export default {
  user: null,
  name: 'app',
  components: {
    'Login': Login,
    'Navigation': Navigation
  },
  computed : {
      isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
      }
    },
}
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
</style>