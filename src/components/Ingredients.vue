<template>
    <div>      
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-sm-6">
            <v-card>
              <v-card-title>
                Ingredients
              </v-card-title>
              <v-card-subtitle>
                Total
              </v-card-subtitle>
              <v-card-text>
                <h3 class="card-title" v-if="stats">{{stats.totalIngredients}}</h3>
              </v-card-text>
            </v-card>
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6">
            <v-card>
              <v-card-title>
                Non Validated Ingredients
              </v-card-title>
              <v-card-subtitle>
                Total
              </v-card-subtitle>
              <v-card-text>
                <h3 class="card-title" v-if="stats">{{stats.totalIngredientsToBeValidated}}</h3>
              </v-card-text>
            </v-card>
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
        var url = this.deploy_to + 'backoffice/stats/ingredient/'
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