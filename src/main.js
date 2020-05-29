import Vue from 'vue'
import VueRouter from 'vue-router';
import Recipes from './components/recipe/Recipes.vue'
import ExportData from './components/exportData/ExportData.vue'
import Ingredients from './components/ingredient/Ingredients.vue'
import Home from './components/home/Home.vue'
import Login from './components/auth/Login.vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import Axios from 'axios'
import store from './store'

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
  { path:'/recipes', name:'AddRecipe', component:  Recipes, props: true, meta: {requiresAuth: true}},
  { path: '/exportData',  name:'ExportData', component: ExportData, props: true, meta: {requiresAuth: true}},
  { path: '/ingredients',  name:'Ingredients', component: Ingredients, props: true, meta: {requiresAuth: true}},
  { path: '/login',  name:'Login', component: Login, props: true}
]

const router = new VueRouter({
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