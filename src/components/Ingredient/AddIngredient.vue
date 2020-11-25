<template>
    <v-container fill-height style="width:100%">
        <v-row justify="center" align="center">
        <v-col cols="12" :md="8">
            <v-card class="pa-10">
            <b-alert variant="success" v-if="this.success" show>{{this.success}}</b-alert>
            <b-alert variant="danger" v-if="this.err" show>{{this.err}}</b-alert>
            <form ref='ingredientForm' v-on:submit.prevent="submitIngredient">
            <v-row justify="center" align="center">
                <v-col cols="12">
                    <v-text-field label="Ingredient Name" v-model="currentIngredient.name"></v-text-field>
                </v-col>
                <v-col cols="12" :md="4" >
                    <v-select label="Category" v-model="currentIngredient.category"
                        :items="categories"
                        item-text="name"
                        item-value="id">
                    </v-select>
                </v-col>
                <v-col cols="12" :md="8">
                    <v-select label="Excluded from Diets" v-model="currentIngredient.diets"
                        :items="diets"
                        item-text="name"
                        return-object
                        multiple>
                    </v-select>
                </v-col>
                <v-col cols="12" id="imagePreview" align="center">
                    <v-img 
                        v-if="currentIngredient.img"
                        :src="currentIngredient.img" alt=""
                        contain
                        width="300px">
                    </v-img>
                </v-col>
                <v-col cols="12" class="form-group">
                    <v-file-input prepend-icon="mdi-camera" show-size label="Upload Photo" @change="preview_image" ref="inputImage"/>
                    <span>OR</span>
                    <v-text-field label="URL" v-model="currentIngredient.img" @input="download_image"></v-text-field>
                </v-col>
                <button type="submit" class="btn btn-primary" >Submit</button>
            </v-row>
            </form>
            </v-card>
        </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
import { getSignedUrl, uploadImageFileToS3 } from '@/helpers/s3-image-storage'

var utils = require('../../utils');

export default {
    name: "AddIngredients",
    data(){
        return {
            deploy_to : process.env.VUE_APP_DATABASE,
            uploadedFile: null,
            uploadedUrl: null,
            err: null,
            success: null,
            currentIngredient: {
                "name" : '',
                "img" : '',
                "category" : undefined,
                "diets": undefined
            },
            categories : [],
            diets : [],
            ourIngredients : [],
            fetchedIngredients: [],
        }
    },

    methods: {
         showErr(msg){
          this.err = msg
          setTimeout(() => this.err = null, 3000);
        },
        showSuccess(msg){
            this.success = msg
            setTimeout(() => this.success = null, 3000);
        },
        clearForms(){
            this.currentIngredient = {
                "name" : '',
                "img" : '',
                "category" : undefined,
                "diets": undefined
            },
            this.uploadedUrl = null
            this.uploadedFile = null
            this.$refs.inputImage.reset()
        },
        ingredientNameNormalization(name){
            return name.toLowerCase().replace(/ /g, '-')
        },

        checkIfIngredientExists(name){
            for(const ingredient of this.ourIngredients){
                if(name == ingredient.name){
                    return true
                }
            }
            return false
        }
        ,
        setLocalUrl(url){
            this.uploadedUrl = url;
        }
        ,
        setLocalFile(file){
            this.uploadedFile = file;
        },
        getImageFileName(){
            if(this.uploadedFile){
                return this.uploadedFile.name;
            }
            return this.uploadedUrl
        },
        download_image(){
            console.log("downloading image")
            if(this.currentIngredient.img != ""){
                let proxy = "https://yacdn.org/proxy/"
                utils.downloadImageFile(proxy + this.currentIngredient.img, this);
            }
        }
        ,
        preview_image(file){
            if(file){
                console.log("preview_image in if");
                utils.processImageFile(file,this,true);
                this.currentIngredient.img = this.uploadedUrl
            } else {
                console.log("preview_image in else");
                this.uploadedUrl = null
                this.uploadedFile = null
            }
        },
        validateIngredient(){
            if(this.currentIngredient.name.length < 2){
                this.showErr("Name is too short");
                return false
            }
            if(!this.uploadedFile){
                this.showErr("You must upload an image");
                return false
            }
            if(this.currentIngredient.category == undefined){
                this.showErr("Please select a category");
                return false
            }
            return true
        },
        async submitIngredient(){
            if(this.validateIngredient()) {
                console.log("Ingredient {0} Is Valid", this.currentIngredient.name)

                let fileName = this.generateImageName(this.uploadedFile.name);
                let imageUrl = await uploadImageFileToS3(this.deploy_to, this.$store.getters.getToken, this.uploadedFile, fileName);

                const ingredient = {
                    name: this.currentIngredient.name,
                    img: imageUrl,
                    category: this.currentIngredient.category,
                    diets: this.currentIngredient.diets ? this.currentIngredient.diets.map(d => d.id) : []
                }

                console.log(ingredient)
                axios.post(this.deploy_to + 'ingredient/', ingredient, {headers: {
                    'Authorization': `Token ${this.$store.getters.getToken}`}})
                .then((response) => {
                    this.showSuccess("Ingredient Created")
                    this.clearForms()
                })
                .catch(errors => {
                    console.log(errors)
                    this.showErr(errors)
                })
            }
        }, generateImageName(filename){
            let fileExtension = "." + filename.split('.').pop();
            let randomInt = "_" + Math.floor(Math.random() * 10000)
            let name = this.currentIngredient.category + "_" + this.currentIngredient.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + randomInt + fileExtension
            console.log("Generated image name from file {0}, name: {1}", filename, name)
            return name
        }
    },

    created (){

        axios.get(this.deploy_to + 'ingredient/', {headers: {
            'Authorization': `Token ${this.$store.getters.getToken}`}})
                .then(resp => {
            this.ourIngredients = resp.data.results
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
    },

}
</script>

<style scoped>
</style>