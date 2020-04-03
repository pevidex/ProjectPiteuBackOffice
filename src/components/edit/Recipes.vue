<template>
    <div>
        <p>
            RECEITAS
        </p>
        <div v-for="recipe in recipes"
            :key="recipe.id">
            <RecipeItem v-bind:recipe="recipe" v-on:del-recipe="deleteRecipe"/>
        </div>
    </div>
</template>

<script>
import RecipeItem from  "./RecipeItem.vue";
import axios from 'axios'

export default {
    name: "Recipes"   ,
    components: {
        RecipeItem
    },
    props: ["deploy_to"],
    data (){
        return{
            recipes: []
        }
    },
    mounted (){
        axios.get(this.deploy_to + 'recipe/')
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