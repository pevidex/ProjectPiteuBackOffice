<template>
  <sidebar-menu :menu="menu" />
</template>
 
<script>
import { SidebarMenu } from 'vue-sidebar-menu'

  export default {    
  components: {
    SidebarMenu
  },
  data() {
      return {
          menu: [
              {
                  header: true,
                  title: 'Main Navigation',
                  hiddenOnCollapse: true
              },
              {
                  href: '/',
                  title: 'Home',
                  icon: 'fa fa-home'
              }, 
              {
                  href: '/recipes',
                  title: 'Recipes',
                  icon: 'fa fa-book',
                  child: [
                      {
                          href: '/validateRecipe',
                          title: 'Validate Recipe',
                          icon: 'fa fa-check',
                      },
                      {
                          href: '/addRecipe',
                          title: 'Add Recipe',
                          icon: 'fa fa-plus',
                      }
                  ]
              },
              {
                  href: '/ingredients',
                  title: 'Ingredients',
                  icon: 'fa fa-apple',
                  child: [
                      {
                          href: '/validateIngredient',
                          title: 'Validate Ingredient',
                          icon: 'fa fa-check',
                      },
                      {
                          href: '/addIngredient',
                          title: 'Add Ingredient',
                          icon: 'fa fa-plus',
                      }
                  ]
              },
              {
                  href: '/exportData',
                  title: 'Export Data',
                  icon: 'fa fa-database'
              },
          ]
      }
  }
}
</script> 