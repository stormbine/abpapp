var Profile = {
	template: `
    <div class="content-wrap" v-if="this.$store.state.isLoggedIn">
        <div class="profile-wrap">
            <h2>Welcome {{ this.$store.state.display_name }}!</h2>
        
            <div class="profile-options">
                <ul>
                    <li><router-link to="/updateAccount"><i class="fas fa-user"></i> Account Details</router-link></li>
                    <li><router-link to="/updatePassword"><i class="fas fa-lock"></i> Change Password</router-link></li>
                    <li><a href=""><i class="fas fa-newspaper"></i> Favourite Articles</a></li>
                    <li><a href=""><i class="fas fa-list"></i> Favourite Categories</a></li>
                    <li><a href=""><i class="fas fa-comments"></i> Comment History</a></li>
                </ul>
            </div>
        </div>
    </div>
    <div class="contentLoader" v-else>
        <div>
            <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            <div class="loading-text">Loading...</div>
        </div>
    </div>
    `,
    data() {
        return {
            pageData: [],
            abpLoginToken: '',
        }
    },
    methods: {
        
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

        if(localStorage.abpAccessToken && !this.$store.state.isLoggedIn )
        {
            console.log("log user in")

            let tokenObject = JSON.parse(localStorage.abpAccessToken)
            //validate the token.
            axios({
                method: 'post',
                url: this.$apiUrl + 'wp-json/jwt-auth/v1/token/validate',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenObject.token
                }
            })
            .then((res) => {
                this.$store.state.display_name = tokenObject.profile.user_display_name
                this.$store.state.isLoggedIn = true
            })
            .catch((err) => {
                // bad token, redirect to login page.
                localStorage.removeItem('abpAccessToken');
                router.push({ path: 'login' })
            });
        }
    }
};