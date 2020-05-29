<template>
    <div>
        <AddRecipe></AddRecipe>
        <h1> Receitas </h1>
        <div>
             <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header card-header-primary">
                  <h4 class="card-title ">Receitas</h4>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table">
                      <thead class=" text-primary">
                        <th>Id</th><th>Nome</th><th>Validada</th><th>Popularidade</th><th>SubmittedBy</th>
                      </thead>
                      <tbody v-for="recipe in recipes"
                        :key="recipe.id">
                        
                        <tr>
                          <td>{{recipe.id}}
                          </td>
                          <td>
                            {{recipe.name}}
                          </td>
                          <td>
                            {{recipe.validated}}
                          </td>
                          <td>
                            {{recipe.popularity}}
                          </td>
                          <td class="text-primary">
                            {{recipe.submitedBy}}
                          </td>
                        </tr>
                        </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
         </div>
        </div>
    </div>
</template>

<script>
import AddRecipe from  "./AddRecipe.vue";
import axios from 'axios'

export default {
    name: "Recipes",
    components: {
        AddRecipe,
    },
    data (){
        return{
            deploy_to : process.env.VUE_APP_DATABASE,
            recipes: []
        }
    },
    mounted (){
        axios.get(this.deploy_to + 'recipe/',{headers: {
                'Authorization': `Token ${this.$store.getters.getToken}`
            }})
            .then(response => (this.recipes = response.data.results))
            .catch(error => {
            console.log(error)
            })
    },

    methods: {
        deleteRecipe(id){
        axios.delete(this.deploy_to +'recipe/'+ id)
            .then( this.recipes = this.recipes.filter(recipes => recipes.id != id) )
            .catch(error => {
            console.log(error)
            })
        }
    }
}
</script>

<style scoped>

</style>