<template>
    <div>
        <p>
            {{recipe.name}}
            <button class="btn btn-danger" @click="$emit('del-recipe',recipe.id)">x</button>
        </p>
    </div>
</template>

<script>
export default {
    name: "RecipeItem",
    props: ["recipe"]
}
</script>

<style scoped>

</style>