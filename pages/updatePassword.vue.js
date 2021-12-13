var UpdatePassword = {
	template: `
    <div class="content-wrap">
        <div class="create-account-page">
            <h3>Update Your Password</h3>
            <div class="login-form">
                <div id="msgArea" class="login-message"></div>
                <form id="createUserForm" novalidate @submit.prevent="checkForm">
                    <div id="caPass" class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" class="form-control" id="loginPassword" required v-model="userDetails.password">
                    </div>
                    <div id="caPassA" class="form-group">
                        <label for="loginPasswordAgain">Password Again</label>
                        <input type="password" class="form-control" id="loginPasswordAgain" required v-model="userDetails.passwordAgain">
                        <div class="error-message"></div>
                    </div>

                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            pageData: [],
            userDetails: {
                password: '',
            },
            userId: 0,
            formErrors: 0,
            accountToken: '',
            is_logged_in: 0,
            savingForm: 0,
        }
    },
    methods: {
        checkForm: async function() {
            this.formErrors = this.formErrors + this.checkPassword()
            
            if(this.formErrors == 0)
            {
                this.savingForm = 1

                let toSave = {
                    password: this.userDetails.password,
                }

                axios({
                    method: 'post',
                    url: this.$apiUrl + 'wp-json/wp/v2/users/' + this.userId,
                    data: JSON.stringify(toSave),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + this.accountToken
                    }
                })
                .then((res) => {
                    //console.log(res)
                    this.savingForm = 0

                    document.getElementById('msgArea').textContent = "Password updated."
                    document.getElementById('msgArea').classList.add("active")

                    setTimeout(function(){ 
                        document.getElementById('msgArea').textContent = ""
                        document.getElementById('msgArea').classList.remove("active")
                    }, 3000)
                })
                .catch((err) => {
                    this.savingForm = 0
                    document.getElementById('caPassA').classList.add("invalid")
                    document.getElementById('caPassA').querySelector('.error-message').textContent = "Password is invalid"

                    console.log(err)
                });
            }
        },
        checkPassword: function() {
            let pass1 = document.getElementById('loginPassword')
            let pass2 = document.getElementById('loginPasswordAgain')

            if(pass1.value.length < 8)
            {
                document.getElementById('caPass').classList.add("invalid")
                document.getElementById('caPassA').classList.add("invalid")

                document.getElementById('caPassA').querySelector('.error-message').textContent = "Password must be at least 8 characters long."
                return 1
            }
            else
            {
                if(pass1.value != pass2.value)
                {
                    document.getElementById('caPass').classList.add("invalid")
                    document.getElementById('caPassA').classList.add("invalid")

                    document.getElementById('caPassA').querySelector('.error-message').textContent = "Password do not match."
                    return 1
                }
                else
                {
                    return 0
                }
            }
        },
    },
    beforeRouteUpdate (to, from, next) {
        this.pageData = []
        this.$store.state.navOpen = 0

        if(localStorage.abpAccessToken)
        {
            let tokenObject = JSON.parse(localStorage.abpAccessToken)
            this.userId = tokenObject.profile.id
            this.accountToken = tokenObject.token
        }
        next()
    },
    beforeRouteEnter: function (to, from, next)
    {
        next(vm => {
            vm.$store.state.navOpen = 0
            
            if(localStorage.abpAccessToken)
            {
                let tokenObject = JSON.parse(localStorage.abpAccessToken)
                vm.userId = tokenObject.profile.id
                vm.accountToken = tokenObject.token
            }
        })
    },
    mounted: function() {
        
    }
};