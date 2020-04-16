<template>
    <div class="container">
        <form @submit="addRecipe" autocomplete="off" class="form-group">
            <label for="name">Nome da receita:</label>
            <input type="text" class="form-control" v-model="name" name="name" placeholder="Nome..."><br>

            <label for="cuisine">Tipo de cozinha:</label>
            <select class="form-control" v-model="cuisine" name="cuisine" placeholder="Cozinha...">
                <option v-for="possible_cuisine in possilbe_cuisines" :key="possible_cuisine.name" :value="possible_cuisine.id"> 
                        {{possible_cuisine.name}}
                </option>
            </select>
            <br>
            <label for="time">Tempo:</label>
            <input type="number" class="form-control"  v-model="time" name="time"><br>
             

            <label for="difficulty">Dificuldade:</label>
            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="difficulty1" v-model="difficulty" name="difficulty" value="1" class="custom-control-input">
                <label class="custom-control-label" for="difficulty1">Fácil</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="difficulty2" v-model="difficulty" name="difficulty" value="2" class="custom-control-input">
                <label class="custom-control-label" for="difficulty2">Médio</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="difficulty3" v-model="difficulty" name="difficulty" value="3" class="custom-control-input">
                <label class="custom-control-label" for="difficulty3">Difícil</label>
            </div>
            <br>

            <label for="description">Descrição da receita:</label>
            <input type="text" class="form-control" v-model="description" name="description" placeholder="Descrição..."><br>

            <label for="serves">Serve quantas pessoas:</label>
            <input type="number" class="form-control"  v-model="serves" name="serves"  ><br>

            <label for="image">Imagem da receita:</label>
            <input type="url" class="form-control"  v-model="image" name="image" ><br>

            <button type="button" class="btn btn-success" @click="addStep()">Adicionar mais um passo</button><br>

            <div v-for="step in steps"
                :key="step.id + '-step'">
                {{step.id}}
            <input type="text" class="form-control" v-model="step.instruction" name="instruction" placeholder="Instrução..."><br>
            </div>

            <button type="button" class="btn btn-danger formitem" v-if="this.steps.length != 0" @click="removeLastStep()">Eliminar último passo </button><br>

            <button type="button" class="btn btn-success" @click="addIngredient()">Adicionar mais um ingrediente</button><br>
            
            <div v-for="ingredient in ingredients"
                :key="ingredient.index">
                <div class="form-row align-items-center formitem">
                    <div class="col-auto my-1">
                        <input type="number" class="form-control custom-control-inline" v-model="ingredient.quantity" name="quantity">
                    </div>
                    <div class="col-auto my-1">
                        <select v-model="ingredient.measure" class="form-control custom-control-inline" name="ingredient" >
                        <option v-for="possible_measure in possible_measures" :key="ingredient.id + possible_measure.name" 
                            :value="possible_measure.id"> 
                                {{possible_measure.name}}
                        </option>
                        </select>
                     </div>
                    <div class="col-auto my-1">
                        <select v-model="ingredient.id" class="form-control custom-control-inline" name="ingredient" >
                        <option v-for="possible_ingredient in possible_ingredients" :key="ingredient.id + possible_ingredient.name" :value="possible_ingredient.id"> 
                                {{possible_ingredient.name}}
                        </option>
                        </select>
                    </div>
                </div>
            </div>

            <button type="button"  class="btn btn-danger formitem" v-if="this.ingredients.length != 0" @click="removeLastIngredient()">Eliminar último ingrediente </button><br>
            <button type="submit" class="btn btn-primary">Submeter</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios'


export default {
    name: "AddRecipe",
    data(){
        return {
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
    props: ["deploy_to"],
  mounted (){
    const requestIngredient = axios.get(this.deploy_to + 'ingredient/' )
    const requestMeasure = axios.get(this.deploy_to + 'measure/')
    const requestCuisine = axios.get(this.deploy_to + 'cuisine/')
    axios.all([requestIngredient, requestMeasure, requestCuisine])
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
                ingredients: this.ingredients,
                instructions: this.steps
            }
            
            axios.post(this.deploy_to + 'recipe/', recipe)
            .then((response) => {
                console.log(response);
            })
            .catch(errors => {
                console.log(errors)
            })
            
        },
        addStep(){
            var newStep = {
                id: this.steps.length + 1,
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
                quantity: ''
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

</style>