<template>
    <div>
        <div v-for="recipe in recipes"
            :key="recipe.id">
            <RecipeItem v-bind:recipe="recipe" v-on:del-recipe="$emit('del-recipe',recipe.id)"/>
        </div>
    </div>
</template>

<script>
import RecipeItem from  "./RecipeItem.vue";

export default {
    name: "Recipes"   ,
    components: {
        RecipeItem
    },
    props: ["recipes"]
}
</script>

<style scoped>

</style>