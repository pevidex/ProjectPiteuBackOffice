import Vue from 'vue'
import VueRouter from 'vue-router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Recipes from './components/recipe/Recipes.vue'
import ValidateRecipe from './components/recipe/ValidateRecipe.vue'
import AddRecipe from './components/recipe/AddRecipe.vue'
import ExportData from './components/exportData/ExportData.vue'
import Ingredients from './components/ingredient/Ingredients.vue'
import ValidateIngredient from './components/ingredient/ValidateIngredient.vue'
import Home from './components/home/Home.vue'
import Login from './components/auth/Login.vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import Axios from 'axios'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Vuetify);

Vue.prototype.$http = Axios;
const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}

const routes = [
  { path: '/', name:'Home', component: Home, props: true, meta: {requiresAuth: true}},
  { path:'/recipes', name:'Recipe', component:  Recipes, props: true, meta: {requiresAuth: true}},
  { path: '/addRecipe', name:'AddRecipe', component: AddRecipe, props: true},
  { path: '/validateRecipe', name:'ValidateRecipe', component: ValidateRecipe, props: true},
  { path: '/exportData',  name:'ExportData', component: ExportData, props: true, meta: {requiresAuth: true}},
  { path: '/ingredients',  name:'Ingredients', component: Ingredients, props: true, meta: {requiresAuth: true}},
  { path: '/validateIngredient', name:'ValidateIngredient', component: ValidateIngredient, props: true},
  { path: '/login',  name:'Login', component: Login, props: true}
]

const router = new VueRouter({
  //link active class not working
  linkActiveClass: "active",
  linkExactActiveClass: 'active',
  routes
});

export default router

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')