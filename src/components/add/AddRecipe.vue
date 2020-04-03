<template>
    <div>
        <form @submit="addRecipe" autocomplete="off">
            <label for="name">Nome da receita:</label>
            <input type="text" v-model="name" name="name" placeholder="Nome..."><br>

            <label for="cuisine">Tipo de cozinha:</label>
            <select v-model="cuisine" name="cuisine" placeholder="Cozinha...">
                <option v-for="possible_cuisine in possilbe_cuisines" :key="possible_cuisine.name" :value="possible_cuisine.id"> 
                        {{possible_cuisine.name}}
                </option>
            </select>
            <br>

            <label for="time">Tempo:</label>
            <input type="number" v-model="time" name="time"><br>

            <label for="difficulty">Dificuldade:</label>
            <input type="radio" v-model="difficulty" name="difficulty" value="1">Fácil
            <input type="radio" v-model="difficulty" name="difficulty" value="2">Médio
            <input type="radio" v-model="difficulty" name="difficulty" value="3">Difícil
            <br>

            <label for="description">Descrição da receita:</label>
            <input type="text" v-model="description" name="description" placeholder="Descrição..."><br>

            <label for="serves">Serve quantas pessoas:</label>
            <input type="number" v-model="serves" name="serves"  ><br>

            <label for="image">Imagem da receita:</label>
            <input type="url" v-model="image" name="image" ><br>

            <button type="button"  @click="addStep()">Adicionar mais um passo</button><br>

            <div v-for="step in steps"
                :key="step.id + '-step'">
                {{step.id}}
            <input type="text" v-model="step.instruction" name="instruction" placeholder="Instrução..."><br>
            </div>

            <button type="button"  v-if="this.steps.length != 0" @click="removeLastStep()">Eliminar último passo </button><br>

            <button type="button"  @click="addIngredient()">Adicionar mais um ingrediente</button><br>
            
            <div v-for="ingredient in ingredients"
                :key="ingredient.id">
                <input type="number" v-model="ingredient.quantity" name="quantity">

                <select v-model="ingredient.measure" name="ingredient" >
                <option v-for="possible_measure in possible_measures" :key="ingredient.id + possible_measure.name" :value="possible_measure.name"> 
                        {{possible_measure.name}}
                </option>
                </select>

                <select v-model="ingredient.name" name="ingredient" >
                <option v-for="possible_ingredient in possible_ingredients" 
                        :key="ingredient.id + possible_ingredient.name" :value="possible_ingredient.id"> 
                        {{possible_ingredient.name}}
                </option>
                </select>
            </div>

            <button type="button"   v-if="this.ingredients.length != 0" @click="removeLastIngredient()">Eliminar último ingrediente </button><br>

            <input type="submit" value="Submeter" class="btn">
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
            axios.post(this.deploy_to + 'recipe/', {
                name: this.name,
                image: this.image,
                description: this.description,
                difficulty: this.difficulty,
                serves: this.serves,
                cuisine: this.cuisine
            }).then(response => { 
                this.ingredients.forEach(ingredient =>
                axios.post(this.deploy_to + 'recipe-ingredient/',{
                        quantity: ingredient.quantity,
                        recipe: response.data.id,
                        ingredient: ingredient.name,
                        measure: ingredient.measure
                    }))

                this.steps.forEach(step =>
                    axios.post(this.deploy_to + 'instruction/',{
                            step: step.id,
                            instruction_description: step.instruction,
                            recipe: response.data.id
                        }))
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
                id: this.ingredients.length,
                name: '',
                measure:'',
                quantity: ''
            }
            this.ingredients.push(newIngredient)
        },
        removeLastIngredient(){
            this.ingredients.pop()
        }
    }
}
</script>

<style scoped>

</style>