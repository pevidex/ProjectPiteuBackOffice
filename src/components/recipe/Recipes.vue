<template>
    <div>
      <div class="tim-typo">
                    <h2>Recipes</h2>
      </div>
        
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-3 col-md-6 col-sm-6">
              <div class="card card-stats">
                <div class="card-header card-header-warning card-header-icon">
                  <div class="card-icon">
                    <i class="material-icons">restaurant_menu</i>
                  </div>
                  <p class="card-category">Recipes</p>
                  <h3 class="card-title" v-if="stats">{{stats.totalRecipes}}
                  </h3>
                </div>
                <div class="card-footer">
                  <div class="stats">
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-6">
              <div class="card card-stats">
                <div class="card-header card-header-danger card-header-icon">
                  <div class="card-icon">
                    <i class="material-icons">restaurant_menu</i>
                  </div>
                  <p class="card-category">Recipes to validate</p>
                  <h3 class="card-title" v-if="stats">{{stats.totalRecipesToBeValidated}}</h3>
                </div>
                <div class="card-footer">
                  <div class="stats">
                    <router-link :to="'/validateRecipe'">
                      <a>Validate Recipes</a>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
//todo divide cards in components
export default {
    name: "Recipes",
    data (){
        return{
            deploy_to : process.env.VUE_APP_DATABASE,
            stats : null
        }
    },
    mounted (){
        var url = this.deploy_to + 'backoffice/stats/recipe/'
        axios.get(url,{headers: {
                'Authorization': `Token ${this.$store.getters.getToken}`
            }})
            .then(response => {
              this.stats = response.data
              })
            .catch(error => {
            console.log(error)
            })
    },
}
</script>

<style scoped>

</style>