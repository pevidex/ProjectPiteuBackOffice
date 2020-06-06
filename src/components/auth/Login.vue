<template>
 <div class="limiter">
		<div class="container-login100">
			<div class="wrap-login100 p-t-50 p-b-90">
				<form class="login100-form validate-form flex-sb flex-w" @submit.prevent="login">
          <span class="login100-form-title p-b-51">
						Welcome to Project Piteu Backoffice
					</span>

					
					<div class="wrap-input100 validate-input m-b-16" data-validate = "Email is required">
						<input class="input100" v-model="email" type="email" placeholder="Email">
						<span class="focus-input100"></span>
					</div>
					
					
					<div class="wrap-input100 validate-input m-b-16" data-validate = "Password is required">
						<input class="input100" v-model="password" type="password" placeholder="Password"/>
						<span class="focus-input100"></span>
					</div>

					<div class="container-login100-form-btn m-t-17">
						<button type="submit" class="login100-form-btn">
							Login
						</button>
					</div>
          <p v-if="err">{{err}}</p>

				</form>
			</div>
		</div>
	</div>

</template>

<script>
  export default {
    data(){
      return {
        email : "",
        password : "",
        err : null
      }
    }, 
    methods: {
      appendScript(script){
        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', script)
        document.head.this.appendChild(recaptchaScript)    
      }
      ,
      login: function () {
        let email = this.email 
        let password = this.password
        this.$store.dispatch('login', { email, password })
       .then(() => this.$router.push('/'))
       .catch(
         err => {
           console.log(err)
            this.err=err
          }
       )
      }
    },
    mounted() {
      this.appendScript("../../../public/assets/vendor/jquery/jquery-3.2.1.min.js")
      this.appendScript("../../../public/assets/vendor/animsition/js/animsition.min.js")
      this.appendScript("../../../public/assets/vendor/bootstrap/js/popper.js")
      this.appendScript("../../../public/assets/vendor/bootstrap/js/bootstrap.min.js")
      this.appendScript("../../../public/assets/vendor/select2/select2.min.js")
      this.appendScript("../../../public/assets/vendor/daterangepicker/moment.min.js")
      this.appendScript("../../../public/assets/vendor/daterangepicker/daterangepicker.js")
      this.appendScript("../../../public/assets/vendor/countdowntime/countdowntime.js")
      this.appendScript("../../../public/assets/js/main.js")
    }, 
  }
</script>