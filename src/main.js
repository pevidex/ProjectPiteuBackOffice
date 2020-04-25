import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import AddRecipe from './components/add/AddRecipe.vue'
import Recipes from './components/edit/Recipes.vue'
import ExportData from './components/exportData/ExportData.vue'
import AddIngredients from './components/add/AddIngredients.vue'
import Vuetify from 'vuetify';

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Vuetify);

const routes = [
  { path:'/add', name:'AddRecipe', component:  AddRecipe, props: true},
  { path: '/edit',  name:'EditRecipes', component: Recipes, props: true},
  { path: '/exportData',  name:'ExportData', component: ExportData, props: true},
  { path: '/addIngredients',  name:'AddIngredients', component: AddIngredients, props: true}
]

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
