<template>
<div>
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
      :default-sort="['id', 'asc']"
      @filtered="onFiltered"
    >
      <template v-slot:cell(name)="row">
        {{ row.value }}
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
          <b-row align-v='center' justify='center'>
            <b-col cols="4">
              <b-img thumbnail fluid right :src=row.item.img></b-img>
            </b-col>
            <b-col cols="4">
              <p class="text-left mx-10" v-html="showIngredientDetails(row.item).replace(/(?:\r\n|\r|\n)/g, '<br />')"></p>
            </b-col>
            <b-col cols=12>
                <b-button variant="danger" v-on:click="row.item.is_valid=false; handleSubmit(row.item)" v-show="row.item.is_valid">Invalidate Ingredient</b-button>
                <b-button variant="success" v-on:click="row.item.is_valid=true; handleSubmit(row.item)" v-show="!row.item.is_valid">Validate Ingredient</b-button>
            </b-col>
          </b-row>
        </b-card>
      </template>
    </b-table>
    <!-- EDIT INGREDIENT -->
    <b-modal 
      v-model="show"
      ok-title="Update Ingredient"
      @ok="handleSubmit"
      >
      <div v-if="editedIngredient">
        <b-row align='center'>
            <b-col cols="4">
              <img align='right' :src=editedIngredient.img>
            </b-col>
            <b-col cols="8">
              <p class="text-left mx-10" v-html="showIngredientDetails(editedIngredient).replace(/(?:\r\n|\r|\n)/g, '<br />')"></p>
            </b-col>
          </b-row>
        <!--<p><b>Ingredient name:</b> {{ingredient.name}}</p>
        <p><b>Category:</b> {{ingredient.category}}</p>-->
        <b-row class="mb-1">
          <b-col cols="12"><b-form-input v-model="editedIngredient.img" id="input-small" size="sm" placeholder="Image url"></b-form-input></b-col>
          <b-col cols="3">Category</b-col>
          <b-col>
            <b-form-select
                v-model="selectedCategory"
                :options="categoriesAsOptions"
                value-field="value"
                text-field="text"
                v-on:change="setCategory"
              ></b-form-select>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="12">
            <b-form-group label="Exclude from Diets">
              <b-form-checkbox
              v-for="diet in diets"
              v-model="selectedDiets"
              :key="diet.id"
              :value="diet"
              inline>
                {{ diet.name }}
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </b-container>
</div>
</template>

<script>
import axios from 'axios'
  export default {
    data() {
      return {
        err : null,
        success : null,
        deploy_to : process.env.VUE_APP_DATABASE,
        items: [],
        show: false,
        ingredient: null,
        editedIngredient: null, //this.ingredient before submission
        categoriesAsOptions: [],
        categories: [],
        diets: [],
        selectedCategory: "",
        selectedDiets: [],
        fields: [
          { key: 'id', label: 'Ingredient Id', sortable: true, class: 'text-center' },
          { key: 'name', label: 'Name', sortable: true, class: 'text-center' },
          { key: 'category.name', label: 'Category', sortable: true, class: 'text-center' },
          { key: 'actions', label: 'Actions' }
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        pageOptions: [5, 10, 15],
        sortBy: 'id',
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
        axios.get(this.deploy_to + 'backoffice/ingredients/',{headers: {
                'Authorization': `${this.$store.getters.getTokenToSend}`
            }})
            .then(response => {
                this.items = response.data
                this.totalRows = this.items.length
                })
            .catch(error => {
                this.showErr(error)
                console.log(error)
            }),
            axios.get(this.deploy_to + 'category/', {headers: {
                'Authorization': `Token ${this.$store.getters.getToken}`
            }}).then(resp => {
                this.categories = resp.data.results
                for(var i=0;i<this.categories.length;i++){
                  this.categoriesAsOptions.push({"value":this.categories[i],"text":this.categories[i].name})
                }
            }).catch(errors => {
                this.showErr(errors)
                console.log(errors)
            }),
            axios.get(this.deploy_to + 'diet/', {headers: {
                'Authorization': `Token ${this.$store.getters.getToken}`
            }}).then(resp => {
                this.diets = resp.data.results
            }).catch(errors => {
                this.showErr(errors)
                console.log(errors)
            })
    },

    methods: {
      info(item) {
        this.editedIngredient = item
        this.selectedCategory = {"value":this.editedIngredient.category,"text":this.editedIngredient.category.name}
        this.selectedDiets = this.editedIngredient.diets
        this.show=true
      },
      showErr(msg){
          this.err = msg
          setTimeout(() => this.err = null, 3000);
      },
      showSuccess(msg){
          this.success = msg
          setTimeout(() => this.success = null, 3000);
      },
      showIngredientDetails(item){
        this.editedIngredient = item
        var details = "id:" + item.id + "\nname: " + item.name + "\ncategory: " + item.category.name + "\ndiets: " + item.diets.map(d => d.name) + "\nvalid: " + item.is_valid + "\ndeleted: " + item.is_deleted 
        return details
      },
      setCategory(){
        this.editedIngredient.category = this.selectedCategory
      }
      ,
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      handleSubmit() {
        //todo add confirm modal before submit
        this.editedIngredient.diets = this.selectedDiets
        this.ingredient = this.editedIngredient
        axios.post(this.deploy_to + 'backoffice/edit/ingredient/'+this.ingredient.id+"/", this.ingredient, {headers: {
                'Authorization': `Token ${this.$store.getters.getToken}`}})
                    .then((response) => {
                        this.showSuccess("Success")
                        console.log(response);
                    })
                    .catch(errors => {
                        this.showErr(errors)
                        console.log(errors.status)
                    })
      }
    }
  }
</script>