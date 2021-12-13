var Login = {
	template: `
    <div class="content-wrap" v-if="loggingIn == 0">
        <div class="login-page">
            <div class="login-form">
                <form novalidate @submit.prevent="logUserIn">
                    <div id="mainLoginMessage" class="login-message"></div>
                    <div id="caUname" class="form-group">
                        <label for="loginUsername">Username</label>
                        <input type="text" class="form-control" id="loginUsername" required v-model="userDetails.username">
                        <div class="error-message"></div>
                    </div>
                    <div id="caPass" class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" class="form-control" id="loginPassword" required v-model="userDetails.password">
                        <div class="error-message"></div>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
            <div class="login-links">
                <router-link to="/createAccount">Create Account</router-link>
            </div>
        </div>
    </div>
    <div class="contentLoader" v-else>
        <div>
            <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            <div class="loading-text">Logging you in...</div>
        </div>
    </div>
    `,
    data() {
        return {
            pageData: [],
            userDetails: {
                password: '',
                username: '',
            },
            userError: 0,
            passError: 0,
            loggingIn: 0,
        }
    },
    methods: {
        logUserIn: function() {
            let usernameField = document.getElementById('loginUsername')
            let passwordField = document.getElementById('loginPassword')
            let mainMessage = document.getElementById('mainLoginMessage')

            if(usernameField.value == "")
            {
                usernameField.parentElement.classList.add("invalid")
                usernameField.parentElement.querySelector('.error-message').textContent = "Username can not be blank."
                this.userError = 1
            }
            else
            {
                usernameField.parentElement.classList.remove("invalid")
                this.userError = 0
            }

            if(passwordField.value == "")
            {
                passwordField.parentElement.classList.add("invalid")
                passwordField.parentElement.querySelector('.error-message').textContent = "Password can not be blank."
                this.passError = 1
            }
            else
            {
                passwordField.parentElement.classList.remove("invalid")
                this.passError = 0
            }
            
            if(this.userError == 0 && this.passError == 0)
            {
                this.loggingIn = 1

                //attempt to login.
                axios
                    .post(this.$apiUrl + 'wp-json/jwt-auth/v1/token', {
                        username: this.userDetails.username,
                        password: this.userDetails.password,
                    })
                    .then((res) => {
                        //console.log(res.data)
                        //remove the error message, and the old access token.
                        mainMessage.classList.remove("error", "active")
                        localStorage.removeItem('abpAccessToken')

                        //add the new token info to local storage.
                        localStorage.abpAccessToken = JSON.stringify(res.data)
                        this.$store.state.display_name = res.data.profile.user_display_name
                        this.$store.state.isLoggedIn = true

                        this.loggingIn = 0
                        router.push({ path: 'profile' })
                    })
                    .catch((err) => {
                        mainMessage.classList.add("error", "active")
                        mainMessage.textContent = "Login Failed: Username or Password is incorrect."
                        this.loggingIn = 0
                    });
            }

        }
    },
    beforeRouteUpdate (to, from, next) {
        this.pageData = []
        this.$store.state.navOpen = 0
        next()
    },
    beforeRouteEnter (to, from, next)
    {
        next(vm => {
            vm.$store.state.navOpen = 0
        })
    },
    mounted: function() {
        
    }
};