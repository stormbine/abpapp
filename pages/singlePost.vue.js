var Single = {
	template: `
    <div class="content-wrap" v-if="postData != ''">
        <div class="container">
            <section class="blog-post-wrap">
                <div class="blog-post-single" :class="postData._embedded['wp:term'][0][0].slug">
                    <div class="row">
                        <div class="col-12">
                            <div class="blog-feat-img"><img v-if="postData._embedded['wp:featuredmedia']" :src="postData._embedded['wp:featuredmedia'][0].source_url" class="img-fluid" /></div>
                            <div class="blog-info">
                                <span class="date-text" v-html="postData.formatted_date"></span>
                                <span class="blog-cats" v-html="postData._embedded['wp:term'][0][0].name"></span>
                            </div>
                            <h2 v-html="postData.title.rendered"></h2> 
                            <div v-html="postData.content.rendered"></div>
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
                .get(this.$apiUrl + 'wp-json/wp/v2/posts?slug=' + postName + '&_embed')
                .then(response => {
                    this.postData = response.data[0]
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