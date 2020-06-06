<template>
  <div class="sidebar" data-color="purple" data-background-color="white">
        <div class="logo">
            Project Piteu
            Backoffice 
        </div>
        <div class="sidebar-wrapper">
          <ul class="nav">
            <router-link v-for="routes in links" 
            v-bind:key="routes.id"
            :to="`${routes.page}`">
            <li class="nav-item">
              <a class="nav-link" href="#0">
                <i class="material-icons">{{routes.icon}}</i>
                <p>{{routes.text}}</p>
              </a>
              <ul class="subnav-content">
                <router-link v-for="subroutes in routes.children" 
                v-bind:key="subroutes.id"
                :to="`${subroutes.page}`">
                <li class="sub-nav-item">
                    <p>{{subroutes.text}}</p>
                </li>
                </router-link>
              </ul>
            </li>
            </router-link>
            <!-- your sidebar here -->
          </ul>
        </div>
      </div>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {
      links: [
        {
          id: 0,
          text: 'Home',
          page:'/',
          icon: 'home'
        },
        {
          id: 1,
          text: 'Receitas',
          page:'/recipes',
          icon: 'local_dining',
          children: [
            {id: 10,
            page: '/addRecipe',
            text: 'Add Recipe',
            }, 
            {id: 11,
            page: '/validateRecipe',
            text: 'Validate Recipe',
            },
          ]
        },
        {
          id: 2,
          text: 'Ingredientes',
          page:'/ingredients',
          icon: 'local_dining',
          children: [
            {id: 12,
            page: '/validateIngredient',
            text: 'Validate Ingredient',
            }]
        },
        {
          id: 3,
          text: 'Exportar data',
          page:'/exportData',
          icon: 'bar_chart'
        }
      ]
    }
  }
}
</script>