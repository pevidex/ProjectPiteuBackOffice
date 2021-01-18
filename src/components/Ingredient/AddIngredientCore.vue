<template>
    <v-container fill-height>
        <v-row no-gutters justify="center" align="center">
            <b-alert variant="success" v-if="this.success" show>{{this.success}}</b-alert>
            <b-alert variant="danger" v-if="this.err" show>{{this.err}}</b-alert>
            <v-col justify="space-around" align="center" cols="12">
              
            <form ref='ingredientForm' v-on:submit.prevent="submit">
            <v-row no-gutters >
              <v-text-field label="Ingredient Name" v-model="currentIngredient.name"></v-text-field>
            </v-row>
            <v-row no-gutters justify="center" align="center">
                    <v-select label="Category" v-model="currentIngredient.category"
                        :items="categories"
                        item-text="name"
                        return-object>
                    </v-select>
            </v-row>
            <v-row no-gutters justify="center" align="center">
                <v-col cols="12">
                    <b-form-group label="Exclude from Diets">
                        <b-form-checkbox-group
                            v-model="currentIngredient.diets"
                            :options="diets"
                            value-field="id"
                            inline
                            text-field="name"
                            >
                        </b-form-checkbox-group>
                    </b-form-group>
                </v-col>
                
            </v-row>
            <v-row>
              <v-col cols="12" id="imagePreview" align="center">
                    <v-img 
                        v-if="currentIngredient.img"
                        :src="currentIngredient.img" alt=""
                        contain
                        max-width="300px"
                        max-height="150px"
                        >
                    </v-img>
                </v-col>
                <v-col justify="center" cols="12" class="form-group">
                    <v-file-input prepend-icon="mdi-camera" show-size label="Upload Photo" @change="preview_image" ref="inputImage"/>
                    <span>OR</span>
                    <v-text-field label="URL" v-model="currentIngredient.img" @input="download_image"></v-text-field>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col cols="12">
                    <button type="submit" class="btn btn-primary" >Submit</button>
                </v-col>
            </v-row>
            </form>
            
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import { getSignedUrl, uploadImageFileToS3 } from '@/helpers/s3-image-storage'
import { mapExternalIngredients } from '@/helpers/searchModelsBySimilarity'

var utils = require('../../utils');

