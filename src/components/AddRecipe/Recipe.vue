<template>
    <v-card class="fill-height px-5 pt-8">
        <v-form>
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-textarea rows="2" label="Description">

                        </v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-card>
                            <v-card-title>Add Ingredients</v-card-title>
                            <v-row class="mx-3" align="center">
                                <v-col cols="2">
                                    <v-select label="Measure" v-model="measure"
                                                                :items="getMeasures()"
                                                                item-text="name"
                                                                return-object>
                                    </v-select>
                                </v-col>
                                <v-col cols="1">
                                    <v-text-field label="Qnt" type="Number" v-model="quantity">

                                    </v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-autocomplete
                                        v-model="currentIngredient"
                                        :items="getIngredients()"
                                        color="white"
                                        hide-no-data
                                        hide-selected
                                        item-text="name"
                                        label="Ingredients"
                                        placeholder="Type to search"
                                        return-object
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="1">
                                    <v-checkbox v-model="optional" label="Opt"></v-checkbox>
                                </v-col>
                                <v-col cols="2">
                                    <v-btn color="green" @click="addIngredient">Add</v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <div class="ml-5 d-flex flex-row" v-for="ingredient in added_ingredients" :key="ingredient.id" align="center">
                                            <span class="mx-2" >{{ingredient.measure.name}}</span>
                                            <span class="mx-2">{{ingredient.quantity}}</span>
                                            <span class="mx-2">{{ingredient.key.name}}</span>
                                            <span v-text="ingredient.optional ? 'optional' : 'required'"></span>
                                            <v-btn class="mx-2" x-small icon color="red" @click="removeIngredient(ingredient)">
                                                <v-icon>mdi-close</v-icon>
                                            </v-btn>
                                    </div>
                                </v-col>
                            </v-row>
                         </v-card>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-card class="pa-5">
                            <v-card-title>Instructions (one per line)</v-card-title>
                            <v-textarea auto-grow>

                            </v-textarea>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </v-card>
</template>

<script>
import axios from 'axios'

export default {
    name: "Recipe",
    data(){
        return {
            deploy_to : process.env.VUE_APP_DATABASE,
            description: null,
            currentIngredient: null,
            measure:null,
            quantity:null,
            optional: false,
            added_ingredients: [],
            possible_ingredients:[],
            possible_measures:[],
            
        }
    },
    created (){
        const requestIngredient = axios.get(this.deploy_to + 'ingredient/' )
        const requestMeasure = axios.get(this.deploy_to + 'measure/')
        
        axios.all([requestIngredient, requestMeasure],{headers: {
                    'Authorization': `Token ${this.$store.getters.getToken}`
                }})
            .then(axios.spread( (...responses) => {
                this.possible_ingredients = responses[0].data.results
                this.possible_measures = responses[1].data.results
            })).catch(errors => {
                console.log("ERROR request tables: " +  errors)
            })
    },
    methods: {
        addIngredient(){
            var ingredient = {
                measure: this.measure,
                quantity: this.quantity,
                optional: this.optional,
                key: this.currentIngredient
            }
            if(this.validateIngredient(ingredient)){
                this.resetIngredientsForm();
                this.addOrReplaceInIngredientList(ingredient)
            }
        },
        addOrReplaceInIngredientList(ingredient){
            for(var i = 0; i < this.added_ingredients.length; i++){
                if(this.added_ingredients[i].key.id === ingredient.key.id){
                    console.log("replaced in list");
                    this.added_ingredients[i] = ingredient;
                    return;
                }
            }
            this.added_ingredients.push(ingredient)
        },
        validateIngredient(ingredient){
            if(ingredient.measure != null && ingredient.quantity > 0 && ingredient.optional != null && ingredient.key != null){
                return true
            }
            return false
        },
        removeIngredient(ingredient){
            for(var i = 0; i < this.added_ingredients.length; i++){
                if (this.added_ingredients[i].key.id === ingredient.key.id) { 
                    this.added_ingredients.splice(i, 1); 
                    return;
                }
            }
        },
        resetIngredientsForm(){
            this.currentIngredient = null;
            this.optional = false;
        },
        getMeasures() {
            //Wait for server to respond
            var wait = (ms) => new Promise((r) => setTimeout(r, ms));
            wait(1000).then(() => {
                return this.possible_measures;
            });
            return this.possible_measures;
        },
        getIngredients() {
            //Wait for server to respond
            var wait = (ms) => new Promise((r) => setTimeout(r, ms));
            wait(1000).then(() => {
                return this.possible_ingredients;
            });
            return this.possible_ingredients;
        },
    }
}
</script>

<style scoped>

.meta-container {
    background-color: #EDEDED;
    border-right: 5px solid black
}

.image-preview {
    height: 200px;
}

</style>