let Constants = {
	install(Vue, options){
		Vue.Constants = {
			PRODUCTION_MODE: process.env.VUE_APP_PRODUCTION_MODE,
			S3_URL_PROD: process.env.VUE_APP_S3_URL_TEST,
			S3_URL_TEST: process.env.VUE_APP_S3_URL_PROD,
			SCRAPER_URL: process.env.VUE_APP_SCRAPER_URL
		}
	}
}

export default Constants;