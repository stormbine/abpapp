var FavCategories = {
	template: `
    <div class="content-wrap" v-if="$store.state.isLoggedIn && blogCategories.length > 0">
        <div class="profile-wrap">
            <h2>Categories</h2>
            
            <div class="cat-form">
                <div id="msgArea" class="login-message"></div>
                <form id="favCatsForm" novalidate @submit.prevent="saveCats">
                    <div class="catlist">
                        <div class="bcat" v-for="bcat in blogCategories" v-if="bcat.id != 1">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" :value="bcat.id" :id="bcat.id" v-model="selectedCategories">
                                <label class="form-check-label" v-html="bcat.name" :for="bcat.id"></label>
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-cats">Save</button>
                </form>
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
            blogCategories: [],
            selectedCategories: [],
        }
    },
    methods: {
        getPostData: function()
        {
            axios
                .get(this.$apiUrl + 'wp-json/wp/v2/categories')
                .then(response => {
                    this.blogCategories = response.data
                }
            )

            this.selectedCategories = this.$store.state.fav_categories
        },
        saveCats: function()
        {
            let favDetails = {
                user_id: this.$store.state.user_details.id,
                user_cats: this.selectedCategories
            }
            
            axios
                .post(this.$apiUrl + 'wp-json/abp-app/v1/abp-fav-cats', favDetails, { crossdomain: true })
                .then(response => {
                    if(this.selectedCategories.length == response.data)
                    {
                        this.$store.state.fav_categories = this.selectedCategories

                        document.getElementById('msgArea').textContent = "Categories updated."
                        document.getElementById('msgArea').classList.add("active")

                        setTimeout(function(){ 
                            document.getElementById('msgArea').textContent = ""
                            document.getElementById('msgArea').classList.remove("active")
                        }, 3000)

                        //update fav articles since we added/removed categories.
                        this.getLatestFavs()
                    }
                    else
                    {
                        document.getElementById('msgArea').textContent = "Error Updating Categories."
                        document.getElementById('msgArea').classList.add("active")

                        setTimeout(function(){ 
                            document.getElementById('msgArea').textContent = ""
                            document.getElementById('msgArea').classList.remove("active")
                        }, 3000)
                    }
                }
            )
        },
    },
    beforeRouteUpdate (to, from, next) {
        this.pageData = []
        this.$store.state.navOpen = 0

        this.getPostData()
        
        next()
    },
    beforeRouteEnter (to, from, next)
    {
        next(vm => {
            vm.getPostData()
            vm.$store.state.navOpen = 0
        })
    },
    mounted: function() {

    }
};