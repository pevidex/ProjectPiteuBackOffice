<template>
  <div>
    <v-app-bar
      color="dark accent-4"
      dense
      dark
    >
    <v-spacer></v-spacer>
      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon v-on:click="logout()">mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>

export default {
  name: 'Toolbar',
  methods: {
    logout: function () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/login')
      })
    }
  },
};
</script>

