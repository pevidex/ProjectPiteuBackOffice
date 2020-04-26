<template>
    <div class="container">
        <button class="btn btn-info" @click="downloadDb()">Export db</button>
        <br>
        <button class="btn btn-info" @click="downloadRecipeRequests()">Export all history of create recipe requests</button>
    </div>
</template>

<script>
import axios from 'axios'


export default {
    name: "ExportData",
    methods: {
        downloadDb(){
            axios({
                method: 'get',
                url: process.env.VUE_APP_DATABASE+'exportdb',
                responseType: 'arraybuffer'
            })
            .then(response => {
                
                this.forceFileDownload(response,"db-backup.json")
                
            })
            .catch(() => console.log('error occured'+process.env.VUE_APP_DATABASE+'exportdb'))
        },
        downloadRecipeRequests(){
            axios({
                method: 'get',
                url: process.env.VUE_APP_DATABASE+'exportCreateRecipesRequests',
                responseType: 'arraybuffer'
            })
            .then(response => {
                this.forceFileDownload(response,"recipes.json")
            })
            .catch(() => console.log('error occured'+process.env.VUE_APP_DATABASE+'exportdb'))
        },
        forceFileDownload(response,fileName){
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileName) //or any other extension
            document.body.appendChild(link)
            link.click()
        },
    }
}
</script>

<style scoped>

</style>