<template>
    <v-container>
        <form ref='ingredientForm' v-on:submit.prevent="submitIngredient">
            <div class="form-group">
                <input type="text" class="form-control" id="name" placeholder="Name" v-model="currentIngredient.name" >
            </div>
            <div class="form-group">
                <input type="text" class="form-control" id="imgURL" placeholder="Image URL" v-model="currentIngredient.img">
            </div>
            <div class="form-group">
                <select class="form-control" v-model="currentIngredient.category">
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary" >Submit</button>
            <button type="button" class="btn btn-primary mx-2" v-on:click="fetchOtherIngredient()">Fetch Other Ingredient</button>
        </form>

    </v-container>
</template>

<script>
import axios from 'axios'

export default {
    name: "AddIngredients",
    data(){
        return {
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

    props: ["deploy_to"],

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
                axios.post(this.deploy_to + 'ingredient/', ingredient)
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

        axios.get(this.deploy_to + 'ingredient/').then(resp => {
            this.ourIngredients = resp.data.results
        }).catch(errors => {
            console.log(errors)
        })
        
        axios.get(this.deploy_to + 'category/').then(resp => {
            this.categories = resp.data.results
        }).catch(errors => {
            console.log(errors)
        })
    },

}
</script>

<style scoped>

</style>