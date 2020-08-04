<template>
	<v-container >
		<v-row class="mt-10" align="center" justify="center">
			<v-tabs centered v-model="tabIndex" @change="changeTab">
				<v-tab>Ingredients</v-tab>
				<v-tab>Categories</v-tab>
				<v-tab>Diets</v-tab>
				<v-tab>Dish Types</v-tab>
				<v-tab>Difficulties</v-tab>
			</v-tabs>
		</v-row>
		
		<v-row justify="center">
			<v-col cols="12" md="6">
			<v-card class="pt-3 mt-10" style="{position: sticky}">
				<v-card-subtitle>{{ title }}</v-card-subtitle>

				<v-text-field
					class="mx-3"
					v-model="filter"
					type="search"
					id="filterInput"
					placeholder="Type to Search"
				></v-text-field>
				<b-pagination
					v-model="currentPage"
					:total-rows="totalRows"
					:per-page="15"
					align="fill"
					size="sm"
					class="my-0"
				></b-pagination>

				<b-table 
					class="text-center my-3 px-2"
					sticky-header
					show-empty
					small
					stacked="md"
					:current-page="currentPage"
					:per-page="15"
					:filter="filter"
					:items="stats"
					:fields="fields"
					:sort-by.sync="sortBy"
					:sort-desc.sync="sortDesc"
					:sort-direction="sortDir"
					@filtered="onIngredientFiltered"
				>
				</b-table>
			</v-card>
			</v-col>
		</v-row>
		
	</v-container>
</template>

<script>
import axios from 'axios'
//todo divide cards in components
export default {
	name: "Stats",
	data (){
		return {
			deploy_to : process.env.VUE_APP_DATABASE,
			ingredientsStats : [],
			categoryStats: [],
			dietStats: [],
			dishStats: [],
			difficultyStats: [],
			stats: [],
			fields: [
				{ key: 'id', label: 'Ingredient Id', sortable: true, class: 'text-center align-middle'},
				{ key: 'name', label: 'Ingredient Name', class: 'text-center align-middle'},
				{ key: 'total', label: '#Recipes', sortable: true, class: 'text-center align-middle'}
			],
			currentPage: 1,
			totalRows: 0,
			filter: '',
			sortBy: 'total',
			sortDesc: false,
			sortDir: 'asc',
			tabIndex: 0,
			title: "Count of recipes per ingredients"
		}
	},
	mounted (){
		axios.get(this.deploy_to + 'backoffice/stats/', {headers: {
				'Authorization': `${this.$store.getters.getTokenToSend}`
		}})
		.then(response => {
			this.ingredientsStats = response.data.ingredientStats
			this.categoryStats = response.data.categoryStats
			this.dietStats = response.data.dietStats
			this.dishStats = response.data.dishStats
			this.difficultyStats = response.data.difficultyStats,
			this.totalRows = this.ingredientsStats.length
			this.stats = this.ingredientsStats
		})
		.catch(error => {
			console.log(error)
		})
	},
	methods: {
		onIngredientFiltered(filteredItems) {
			this.totalRows = filteredItems.length
			this.currentPage = 1
		},
		changeTab(){
			if(this.tabIndex == 0){
				this.title = "Count of recipes per ingredients"
				this.stats = this.ingredientsStats
				this.totalRows = this.stats.length
				this.fields = [
					{ key: 'id', label: 'Ingredient Id', sortable: true, class: 'text-center align-middle'},
					{ key: 'name', label: 'Ingredient Name', class: 'text-center align-middle'},
					{ key: 'total', label: '#Recipes', sortable: true, class: 'text-center align-middle'}
				]
			} else if(this.tabIndex == 1){
				this.title = "Count of recipes per category"
				this.stats = this.categoryStats
				this.totalRows = this.stats.length
				this.fields = [
					{ key: 'category', label: 'Category Id', sortable: true, class: 'text-center align-middle'},
					{ key: 'category__name', label: 'Category Name', class: 'text-center align-middle'},
					{ key: 'total', label: '#Recipes', sortable: true, class: 'text-center align-middle'}
				]
			} else if(this.tabIndex == 2){
				this.title = "Count of recipes per diet"
				this.stats = this.dietStats
				this.totalRows = this.stats.length
				this.fields = [
					{ key: 'diets__id', label: 'Diet Id', sortable: true, class: 'text-center align-middle'},
					{ key: 'diets__name', label: 'Diet Name', class: 'text-center align-middle'},
					{ key: 'total', label: '#Recipes', sortable: true, class: 'text-center align-middle'}
				]
			} else if(this.tabIndex == 3){
				this.title = "Count of recipes per dish type"
				this.stats = this.dishStats
				this.totalRows = this.stats.length
				this.fields = [
					{ key: 'dishType', label: 'Dish Id', sortable: true, class: 'text-center align-middle'},
					{ key: 'dishType__name', label: 'Dish Name', class: 'text-center align-middle'},
					{ key: 'total', label: '#Recipes', sortable: true, class: 'text-center align-middle'}
				]
			} else if(this.tabIndex == 4){
				this.title = "Count of recipes per difficulty"
				this.stats = this.difficultyStats
				this.totalRows = this.stats.length
				this.fields = [
					{ key: 'difficulty', label: 'Difficulty', sortable: true, class: 'text-center align-middle'},
					{ key: 'total', label: '#Recipes', sortable: true, class: 'text-center align-middle'}
				]
			}
		},
		getDifficultyText(id){
			if(id == 1) return 'Easy'
			if(id == 2) return 'Medium'
			if(id == 3) return 'Hard'

		}
	}
}
</script>

<style scoped>
</style>