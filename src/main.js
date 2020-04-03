import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import AddRecipe from './components/add/AddRecipe.vue'
import Recipes from './components/edit/Recipes.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

const routes = [
  { path:'/add', name:'AddRecipe', component:  AddRecipe, props: true},
  { path: '/edit',  name:'EditRecipes', component: Recipes, props: true}
]

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