export default {
    name: "AddIngredientCore",
    props : {
        initialName: {
            type: String,
            default: ''
        },
        initialUrl: {
            type: String,
            default: ''
        },
        initialCategory : {
            type: Object,
            default: undefined
        },
        initialDiets : {
            type: Array,
            default:() => []
        },
        initialEditIngredientId : {
            type: Number,
            default: undefined
        }, parentRequestId : {
            type: Number,
            default: undefined
        }
    },
    data(){
        return {
            deploy_to : process.env.VUE_APP_DATABASE,
            uploadedFile: null,
            uploadedUrl: null,
            err: null,
            success: null,
            currentIngredient: {
                "name" : this.initialName,
                "img" : this.initialUrl,
                "category" : this.initialCategory,
                "diets": this.convertDietObjArrayToIds(this.initialDiets)
            },
            categories : [],
            diets : [],
            ourIngredients : [],
            editIngredientId : this.initialEditIngredientId
        }
    },

    methods: {
         showErr(msg, timeout=3000){
          this.err = msg
          setTimeout(() => this.err = null, timeout);
        },
        showSuccess(msg){
            this.success = msg
            setTimeout(() => this.success = null, 3000);
        },
        clearForms(){
            //File input form must be manually cleared to avoid bugs 
            this.currentIngredient = {
                "name" : '',
                "img" : '',
                "category" : undefined,
                "diets": undefined
            },
            this.uploadedUrl = null
            this.uploadedFile = null
        },
        ingredientNameNormalization(name){
            return name.toLowerCase().replace(/ /g, '-')
        },

        checkIfIngredientExists(name){
            for(var i = 0; i < this.ourIngredients.length; i++){
                if(name.toLowerCase().trim() === this.ourIngredients[i].name.toLowerCase().trim()){
                    return true
                }
            }
            return false;
        }
        ,
        setLocalUrl(url){
            this.uploadedUrl = url;
        }
        ,
        setLocalFile(file){
            console.log("Image file stored")
            this.uploadedFile = file;
        },
        getImageFileName(){
            if(this.uploadedFile){
                return this.uploadedFile.name;
            }
            return this.uploadedUrl
        },
        download_image(){
            if(this.currentIngredient.img != ""){
                console.log("downloading image")
                utils.downloadImageFile(this.currentIngredient.img, this);
                this.currentIngredient.img = this.uploadedUrl
            }
        }
        ,
        preview_image(file){
            if(file){
                utils.processImageFile(file,this,true);
                this.currentIngredient.img = this.uploadedUrl
            } else {
                this.uploadedUrl = null
                this.uploadedFile = null
            }
        },
        validateIngredient(){
            if(this.currentIngredient.name.length < 2){
                this.showErr("Name is too short");
                return false
            }
            if(!this.isInEditMode() && this.checkIfIngredientExists(this.currentIngredient.name)){
                this.showErr("Ingredient with this name already exists");
                return false
            }
            if(!this.uploadedFile && !this.currentIngredient.img){
                this.showErr("You must upload an image");
                return false
            }
            if(this.currentIngredient.category == undefined){
                this.showErr("Please select a category");
                return false
            }
            return true
        },
        isInEditMode(){
            return this.editIngredientId !== undefined;
        },
        convertDietObjArrayToIds(dietObjects){
            return dietObjects.map(x => x.id)
        },
        convertDietIdsToObjectArray(dietIds){
            return this.diets.filter(d => dietIds.includes(d.id))
        },
        async checkSimilarIngredients(ingredientName){
            const ingredientMapping = await mapExternalIngredients([ingredientName], this.deploy_to, `Token ${this.$store.getters.getToken}`)
            const suspectIngredients = ingredientMapping[ingredientName]
            let similarIngredients = []


            if(suspectIngredients)
                similarIngredients = suspectIngredients.filter(r => r.similarity >= 0.35).map(r => r.name)
            
            return similarIngredients;
        },

        async submit(){
            
            if(this.validateIngredient()) {
                console.log("Ingredient {0} Is Valid", this.currentIngredient.name)

                
                if(this.isInEditMode()){
                    //Need to map diet id to diet object
                    this.currentIngredient.diets = this.diets.filter(d => this.currentIngredient.diets.includes(d.id))
                    this.submitEditedIngredient();
                } else {
                    //Inserting new ingredient, need to check for similar ingredients
                    let similarIngredients = await this.checkSimilarIngredients(this.currentIngredient.name)
                    if(similarIngredients.length > 0){
                        //Require Confirmation
                        if(confirm('There are similar ingredients to: ' + this.currentIngredient.name + ', like: ' + similarIngredients.join(', ')))
                            this.submitNewIngredient();
                    } else {
                        this.submitNewIngredient();
                    }
                }
            
            }
        },
        async submitNewIngredient(){
            let fileName = this.generateImageName(this.uploadedFile.name);
            let imageUrl = await uploadImageFileToS3(this.deploy_to, this.$store.getters.getToken, this.uploadedFile, fileName);

            const ingredient = {
                name: this.currentIngredient.name,
                img: imageUrl,
                category: this.currentIngredient.category.id,
                diets: this.currentIngredient.diets
            }

            console.log(ingredient)
            axios.post(this.deploy_to + 'ingredient/', ingredient, {headers: {'Authorization': `Token ${this.$store.getters.getToken}`}})
            .then((response) => {
                this.currentIngredient.id = response.data.id
                this.showSuccess("Ingredient Created With ID: " + this.currentIngredient.id)
                this.$emit('close', {paramList: [this.currentIngredient, this.parentRequestId]})
                this.clearForms()
            })
            .catch(errors => {
                console.log(errors)
                this.showErr(errors)
            })
        },
        async submitEditedIngredient(){
            console.log("submiting edited ingredient: " + this.currentIngredient.name)

            this.currentIngredient.id = this.editIngredientId
            //If image was edited
            if(this.initialUrl !== this.currentIngredient.img){
                if(this.uploadedFile){
                    //Upload local img to S3
                    let fileName = this.generateImageName(this.uploadedFile.name)
                    this.editedIngredient.img = await uploadImageFileToS3(this.deploy_to, this.$store.getters.getToken, this.uploadedImgEdit, fileName)
                }
            }

            axios.post(this.deploy_to + 'backoffice/edit/ingredient/'+this.currentIngredient.id+"/", this.currentIngredient, {headers: {'Authorization': `Token ${this.$store.getters.getToken}`}})
            .then((response) => {
                this.showSuccess("Success")
                this.$emit('close', {paramList: [this.currentIngredient, this.parentRequestId]})
                console.log(response);
            })
            .catch(errors => {
                this.showErr(errors)
                console.log(errors.status)
            })
        },
        generateImageName(filename){
            let fileExtension = "." + filename.split('.').pop();
            let randomInt = "_" + Math.floor(Math.random() * 10000)
            let name = this.currentIngredient.category.id + "_" + this.currentIngredient.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + randomInt + fileExtension
            console.log("Generated image name from file {0}, name: {1}", filename, name)
            return name
        }
    },

    created (){
        axios.get(this.deploy_to + 'backoffice/ingredients/',{headers: {
              'Authorization': `${this.$store.getters.getTokenToSend}`
        }}).then(resp => {
            this.ourIngredients = resp.data
        }).catch(errors => {
            console.log(errors)
            this.showErr(errors)
        })
        
        axios.get(this.deploy_to + 'category/', {headers: {
            'Authorization': `Token ${this.$store.getters.getToken}`}})
        .then(resp => {
            this.categories = resp.data.results
        }).catch(errors => {
            console.log(errors)
            this.showErr(errors)
        })

        axios.get(this.deploy_to + 'diet/', {headers: {
                'Authorization': `Token ${this.$store.getters.getToken}`
        }}).then(resp => {
            this.diets = resp.data.results
        }).catch(errors => {
            this.showErr(errors)
            console.log(errors)
        })

        console.log(this.currentIngredient)
    },

}
</script>

<style scoped>
</style>