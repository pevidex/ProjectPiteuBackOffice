<template>
    <v-card class="meta-container fill-height px-5 py-8">
        <v-card-title style="word-break: normal">Very good Recipe that Ricardo's Mother doesn't know</v-card-title>
        <img class="image-preview ma-3" v-if="url" :src="url">
        <v-file-input prepend-icon="mdi-camera" show-size label="Recipe Photo" @change="preview_image" />

        <v-form>
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-text-field label="Recipe Name">

                        </v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-select label="Dish" v-model="dish"
                            :items="getCuisines()"
                            item-text="name"
                            item-value="id"
                            multiple>
                        </v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-select label="Difficulty" v-model="difficulty"
                            :items="difficultyOptions">
                        </v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="time" type="number" label="Time"  @click:append-outer="incrementTime" @click:prepend="decrementTime"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="numberServes" type="number" label="People"  @click:append-outer="incrementServes" @click:prepend="decrementServes"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-select label="Utensils" v-model="utensils"
                            :items="getUtensils()"
                            item-text="name"
                            item-value="id"
                            multiple>
                        </v-select>
                    </v-col>
                    <v-col cols="12">
                        <v-btn color="red">
                            SUBMIT
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </v-card>
</template>

<script>
import axios from 'axios'

export default {
    name: "RecipeMetadata",
    data(){
        return {
            deploy_to : process.env.VUE_APP_DATABASE,
            url: null,
            cuisine: null,
            dish: null,
            difficulty: null,
            numberServes: null,
            time: null,
            utensils: null,
            possible_ingredients:[],
            possible_measures:[],
            possible_cuisines:[],
            possible_utensils:[],
            difficultyOptions: ['Easy', 'Medium', 'Hard'],
        }
    },
    created (){
        const requestIngredient = axios.get(this.deploy_to + 'ingredient/' )
        const requestMeasure = axios.get(this.deploy_to + 'measure/')
        const requestCuisine = axios.get(this.deploy_to + 'cuisine/')
        const requestUtensils = axios.get(this.deploy_to + 'utensil/')
        axios.all([requestIngredient, requestMeasure, requestCuisine, requestUtensils],{headers: {
                    'Authorization': `Token ${this.$store.getters.getToken}`
                }})
            .then(axios.spread( (...responses) => {
                this.possible_ingredients = responses[0].data.results
                this.possible_measures = responses[1].data.results
                this.possible_cuisines = responses[2].data.results
                this.possible_utensils = responses[3].data.results
            })).catch(errors => {
                console.log("ERROR request tables: " +  errors)
            })
    },
    methods: {
        preview_image(file){
            if(file){
                this.url = URL.createObjectURL(file);
            } else {
                this.url = null;
            }
        },
        getCuisines() {
            //Wait for server to respond
            var wait = (ms) => new Promise((r) => setTimeout(r, ms));
            wait(1000).then(() => {
                return this.possible_cuisines;
            });
            return this.possible_cuisines;
        },
        getUtensils() {
            //Wait for server to respond
            var wait = (ms) => new Promise((r) => setTimeout(r, ms));
            wait(1000).then(() => {
                return this.possible_utensils;
            });
            return this.possible_utensils;
        },
        incrementServes () {
            this.numberServes = parseInt(this.numberServes, 10) + 1
        },
        decrementServes () {
            this.numberServes = parseInt(this.numberServes, 10) - 1
        },
        incrementTime () {
            this.time = parseInt(this.time, 10) + 1
        },
        decrementTime () {
            this.time = parseInt(this.time, 10) - 1
        }
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