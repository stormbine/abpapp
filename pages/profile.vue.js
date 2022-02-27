var Profile = {
	template: `
    <div class="content-wrap" v-if="$store.state.isLoggedIn">
        <div class="profile-wrap">
            <h2>Welcome {{ $store.state.display_name }}!</h2>
        
            <div class="profile-options">
                <ul>
                    <li><router-link to="/updateAccount"><i class="fas fa-user"></i> Account Details</router-link></li>
                    <li><router-link to="/updatePassword"><i class="fas fa-lock"></i> Change Password</router-link></li>
                    <li><router-link to="/favPosts"><i class="fas fa-newspaper"></i> Favourite Articles</router-link></li>
                    <li><router-link to="/favCategories"><i class="fas fa-list"></i> Favourite Categories</router-link></li>
                    <li><router-link to="/userComments"><i class="fas fa-comments"></i> Comments</router-link></li>
                    <li><a href="#" @click.prevent="logoutUser()"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
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

    }
};