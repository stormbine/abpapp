var Single = {
	template: `
    <div class="content-wrap" v-if="postData != ''">
        <div class="container">
            <section class="blog-post-wrap">
                <div class="blog-post-single" :class="postData.post_current_cat.slug">
                    <div class="row">
                        <div class="col-12">
                            <div class="blog-feat-img"><img v-if="postData.featured_image" :src="postData.featured_image" class="img-fluid" /></div>
                            <div class="blog-info">
                                <span class="date-text" v-html="postData.formatted_date"></span>
                                <span class="blog-cats" v-html="postData.post_current_cat.cat_name"></span>

                                <div v-if="postData.acf.author" class="blog-auth-top" style="padding-top: 8px;">
                                    by <router-link :to="{ name: 'author', params: { authorName: postData.acf.author.ID }}" v-html="postData.acf.author.post_title"></router-link>
                                </div>
                            </div>
                            <h2 v-html="postData.post_title"></h2> 
                            <div v-html="postData.post_content"></div>
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
            postData: "",
        }
    },
    methods: {
        getPostData: function(postName)
        {
            axios
                .get(this.$apiUrl + 'wp-json/abp-app/v1/get-post-by-slug/' + postName)
                .then(response => {
                    this.postData = response.data[0]

                    if(typeof mixpanel != "undefined") {
                        mixpanel.track( "Article Open", {"Title": response.data[0].title.rendered} );
                    }
                }
            )
        },
        
    },
    beforeRouteUpdate (to, from, next) {
        this.postData = []
        let cp = 1;

        if(typeof(to.params.postName) !== 'undefined' && to.params.postName !== null)
        {
            cp = to.params.postName
        }

        this.getPostData(cp)
        next()
    },
    beforeRouteEnter (to, from, next)
    {
        let cp = 1;

        if(typeof(to.params.postName) !== 'undefined' && to.params.postName !== null)
        {
            cp = to.params.postName
        }
        
        next(vm => {
            vm.getPostData(cp);
        })
    },
    mounted: function() {
        
    }
};