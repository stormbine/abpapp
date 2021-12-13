var CreateAccount = {
	template: `
    <div class="content-wrap">
        <div class="create-account-page">
            <h3>Create Account</h3>
            <p>Please fill out the following fields to create your account</p>
            <div class="login-form">
                <form id="createUserForm" novalidate @submit.prevent="checkForm">
                    <div id="caFname" class="form-group">
                        <label for="loginFirstName">First Name</label>
                        <input type="text" class="form-control" id="loginFirstName" required v-model="userDetails.firstName">
                        <div class="error-message"></div>
                    </div>
                    <div id="caLname" class="form-group">
                        <label for="loginLastName">Last Name</label>
                        <input type="text" class="form-control" id="loginLastName" required v-model="userDetails.lastName">
                        <div class="error-message"></div>
                    </div>
                    <div id="caEmail" class="form-group">
                        <label for="loginEmail">Email</label>
                        <input type="email" class="form-control" id="loginEmail" required v-model="userDetails.email">
                        <div class="error-message"></div>
                    </div>
                    <div id="caUname" class="form-group">
                        <label for="loginUsername">Username</label>
                        <input type="text" class="form-control" id="loginUsername" required v-model="userDetails.username">
                        <div class="error-message"></div>
                    </div>
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
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                passwordAgain: '',
                username: '',
            },
            formErrors: 0,
            usernameErrors: 0,
            accountToken: '',
        }
    },
    methods: {
        checkForm: async function() {
            this.formErrors = this.formErrors + this.checkRequired("loginFirstName")
            this.formErrors = this.formErrors + this.checkRequired("loginLastName")
            this.formErrors = this.formErrors + this.checkRequired("loginEmail")
            this.formErrors = this.formErrors + this.checkRequired("loginUsername")
            this.formErrors = this.formErrors + this.checkPassword()
            
            //if no other errors check that there isnt a duplicate username.
            if(this.formErrors == 0)
            {
                let usernameCheck = await this.checkUsername(this.userDetails.username)
                if(usernameCheck > 0 )
                {
                    document.getElementById('caUname').classList.add("invalid")
                    document.getElementById('caUname').querySelector('.error-message').textContent = "This Username already exists in our system."
                    this.usernameErrors = 1
                }
                else
                {
                    this.usernameErrors = 0
                }
            }
            
            if(this.formErrors == 0 && this.usernameErrors == 0)
            {
                let toSave = {
                    username: this.userDetails.username,
                    password: this.userDetails.password,
                    first_name: this.userDetails.firstName,
                    last_name: this.userDetails.lastName,
                    email: this.userDetails.email
                }

                axios({
                    method: 'post',
                    url: this.$apiUrl + 'wp-json/wp/v2/users',
                    data: JSON.stringify(toSave),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + this.accountToken
                    }
                })
                .then((res) => {
                    router.push({ path: 'login' })
                })
                .catch((err) => {
                    document.getElementById('caEmail').classList.add("invalid")
                    document.getElementById('caEmail').querySelector('.error-message').textContent = "This email already exists in our system."
                });
            }
        },
        checkRequired: function(fieldId) {
            let toCheck = document.getElementById(fieldId)

            if(toCheck.value == "")
            {
                toCheck.parentElement.classList.add("invalid")
                toCheck.parentElement.querySelector('.error-message').textContent = "This field can not be blank."
                return 1
            }
            else
            {
                toCheck.parentElement.classList.remove("invalid")
                return 0
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
        checkUsername: async function(userCheck) {
            try {
                let toReturn = await axios({
                    method: 'get',
                    url: this.$apiUrl + 'wp-json/wp/v2/users/?slug=' + userCheck,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + this.accountToken
                    }
                })
                return toReturn.data.length
            }
            catch(err) {
                return err
            }
        },
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
        // dev fA70 C2LT kG8l wAqh SZr6 QTfU
        // stage cZLU mEVD zR8O W6yF YRJo yxCR
        axios
            .post(this.$apiUrl + 'wp-json/jwt-auth/v1/token', {
                username: 'abpadmin',
                password: 'cZLU mEVD zR8O W6yF YRJo yxCR',
            })
            .then((res) => {
                this.accountToken = res.data.token
            })
            .catch((err) => {
                console.error(err);
            });
    }
};