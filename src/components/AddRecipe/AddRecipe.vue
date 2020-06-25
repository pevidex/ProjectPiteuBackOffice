<template>
    <v-container class="fill-height" style="margin: 0px; padding: 0px; max-width: 100%; height:100%" fluid >
        <v-row class="ma-0 fill-height flex-column">
            <v-col cols="4" class="ma-0 pa-0 flex-grow-1">
                <RecipeMetadata></RecipeMetadata>
            </v-col>
            <v-col cols="8" class="ma-0 pa-0 flex-grow-1">
                <Recipe></Recipe>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'
import RecipeMetadata from './RecipeMetadata'
import Recipe from './Recipe'

export default {
    name: "AddRecipe",
    components: {
        RecipeMetadata,
        Recipe
    },
    data(){
        return {
            deploy_to : process.env.VUE_APP_DATABASE,
            id: '',
            name:'',
            cuisine:'',
            description: '',
            difficulty: '',
            time: '',
            serves: '',
            image: '',
            steps: [],
            ingredients:[],
            possible_ingredients:[],
            possible_measures:[],
            possilbe_cuisines:[]
        }
    },
    mounted (){
        const requestIngredient = axios.get(this.deploy_to + 'ingredient/' )
        const requestMeasure = axios.get(this.deploy_to + 'measure/')
        const requestCuisine = axios.get(this.deploy_to + 'cuisine/')
        axios.all([requestIngredient, requestMeasure, requestCuisine],{headers: {
                    'Authorization': `Token ${this.$store.getters.getToken}`
                }})
            .then(axios.spread( (...responses) => {
                this.possible_ingredients = responses[0].data.results
                this.possible_measures = responses[1].data.results
                this.possilbe_cuisines = responses[2].data.results

            })).catch(errors => {
                console.log(errors)
            })
    },
    methods: {
        convertToWordArray(results){
            var newArray = []
            for(var result in results){
                newArray.push(results[result].name)
            }
            return newArray
        },
        addRecipe(e){
            e.preventDefault();

            var recipe = {
                name: this.name,
                image: this.image,
                description: this.description,
                difficulty: this.difficulty,
                serves: this.serves,
                cuisine: this.cuisine,
                recipeIngredients: this.ingredients,
                instructions: this.steps
            }
            console.log(recipe)
            axios.post(this.deploy_to + 'recipe/', recipe,{headers: {
                'Authorization': `Token ${this.$store.getters.getToken}`
            }})
            .then((response) => {
                console.log(response);
            })
            .catch(errors => {
                console.log(errors)
            })
            
        },
        addStep(){
            var newStep = {
                step: this.steps.length + 1,
                instruction: ''
            }
            this.steps.push(newStep)
        },
        removeLastStep(){
            this.steps.pop()
        },
        addIngredient(){
            var newIngredient = {
                index: this.ingredients.length,
                id: '',
                measure: '',
                quantity: '',
                optional: false
            }
            this.ingredients.push(newIngredient)
        },
        removeLastIngredient(){
            this.ingredients.pop()
        },
    }
}
</script>

<style scoped>

#full-container {
    width: 100%;
}

</style>