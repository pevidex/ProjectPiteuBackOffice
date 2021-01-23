<template>
    <v-container fill-height>
        <v-row>
			<v-col>
				<v-row no-gutters>

					<v-col no-gutters cols="6" >
						<v-row no-gutters >
							<v-file-input class="mt-1" max-height="200px" prepend-icon="mdi-camera" show-size label="Recipe Photo" @change="preview_image" />
						</v-row>

						<v-row no-gutters>
							<span class="ml-5">OR</span>
						</v-row>

						<v-row no-gutters >
							<v-text-field class="pa-0 ma-0" label="URL" v-model="newUrl" @change="download_image"></v-text-field>
						</v-row>
					</v-col>


					<v-col no-gutters cols="6">
						<v-img contain height="150px" :src="newUrl"></v-img>
					</v-col>
				</v-row>
				<v-row v-if="newUrl">
					<v-spacer></v-spacer>
					<v-col no-gutters cols="6" align="center">
						<v-btn d-flex @click="addMainImage">Main Image</v-btn>
						&nbsp;
						<v-btn @click="addAlternativeImage">Alternative Image</v-btn>
					</v-col>
				
				</v-row>
			
				<v-divider/>
				<v-row>
					<v-col align="center">
						<v-btn width="200px" color="#4CAF50" @click="finish">Finish</v-btn>
					</v-col>
					<v-col cols="12" align="center">
						<b-alert variant="danger" v-if="err" show>{{this.err}}</b-alert>
					</v-col>
					<v-col cols="12" align="center">
						<h5>Main Image</h5>
					</v-col>
					<v-col v-if="mainUrl" no-gutters align="center">
						<div class="img-wrap">
							<span @click="deleteMainImage" class="close">&times;</span>
							<img height="150px" contain :src="mainUrl"/>
						</div>

					</v-col>

				</v-row>
				<v-row>
					<v-col cols="12" align="center">
						<h5>Alternative Images</h5>
					</v-col>

					<v-col v-show="alternativeImages.length > 0" no-gutters align="center">
						<v-row style="overflow-y: scroll; max-height: 300px">
							<v-col cols="auto" v-for="(imageObj, index) in alternativeImages" :key="index">
								<div class="img-wrap">
									<span @click="deleteAlternativeImage(index)" class="close">&times;</span>
									<img height="150px" contain :src="imageObj.url"/>
								</div>
							</v-col>
						</v-row>
					</v-col>
					
				</v-row>
			</v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
var utils = require('../../utils');

export default {
	name: "AddIngredientCore",
	props : {
		initialMainUrl: Object,
		initialAlternativeImages: Array,
	},
    data(){
        return {
			deploy_to : process.env.VUE_APP_DATABASE,
			err: "",
			newUrl: "",
			newFile: null,
			mainUrl: "",
			mnainFile: null,
			alternativeImages : this.initialAlternativeImages //List of {url, file}
        }
	},
	created : function () {
		console.log(this.mainUrl)
		if(this.initialMainUrl){
			this.mainUrl = this.initialMainUrl.url
		}
		
		if(this.initialAlternativeImages.length){
			this.alternativeImages = this.initialAlternativeImages
		}
	},

    methods: {
		showErr(msg){
          this.err = msg
          setTimeout(() => this.err = null, 2500);
        },
		preview_image(file){
            if(file){
                utils.processImageFile(file,this,true);
            } else {
                this.newUrl = null;
                this.newFile = null;
            }
		},
		download_image(){
            if(this.newUrl != ""){
                utils.downloadImageFile(this.newUrl, this);
            }
        },
		setLocalUrl(url){
            this.newUrl = url;
        }
        ,
        setLocalFile(file){
            this.newFile = file;
		},
		addMainImage(){
			if(this.newUrl){
				this.mainUrl = this.newUrl,
				this.mainFile = this.newFile

				this.newUrl = ""
				this.newFile = null
			}
		}, 
		addAlternativeImage(){
			if(this.newUrl && this.newFile){
				this.alternativeImages.push({url: this.newUrl, file: this.newFile})
				this.newUrl = ""
				this.newFile = null
			}
		},
		deleteMainImage(){
			this.mainUrl = ""
			this.mainFile = null
		},
		deleteAlternativeImage(index){
			this.alternativeImages.splice(index, 1)
		},
		finish(){
			if(this.mainUrl){
				let allImages = []
				allImages.push({url: this.mainUrl, file: this.mainFile})
				allImages = allImages.concat(this.alternativeImages)
				this.$emit('close', {allImages: allImages})
			} else {
				this.showErr("Please choose one main image");
			}
		}
    },

}
</script>

<style scoped>

.img-wrap {
	display: inline-block;
    position: relative;
	height: 150px;
}
.img-wrap .close {
	color: red;
    position: absolute;
    top: -10px;
    right: -20px;
    z-index: 100;
}
</style>