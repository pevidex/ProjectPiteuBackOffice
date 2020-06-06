<template>
    <div>
        <h1> Ingredientes </h1>
        <AddIngredients></AddIngredients>
    </div>
</template>

<script>
import axios from 'axios'
import AddIngredients from './AddIngredients'

export default {
    name: "Ingredients",
    components: {
        'AddIngredients': AddIngredients
      },
    data(){
        return {
            deploy_to : process.env.VUE_APP_DATABASE,
            valid: false,
            currentIngredient: {
                "name" : '',
                "img" : 'http://testimage.com',
                "category" : undefined
            },
            categories : [],
            ourIngredients : [],
            fetchedIngredients: [],
            currentFetchedIngredient: -1
        }
    },


    watch: {
        currentFetchedIngredient(){
            this.currentIngredient.name = this.ingredientNameNormalization(this.fetchedIngredients[this.currentFetchedIngredient].strIngredient)
            if(this.checkIfIngredientExists(this.currentIngredient.name)){
                    this.fetchOtherIngredient()
            }
        }
    },

    methods: {
        fetchOtherIngredient(){
            console.log("fetch++")
            this.currentFetchedIngredient++
            this.currentIngredient.category = undefined
        },

        ingredientNameNormalization(name){
            return name.toLowerCase().replace(/ /g, '-')
        },

        checkIfIngredientExists(name){
            for(const ingredient of this.ourIngredients){
                if(name == ingredient.name){
                    return true
                }
            }
            return false
        },

        submitIngredient(){
            const ingredient = {
                name: this.currentIngredient.name,
                img: this.currentIngredient.img,
                category: this.currentIngredient.category
            }
            this.fetchOtherIngredient()

            if(ingredient.name != "" && ingredient.category != undefined) {
                axios.post(this.deploy_to + 'ingredient/', ingredient,{headers: {
                    'Authorization': `Token ${this.$store.getters.getToken}`
                }})
                    .then((response) => {
                        console.log(response);
                    })
                    .catch(errors => {
                        console.log(errors)
                    })
            }
        }
    },

    created (){
        axios.get('https://www.themealdb.com/api/json/v1/1/list.php?i=list').then(resp => {
            this.fetchedIngredients = resp.data.meals
            this.currentFetchedIngredient = 0
        });
        axios.get(this.deploy_to + 'ingredient/', {headers: {
                'Authorization': `Token ${this.$store.getters.getToken}`
            }}).then(resp => {
                this.ourIngredients = resp.data.results;
        }).catch(errors => {
            console.log(errors)
        })
        
        axios.get(this.deploy_to + 'category/', {headers: {
                'Authorization': `Token ${this.$store.getters.getToken}`
            }}).then(resp => {
            this.categories = resp.data.results
        }).catch(errors => {
            console.log(errors)
        })
    },

}
</script>

<style scoped>

</style>