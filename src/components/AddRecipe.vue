<template>
    <div>
        <form @submit="addRecipe">
            <label for="name">Nome da receita:</label>
            <input type="text" v-model="name" name="name" placeholder="Nome..."><br>

            <label for="description">Descrição da receita:</label>
            <input type="text" v-model="description" name="description" placeholder="Descrição..."><br>

            <label for="serves">Serve quantas pessoas:</label>
            <input type="number" v-model="serves" name="serves"  ><br>

            <label for="image">Imagem da receita:</label>
            <input type="url" v-model="image" name="image" ><br>

            <button type="button"  @click="addStep()">Adicionar mais um passo</button><br>

            <div v-for="step in steps"
                :key="step.id">
                {{step.id}}
            <input type="text" v-model="step.instruction" name="instruction" placeholder="Instrução..."><br>
            </div>

            <button type="button"  v-if="this.steps.length != 0" @click="removeLastStep()">Eliminar último passo </button><br>

            <button type="button"  @click="addIngredient()">Adicionar mais um ingrediente</button><br>
            
            <div v-for="ingredient in ingredients"
                :key="ingredient.id">
                <input type="number" v-model="ingredient.quantity" name="quantity">
                <input type="text" v-model="ingredient.measure" name="measure" placeholder="Medida...">
                <input type="text" v-model="ingredient.name" name="ingredient" placeholder="Ingrediente...">
            </div>

            <button type="button"   v-if="this.ingredients.length != 0" @click="removeLastIngredient()">Eliminar último ingrediente </button><br>

            <input type="submit" value="Submeter" class="btn">
        </form>
    </div>
</template>

<script>
export default {
    name: "AddRecipe",
    data(){
        return {
            name:'',
            description: '',
            serves: '',
            image: '',
            steps: [],
            ingredients:[]
        }
    },
    methods: {
        addRecipe(e){
            e.preventDefault();
            const newRecipe = {
                name: this.name,
                description: this.description,
                serves: this.serves,
                image: this.image,
                steps: this.steps,
                ingredients: this.ingredients
            }
            console.log(newRecipe)
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