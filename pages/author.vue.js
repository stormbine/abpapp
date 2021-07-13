var Author = {
	template: `
    <div class="content-wrap" v-if="latestPosts.length > 0">
        <div class="container">
            <section class="latest-posts">
                <div v-for="newsPosts in latestPosts" class="blog-post" :class="newsPosts.post_current_cat.slug">
                    <div class="row">
                        <div class="col-12">
                            <div class="blog-feat-img">
                                <router-link :to="{ name: 'single', params: { postName: newsPosts.post_name }}"><img v-if="newsPosts.featured_image" :src="newsPosts.featured_image" class="img-fluid" /></router-link>
                            </div>
                            <div class="blog-info">
                                <span class="date-text" v-html="newsPosts.formatted_date"></span>
                                <span class="blog-cats" v-html="newsPosts.post_current_cat.cat_name"></span>
                            </div>
                            <h2><router-link :to="{ name: 'single', params: { postName: newsPosts.post_name }}" v-html="newsPosts.post_title"></router-link></h2> 
                            <p v-html="newsPosts.the_excerpt"></p>

                            <router-link class="btn ia-insitenav" :to="{ name: 'single', params: { postName: newsPosts.slug }}">Read More</router-link>
                        </div>
                    </div>
                </div>
            </section>
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
            latestPosts: [],
            totalPages: 0,
            totalPosts: 0,
            currentPage: 1,
            categorySelected: "",
        }
    },
    methods: {
        getPostData: function(pageNum)
        {
            axios
                .get(this.$apiUrl + 'wp-json/abp-app/v1/get-posts-by-author/' + pageNum)
                .then(response => {
                    this.latestPosts = response.data
                    this.currentPage = pageNum
                }
            )
        }
    },
    beforeRouteUpdate (to, from, next) {
        if(typeof mixpanel != "undefined") {
            mixpanel.track("Posts by Author", {"Action": "Open"});
        }

        this.latestPosts = []
        let cp = 1;

        if(typeof(to.params.authorName) !== 'undefined' && to.params.authorName !== null)
        {
            cp = to.params.authorName
        }

        this.getPostData(cp)
        next()
    },
    beforeRouteEnter (to, from, next)
    {
        if(typeof mixpanel != "undefined") {
            mixpanel.track("Posts by Author", {"Action": "Open"});
        }

        let cp = 1;

        if(typeof(to.params.authorName) !== 'undefined' && to.params.authorName !== null)
        {
            cp = to.params.authorName
        }
        
        next(vm => {
            vm.getPostData(cp);
        })
    },
    mounted: function() {
        
    }
};