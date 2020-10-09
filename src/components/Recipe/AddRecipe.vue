<template>
    <v-container style="margin: 0px; padding: 0px; max-width: 100%; height:100%" fluid >
        <v-row class="ma-0 fill-height">
            <v-col cols="4" class="ma-0 pa-0 flex-grow-0">

                <!-- RECIPE METADATA -->
                <v-card class="meta-container fill-height px-5 py-1 flex-grow-0">
                    <v-row class="mx-3" align="center" justify="center">
                        <v-text-field class="shrink" v-model="importId" type="number" label="Import existing recipe" placeholder="Recipe ID"></v-text-field>
                        <v-btn class="mx-3" depressed small @click="importRecipe">Import</v-btn>
                    </v-row>
                    <v-card-title style="word-break: normal">Very good Recipe that Ricardo's Mother doesn't know</v-card-title>

                    <v-img contain height="150px" v-if="url" :src="url"></v-img>
                    <v-file-input prepend-icon="mdi-camera" show-size label="Recipe Photo" @change="preview_image" />
                    <span>OR</span>
                    <v-text-field label="URL" v-model="url"></v-text-field>
     

                    <v-form>
                        <v-container class="pa-0">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Recipe Name" v-model="recipeName">

                                    </v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-select label="Dish" v-model="dish"
                                        :items="getDishTypes()"
                                        item-text="name"
                                        item-value="id">
                                    </v-select>
                                </v-col>
                                <v-col cols="6">
                                    <v-select label="Difficulty" v-model="difficulty"
                                        :items="difficultyOptions">
                                    </v-select>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="prepTime" type="number" label="PrepTime"></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="totalTime" type="number" label="TotalTime"></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field v-model="numberServes" type="number" label="People"  @click:append-outer="incrementServes" @click:prepend="decrementServes"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea rows="2" label="Description" v-model="description">

                                    </v-textarea>
                                </v-col>
                                <v-col cols="12">
                                    <b-alert variant="danger" v-if="this.err" show>{{this.err}}</b-alert>
                                    <b-alert variant="success" v-if="this.success" show>{{this.success}}</b-alert>
                                    <v-btn color="green" v-confirm="{ok: submitRecipe, message: 'Are you sure?'}">
                                        {{ submitButtonText() }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card>
            </v-col>

            
            <!-- RECIPE -->
            <v-col cols="8" class="ma-0 pa-0 flex-grow-1">
                <v-card class="fill-height px-5 pt-8">
                    <v-form>
                        <v-container>
                            <v-row>
                            <v-col cols="12">
                                <v-card>
                                    <v-card-title>Fill utensils required</v-card-title>
                                        <v-select class="mx-3" label="Utensils" v-model="utensils"
                                            :items="getUtensils()"
                                            item-text="name"
                                            item-value="id"
                                            multiple>
                                        </v-select>
                                </v-card>
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
                                                        <span class="mx-2">{{ingredient.name}}</span>
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
                                        <v-textarea auto-grow v-model="raw_instructions">

                                        </v-textarea>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'

export default {
    name: "AddRecipe",
    components: {
    },
    data(){
        return {
            deploy_to : process.env.VUE_APP_DATABASE,
            url: null,
            file: null,
            recipeS3Url: null,
            recipeName: null,
            dish: null,
            difficulty: null,
            numberServes: null,
            prepTime: null,
            totalTime: null, 
            utensils: null,
            difficultyOptions: ['Easy', 'Medium', 'Hard'],
            description: null,
            currentIngredient: null,
            measure:null,
            quantity:null,
            optional: false,
            added_ingredients: [],
            raw_instructions: null,
            possible_ingredients:[],
            possible_measures:[],
            possible_utensils:[],
            possible_dishes: [],
            err: null,
            success: null,
            importId: null
        }
    },
    mounted (){
        const requestIngredient = axios.get(this.deploy_to + 'ingredient/', {headers: {
                'Authorization': `${this.$store.getters.getTokenToSend}`
        }} )
        const requestMeasure = axios.get(this.deploy_to + 'measure/', {headers: {
                'Authorization': `${this.$store.getters.getTokenToSend}`
        }})
        const requestUtensils = axios.get(this.deploy_to + 'utensil/', {headers: {
                'Authorization': `${this.$store.getters.getTokenToSend}`
        }})
        const requestCuisines = axios.get(this.deploy_to + 'utensil/', {headers: {
                'Authorization': `${this.$store.getters.getTokenToSend}`
        }})
        const requestDishes = axios.get(this.deploy_to + 'dishtype/',{headers: {
                'Authorization': `${this.$store.getters.getTokenToSend}`
        }})

        const editRecipeId = this.$store.getters.getRecipeToEdit
        if(editRecipeId != null && editRecipeId > 0){
            this.importId = editRecipeId
            this.$store.commit('editRecipe', null)  //RESET VALUE
            this.importRecipe()
        }

        axios.all([requestIngredient, requestMeasure, requestCuisines, requestUtensils, requestDishes],{headers: {
                    'Authorization': `Token ${this.$store.getters.getToken}`
                }})
            .then(axios.spread( (...responses) => {
                this.possible_ingredients = responses[0].data.results
                this.possible_measures = responses[1].data.results
                this.possible_cuisines = responses[2].data.results
                this.possible_utensils = responses[3].data.results
                this.possible_dishes = responses[4].data.results
            })).catch(errors => {
                console.log("ERROR request tables: " +  errors)
            })
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
        async submitRecipe(){
            console.log("trying to submit recipe");
            var imageUrl = ""
            if(this.file != null){
                imageUrl = await this.uploadImageToStorage()
            } else {
                imageUrl = this.url
            }

            const recipe = {
                id: this.importId,
                name : this.recipeName,
                image : imageUrl,
                description : this.description,
                dishType: this.dish,
                difficulty : this.getDifficultyValue(),
                serves : this.numberServes,
                prepareInMinutes : this.prepTime,
                readyInMinutes : this.totalTime,
                utensils: this.utensils,
                recipeIngredients: this.parseRecipeIngredients(),
                instructions: this.parseInstructions(),
                is_valid : true
            }
            if(!this.validateRecipe(recipe)){
                return;
            }

            console.log(recipe);
            //TODO
            if(this.importId == null || this.importId < 1){
                this.sendNewRecipeRequest(recipe);
            } else {
                this.sendUpdateRecipeRequest(recipe, this.importId)
            }
        },
        sendUpdateRecipeRequest(recipe, id){
            recipe["id"] = id
            axios.patch(this.deploy_to + 'recipe/', recipe, {headers: {
                    'Authorization': `Token ${this.$store.getters.getToken}`}})
                .then((response) => {
                    this.showSuccess("Recipe Updated Successfully ")
                })
                .catch(errors => {
                    console.log(errors)
                    this.showErr("Error updating recipe: " + errors)
                })
        },
        sendNewRecipeRequest(recipe){
            axios.post(this.deploy_to + 'recipe/', recipe,{headers: {
                    'Authorization': `Token ${this.$store.getters.getToken}`}})
                .then((response) => {
                    this.showSuccess("status "+response.status)
                })
                .catch(errors => {
                    console.log("Tried to create recipe, error: " + errors)
                })
        },
        validateRecipe(recipe){
            if(recipe.name == null || recipe.name.length < 2){
                this.showErr("Name is too short");
                return false
            }
            if(recipe.dishType == null){
                this.showErr("Please fill dish type");
                return false
            }
            if(recipe.description == null || recipe.description.length < 2){
                this.showErr("Please fill description");
                return false
            }
            if(recipe.difficulty == null || recipe.difficulty < 0){
                this.showErr("Please fill difficulty");
                return false
            }
            if(recipe.serves == null || recipe.serves < 1){
                this.showErr("Please fill people served number");
                return false
            }
            if(recipe.prepareInMinutes == null || recipe.readyInMinutes == null || recipe.readyInMinutes < 1 || recipe.prepareInMinutes < 1){
                this.showErr("Please fill recipe time correctly");
                return false
            }
            if(recipe.recipeIngredients.length < 1){
                this.showErr("Please add ingredients");
                return false
            }
            if(recipe.instructions.length < 1){
                this.showErr("Please add instructions");
                return false
            }
            return true
        },
        generateImageName(){
            const fileExtension = "." + this.file.name.split('.').pop();
            const randomInt = "_" + Math.floor(Math.random() * 10000)
            return this.recipeName.replace(/[^a-z0-9]/gi, '_').toLowerCase() + randomInt + fileExtension
        },
        async uploadImageToStorage(){
            const fileName = this.generateImageName()
            const signedUrl = await this.getSignedUrl(fileName)
            var bodyFormData = new FormData()
            Object.keys(signedUrl.fields).forEach(key => {
                bodyFormData.append(key, signedUrl.fields[key]);
            })
            bodyFormData.append('file', this.file, fileName)
            
            //Remove default headers for S3 Communication
            var axiosForS3 = axios.create();
            delete axiosForS3.defaults.headers.common['Authorization'];
            delete axiosForS3.defaults.headers.common['Content-Type'];

            return axiosForS3.post(signedUrl.url, bodyFormData)
                            .then(resp => Vue.Constants.S3_STORAGE_BASE_URL + signedUrl.fields["key"])
                            .catch(errors => {
                                console.log("S3 ERROR: " + errors)
                            })
        },
        async getSignedUrl(fileName){
            return axios.post(this.deploy_to + 's3/signed-url/', {"fileName": fileName}, {headers: {'Authorization': `Token ${this.$store.getters.getToken}`}})
                        .then(resp => resp.data)
                        .catch(errors => {
                            console.log("Getting signed url Error: " + errors)
                        })
        },
        parseRecipeIngredients(){
            var recipeIngredients = []
            this.added_ingredients.forEach(function(item){
                var ingredient = {
                    measure: item.measure.name,
                    quantity: item.quantity,
                    optional: item.optional,
                    id: item.id
                }
                recipeIngredients.push(ingredient)
            })
            return recipeIngredients
        },
        parseInstructions(){
            if(this.raw_instructions == null)
                return []
            var rawInstructions = this.raw_instructions.split("\n");
            var parsedInstructions = []
            var steps = 1
            rawInstructions.forEach(function(item){
                var newInstruction = {
                    step: steps,
                    instruction: item
                }
                if(newInstruction.instruction != ""){
                    parsedInstructions.push(newInstruction);
                    steps++;
                }
            })
            return parsedInstructions;
        },
        addIngredient(){
            var ingredient = {
                measure: this.measure,
                quantity: this.quantity,
                optional: this.optional,
                name: this.currentIngredient.name,
                id: this.currentIngredient.id
            }
            if(this.validateIngredient(ingredient)){
                this.resetIngredientsForm();
                this.addOrReplaceInIngredientList(ingredient)
            }
        },
        addOrReplaceInIngredientList(ingredient){
            for(var i = 0; i < this.added_ingredients.length; i++){
                if(this.added_ingredients[i].id === ingredient.id){
                    console.log("replaced in list");
                    this.added_ingredients[i] = ingredient;
                    return;
                }
            }
            this.added_ingredients.push(ingredient)
        },
        validateIngredient(ingredient){
            if(ingredient.measure != null && ingredient.quantity > 0 && ingredient.optional != null && ingredient.id != null){
                return true
            }
            return false
        },
        removeIngredient(ingredient){
            for(var i = 0; i < this.added_ingredients.length; i++){
                if (this.added_ingredients[i].id === ingredient.id) { 
                    this.added_ingredients.splice(i, 1); 
                    return;
                }
            }
        },
        resetIngredientsForm(){
            this.currentIngredient = null;
            this.optional = false;
        },
        preview_image(file){
            if(file){
                this.url = URL.createObjectURL(file);
                this.file = file
            } else {
                this.url = null;
                this.file = null;
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
        },
        getDishTypes(){
            //Wait for server to respond
            var wait = (ms) => new Promise((r) => setTimeout(r, ms));
            wait(1000).then(() => {
                return this.possible_dishes;
            });
            return this.possible_dishes;
        },
        getUtensils() {
            //Wait for server to respond
            var wait = (ms) => new Promise((r) => setTimeout(r, ms));
            wait(1000).then(() => {
                return this.possible_utensils;
            });
            return this.possible_utensils;
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
        getDifficultyValue(){
            return this.difficultyOptions.indexOf(this.difficulty) + 1;
        },
        async importRecipe(){
            const recipe = await axios.get(this.deploy_to + `recipe/${this.importId}`, {headers: {'Authorization': `Token ${this.$store.getters.getToken}`}})
                                .then(resp => resp.data)
                                .catch(errors => {
                                    console.log("Error importing recipe: " + errors)
                                })
            console.log(recipe)
            if(recipe != undefined){
                this.recipeName = recipe.name
                this.dish = recipe.dishType != null ? recipe.dishType.id : null
                this.difficulty = this.difficultyOptions[recipe.difficulty-1]
                this.numberServes = recipe.serves
                this.prepTime = recipe.prepareInMinutes
                this.totalTime = recipe.readyInMinutes
                this.utensils = recipe.utensils.map(u => u.id)
                this.description = recipe.description
                this.added_ingredients = this.importAddedIngredients(recipe.ingredients)
                this.raw_instructions = recipe.instructions.map(i => i.instruction_description).join('\n\n')
                this.url = recipe.image
            }
        },
        importAddedIngredients(ingredients){
            var addedIngredients = []
            ingredients.forEach(i => {
                var ingredient = {
                    measure: {id: i.measure, name: i.measureName},
                    quantity: i.quantity,
                    optional: i.optional,
                    name: i.ingredientName,
                    id: i.ingredient
                }
                addedIngredients.push(ingredient)
            })
            return addedIngredients
        },
        submitButtonText(){
            if(this.importId == null || this.importId <= 0){
                return "Submit"
            }
            return "Update Recipe=" + this.importId
        }
    }
}
</script>

<style scoped>

#full-container {
    width: 100%;
}

</style>