<template>
	<v-container fill-height fluid>
		<v-row align="center" justify="center">
			<v-col cols="12">
			<v-card class="pt-3 mt-10">
				<v-card-subtitle>Update diets for categories, all of the corresponding ingredients are updated</v-card-subtitle>
				<b-table 
					class="text-center my-3 px-2"
					show-empty
					small
					stacked="md"
					:items="categories"
					:fields="fields"
				>


				<template v-slot:cell(actions)="row">
					<v-row align="center" justify="center">
						<v-col cols="3" md="6" >
							<v-select
								v-model="row.item['diets']"
								:items="diets"
								item-text="name"
								return-object
								label="Exlude from Diets"
								multiple>
							</v-select>
						</v-col>
						<v-col cols="1" md="2">
							<v-btn small color="green" v-on:click="updateCategoryDiets(row.item)">
								Submit
							</v-btn>
						</v-col>
					</v-row>
				</template>
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
	name: "Diets",
	data (){
		return {
			deploy_to : process.env.VUE_APP_DATABASE,
			categories: [],
			diets: [],
			fields: [
						{ key: 'name', label: 'Category Name', class: 'text-center align-middle'},
						{ key: 'actions', label: 'Actions' }
					],
		}
	},
	mounted (){
		axios.get(this.deploy_to + 'category/',{headers: {
				'Authorization': `${this.$store.getters.getTokenToSend}`
			}})
			.then(response => {
				this.categories = response.data.results
			})
			.catch(error => {
				console.log(error)
			})
		
		axios.get(this.deploy_to + 'diet/',{headers: {
				'Authorization': `${this.$store.getters.getTokenToSend}`
			}})
			.then(response => {
				this.diets = response.data.results
			})
			.catch(error => {
				console.log(error)
			})
	},
	methods: {
		updateCategoryDiets(item){
			if(confirm(`Are you sure you want to add diets: [${this.getCategoryDietsToText(item)}] to all ingredients of ${item.name}?`)){
				
				const data = {
					categoryId: item.id,
					diets: item.diets.map(d => d.id)
				}

				axios.post(this.deploy_to + 'backoffice/diets/update-categories/', data,  {headers: {
														'Authorization': `${this.$store.getters.getTokenToSend}`
				}})
				.then(response => {
					console.log(response)
				})
				.catch(error => {
					console.log(error)
				})
			}
		},
		getCategoryDietsToText(item){
			var diets = ""
			if(item.diets != undefined && item.diets != null){
				diets = item.diets.map(d=> d.name).join(', ')
			}
			return diets
		}
	}
}
</script>

<style scoped>
</style>