<template>
    <v-container>
        <b-alert variant="success" v-if="this.success" show>{{this.success}}</b-alert>
        <b-alert variant="danger" v-if="this.err" show>{{this.err}}</b-alert>
        <form ref='ingredientForm' v-on:submit.prevent="submitIngredient">
            <div class="form-group">
                <input type="text" class="form-control" id="name" placeholder="Name" v-model="currentIngredient.name" >
            </div>
           <div id="imagePreview" align="center">
               <v-img 
                    v-if="currentIngredient.img"
                    :src="currentIngredient.img" alt=""
                    contain
                    height="400px"
                    width="450px">
                </v-img>
            </div>
            <div class="form-group">
                <input type="text" class="form-control" id="imgURL" placeholder="Image URL" v-model="currentIngredient.img">
            </div>
            <div class="form-group">
                <select class="form-control" v-model="currentIngredient.category">
                    <option value="" disabled selected>Select a category...</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary" >Submit</button>
        </form>

    </v-container>
</template>

<script>
import axios from 'axios'

export default {
    name: "AddIngredients",
    data(){
        return {
            deploy_to : process.env.VUE_APP_DATABASE,
            err: null,
            success: null,
            valid: false,
            currentIngredient: {
                "name" : '',
                "img" : 'https://simpleveganblog.com/wp-content/uploads/2021/01/Soy-Milk-2.jpg',
                "category" : undefined
            },
            categories : [],
            ourIngredients : [],
            fetchedIngredients: [],
        }
    },

    methods: {
         showErr(msg){
          this.err = msg
          setTimeout(() => this.err = null, 3000);
        },
        showSuccess(msg){
            this.success = msg
            setTimeout(() => this.success = null, 3000);
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
            console.log(ingredient)
            if(ingredient.name != "" && ingredient.category != undefined) {
                axios.post(this.deploy_to + 'ingredient/', ingredient,{headers: {
                'Authorization': `Token ${this.$store.getters.getToken}`
            }})
            .then((response) => {
                        this.showSuccess("status "+response.status)
                    })
                    .catch(errors => {
                        console.log(errors)
                        this.showErr(errors)
                    })
            }
        }
    },

    created (){
        axios.get(this.deploy_to + 'ingredient/', {headers: {
            'Authorization': `Token ${this.$store.getters.getToken}`}})
                .then(resp => {
            this.ourIngredients = resp.data.results
        }).catch(errors => {
            console.log(errors)
            this.showErr(errors)
        })
        
        axios.get(this.deploy_to + 'category/', {headers: {
            'Authorization': `Token ${this.$store.getters.getToken}`}})
                .then(resp => {
            this.categories = resp.data.results
        }).catch(errors => {
            console.log(errors)
            this.showErr(errors)
        })
    },

}
</script>

<style scoped>
</style>