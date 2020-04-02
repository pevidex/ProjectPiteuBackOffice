<template>
  <div id="app">
    <AddRecipe />
    <Recipes v-bind:recipes="recipes" v-on:del-recipe="deleteRecipe"/>
  </div>
</template>

<script>
import Recipes from './components/Recipes.vue'
import AddRecipe from './components/AddRecipe.vue'
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

export default {
  name: 'App',
  components: {
    Recipes,
    AddRecipe
  },
  data(){
    return{
      recipes:[
        {
          id: 1,
          name: "Bacalhau à Brás"
        },
        {
          id:2,
          name: "Bolo de Bolacha"
        }
      ]
    }
  },
  methods: {
    deleteRecipe(id){
      this.recipes = this.recipes.filter(recipes => recipes.id != id)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
