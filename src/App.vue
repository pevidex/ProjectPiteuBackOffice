<template>
  <div id="app">
    <router-link :to="{
      name: 'AddRecipe',
      params: { deploy_to: this.deploy_to}
    }">Adicionar receita</router-link>
    <br>
    <router-link :to="{
      name: 'EditRecipes',
      params: { deploy_to: this.deploy_to }
    }" >Editar receitas existentes</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',

  data(){
    return{
      deploy_to: process.env.VUE_APP_DATABASE,
      recipes:[]
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
