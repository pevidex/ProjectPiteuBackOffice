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
                        @load="onImgLoad()"
                        @error="imgLoadError()"
                        width="300px">
                    </v-img>
                </v-col>
                <v-col cols="12" class="form-group">
                    <v-file-input prepend-icon="mdi-camera" show-size label="Upload Photo" @change="preview_image" />
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

var utils = require('../../utils');

export default {
    name: "AddIngredients",
    data(){
        return {
            deploy_to : process.env.VUE_APP_DATABASE,
            uploadedFile: null,
            uploadedUrl: null,
            isImageLoaded: false,
            err: null,
            success: null,
            valid: false,
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
            this.name = null
            this.category = null
            this.diets = null
            this.uploadedUrl = null
            this.uploadedFile = null
            this.currentIngredient = null
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
        }
        ,
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
                utils.processImageFile(file,this,true);
                this.currentIngredient.img = this.uploadedUrl
            } else {
                this.uploadedUrl = null
                this.uploadedFile = null
            }
        },
        onImgLoad(){
            this.isImageLoaded = true
        },
        imgLoadError(){
            this.isImageLoaded = false
        },
        validateIngredient(){
            if(this.currentIngredient.name.length < 2){
                this.showErr("Name is too short");
                return false
            }
            if(!this.isImageLoaded && !this.uploadedUrl){
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
                console.log("VALID")
                var imageUrl = ""
                if(this.uploadedUrl != null){
                    imageUrl = await this.uploadImageToStorage(this.uploadedUrl)
                } else {
                    console.log("image is not downloaded");
                    //imageUrl = this.currentIngredient.img
                }
                const ingredient = {
                    name: this.currentIngredient.name,
                    img: imageUrl,
                    category: this.currentIngredient.category,
                    diets: this.currentIngredient.diets ? this.currentIngredient.diets.map(d => d.id) : []
                }
                console.log(ingredient)
                axios.post(this.deploy_to + 'ingredient/', ingredient,{headers: {
                    'Authorization': `Token ${this.$store.getters.getToken}`}})
                .then((response) => {
                    this.showSuccess("status "+response.status)
                    this.clearForms()
                })
                .catch(errors => {
                    console.log(errors)
                    this.showErr(errors)
                })
            }
        }, generateImageName(filename){
            console.log("generating image name from: " + filename)
            const fileExtension = "." + filename.split('.').pop();
            const randomInt = "_" + Math.floor(Math.random() * 10000)
            return this.currentIngredient.category + "_" + this.currentIngredient.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + randomInt + fileExtension
        },
        async uploadImageToStorage(filename){
            console.log("uploaded image")
            const fileName = this.generateImageName(filename)
            const signedUrl = await this.getSignedUrl(fileName)
            var bodyFormData = new FormData()
            Object.keys(signedUrl.fields).forEach(key => {
                bodyFormData.append(key, signedUrl.fields[key]);
            })
            bodyFormData.append('file', this.uploadedFile, fileName)
            console.log("name: "+fileName+" size: "+this.uploadedFile.size+" type: "+this.uploadedFile.type);
            //Remove default headers for S3 Communication
            var axiosForS3 = axios.create();
            delete axiosForS3.defaults.headers.common['Authorization'];
            delete axiosForS3.defaults.headers.common['Content-Type'];

            return axiosForS3.post(signedUrl.url, bodyFormData)
                            .then(resp => Vue.Constants.S3_STORAGE_BASE_URL + signedUrl.fields["key"])
                            .catch(errors => {
                                console.log("S3 ERROR: " + errors)
                            })
        },
        async getSignedUrl(fileName){
            return axios.post(this.deploy_to + 's3/signed-url/', {"fileName": fileName}, {headers: {'Authorization': `Token ${this.$store.getters.getToken}`}})
                        .then(resp => resp.data)
                        .catch(errors => {
                            console.log("Getting signed url Error: " + errors)
                        })
        },
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