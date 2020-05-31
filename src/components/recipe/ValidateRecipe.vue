<template>
<div>
 <h1> Receitas </h1>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
      <b-col lg="6" class="my-1">
        <b-form-group
          label="Sort"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          label-for="sortBySelect"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-select v-model="sortBy" id="sortBySelect" :options="sortOptions" class="w-75">
              <template v-slot:first>
                <option value="">-- none --</option>
              </template>
            </b-form-select>
            <b-form-select v-model="sortDesc" size="sm" :disabled="!sortBy" class="w-25">
              <option :value="false">Asc</option>
              <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Initial sort"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          label-for="initialSortSelect"
          class="mb-0"
        >
          <b-form-select
            v-model="sortDirection"
            id="initialSortSelect"
            size="sm"
            :options="['asc', 'desc', 'last']"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filter"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          label-for="filterInput"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Type to Search"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filter On"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          description="Leave all unchecked to filter on all data"
          class="mb-0">
          <b-form-checkbox-group v-model="filterOn" class="mt-1">
            <b-form-checkbox value="id">Id</b-form-checkbox>
            <b-form-checkbox value="validated">Valid</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
      </b-col>

      <b-col sm="5" md="6" class="my-1">
        <b-form-group
          label="Per page"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="right"
          label-size="sm"
          label-for="perPageSelect"
          class="mb-0"
        >
          <b-form-select
            v-model="perPage"
            id="perPageSelect"
            size="sm"
            :options="pageOptions"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col sm="7" md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>

    <b-alert variant="success" v-if="this.success" show>{{this.success}}</b-alert>
    <b-alert variant="danger" v-if="this.err" show>{{this.err}}</b-alert>
    <!-- Main table element -->
    <b-table
      show-empty
      small
      stacked="md"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filterIncludedFields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      @filtered="onFiltered"
    >
      <template v-slot:cell(name)="row">
        {{ row.value.first }} {{ row.value.last }}
      </template>

      <template v-slot:cell(actions)="row">

        <b-button variant="warning" size="sm" @click="info(row.item)" class="mr-1">
          Edit
        </b-button>
        <b-button variant="outline-primary" size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
          </ul>
        </b-card>
      </template>
    </b-table>
    <!-- Info modal -->
    <b-modal 
      v-model="show"
      @ok="handleSubmit"
      >
      <div v-if="recipe">
        <pre>{{recipe}}</pre>
        <b-row class="mb-1">
          <b-col cols="3">Cuisine</b-col>
          <b-col>
            <b-form-select
                v-model="selectedCuisine"
                :options="cuisinesAsOptions"
                v-on:change="setCuisine"
              ></b-form-select>
          </b-col>
        </b-row>
        <b-row class="mb-1">   
            <b-col>
                <b-button variant="danger" v-on:click="recipe.validated=false" v-show="recipe.validated">Invalidate Recipe</b-button>
                <b-button variant="success" v-on:click="recipe.validated=true" v-show="!recipe.validated">Validate Recipe</b-button>
            </b-col> 
        </b-row>
      </div>
    </b-modal>
  </b-container>
</div>
</template>

<script>

//todo update Recipe in table on submit (in ingredient it updates but here not ??)

import axios from 'axios'
  export default {
    data() {
      return {
        err : null,
        success : null,
        deploy_to : process.env.VUE_APP_DATABASE,
        items: [],
        show: false,
        recipe: null,
        cuisinesAsOptions: [],
        cuisines: [],
        selectedCuisine: "",
        fields: [
          { key: 'id', label: 'Recipe Id', sortable: true, class: 'text-center' },
          { key: 'validated', label: 'Valid', sortable: true, class: 'text-center' },
          { key: 'actions', label: 'Actions' }
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        pageOptions: [5, 10, 15],
        sortBy: '',
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        filterOn: []
      }
    },
    computed: {
      sortOptions() {
        // Create an options list from our fields
        return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key }
          })
      }
    },
    mounted (){
        axios.get(this.deploy_to + 'backoffice/recipes/',{headers: {
                'Authorization': `${this.$store.getters.getTokenToSend}`
            }})
            .then(response => {
                this.items = response.data
                this.totalRows = this.items.length
                })
            .catch(error => {
            console.log(error)
            }),
            axios.get(this.deploy_to + 'cuisine/', {headers: {
                'Authorization': `Token ${this.$store.getters.getToken}`
            }}).then(resp => {
                this.cuisines = resp.data.results
                for(var i=0;i<this.cuisines.length;i++){
                  this.cuisinesAsOptions.push({"value":this.cuisines[i],"text":this.cuisines[i].name})
                }
            }).catch(errors => {
                this.showErr(errors)
                console.log(errors)
            })
    },

    methods: {
      info(item) {
        axios.get(this.deploy_to + 'backoffice/recipe/'+item.id+"/", {headers: {
            'Authorization': `Token ${this.$store.getters.getToken}`}})
                .then((response) => {
                    this.recipe = response.data
                    this.selectedCuisine = {"value":this.recipe.cuisine,"text":this.recipe.cuisine.name}
                    this.show=true
                })
                .catch(errors => {
                    this.showErr(errors)
                    console.log(errors)
                })
      },
      showErr(msg){
          this.err = msg
          setTimeout(() => this.err = null, 3000);
      },
      showSuccess(msg){
          this.success = msg
          setTimeout(() => this.success = null, 3000);
      },
      setCuisine(){
        this.recipe.cuisine = this.selectedCuisine
      }
      ,
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      handleSubmit() {
        //todo add confirm modal before submit
        axios.post(this.deploy_to + 'backoffice/edit/recipe/'+this.recipe.id+"/", this.recipe, {headers: {
                'Authorization': `Token ${this.$store.getters.getToken}`}})
                    .then((response) => {
                        this.showSuccess("status "+response.status)
                        console.log(response);
                    })
                    .catch(errors => {
                        this.showErr(errors)
                        console.log(errors)
                    })
      }
    }
  }
</script>