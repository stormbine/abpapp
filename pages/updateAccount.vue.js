var UpdateAccount = {
	template: `
    <div class="content-wrap">
        <div class="create-account-page">
            <h3>Update Your Details</h3>
            <div class="login-form">
                <div id="msgArea" class="login-message"></div>
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
            },
            userId: 0,
            formErrors: 0,
            usernameErrors: 0,
            accountToken: '',
            is_logged_in: 0,
            savingForm: 0,
        }
    },
    methods: {
        checkForm: async function() {
            this.formErrors = this.formErrors + this.checkRequired("loginFirstName")
            this.formErrors = this.formErrors + this.checkRequired("loginLastName")
            this.formErrors = this.formErrors + this.checkRequired("loginEmail")
            
            if(this.formErrors == 0)
            {
                this.savingForm = 1

                let toSave = {
                    first_name: this.userDetails.firstName,
                    last_name: this.userDetails.lastName,
                    email: this.userDetails.email
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

                    //update the login token.
                    let tokenObject = JSON.parse(localStorage.abpAccessToken)
            
                    tokenObject.profile.user_first_name = toSave.first_name
                    tokenObject.profile.user_last_name = toSave.last_name
                    tokenObject.profile.user_email = toSave.email

                    //stringify and resave the profile.
                    let newProfile = JSON.stringify(tokenObject)
                    localStorage.abpAccessToken = newProfile

                    this.savingForm = 0

                    document.getElementById('msgArea').textContent = "Account details updated."
                    document.getElementById('msgArea').classList.add("active")

                    setTimeout(function(){ 
                        document.getElementById('msgArea').textContent = ""
                        document.getElementById('msgArea').classList.remove("active")
                    }, 3000)
                })
                .catch((err) => {
                    this.savingForm = 0
                    document.getElementById('caEmail').classList.add("invalid")
                    document.getElementById('caEmail').querySelector('.error-message').textContent = "This email already exists in our system."

                    console.log(err)
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
    },
    beforeRouteUpdate (to, from, next) {
        this.pageData = []
        this.$store.state.navOpen = 0

        if(localStorage.abpAccessToken)
        {
            let tokenObject = JSON.parse(localStorage.abpAccessToken)
            
            this.userDetails.firstName = tokenObject.profile.user_first_name
            this.userDetails.lastName = tokenObject.profile.user_last_name
            this.userDetails.email = tokenObject.profile.user_email
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
                vm.userDetails.firstName = tokenObject.profile.user_first_name
                vm.userDetails.lastName = tokenObject.profile.user_last_name
                vm.userDetails.email = tokenObject.profile.user_email
                vm.userId = tokenObject.profile.id
                vm.accountToken = tokenObject.token
            }
        })
    },
    mounted: function() {
        
    }
};