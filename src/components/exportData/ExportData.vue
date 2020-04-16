<template>
    <div class="container">
        <button class="btn btn-info" @click="downloadDb()">Export db</button>
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
                
                this.forceFileDownload(response)
                
            })
            .catch(() => console.log('error occured'+process.env.VUE_APP_DATABASE+'exportdb'))
        },
        forceFileDownload(response){
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'db-backup.json') //or any other extension
            document.body.appendChild(link)
            link.click()
        },
    }
}
</script>

<style scoped>

</style>