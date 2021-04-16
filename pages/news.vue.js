var News = {
	template: `
    <div class="content-wrap" v-if="latestPosts.length > 0">
        <div class="container">
            <div class="category-browse">
                <div class="form-group">
                    <select name="blog-cats" class="form-control" id="blogCategories" v-model="categorySelected" @change="goToCategory($event)">
                        <option value="">Categories</option>
                        <option value="business-tools">Business Tools</option>
                        <option value="checking-in-with-abp">Checking in with ABP</option>
                        <option value="current-markets-forecasts">Current Markets & Forcasts</option>
                        <option value="innovation-technology">Innovation & Technology</option>
                        <option value="inspiration">Inspiration</option>
                        <option value="issues-insights-influence">Issues & Insights</option>
                        <option value="trail-blazers">Trailblazers</option>
                        <option value="weather">Weather</option>
                    </select>
                </div>
            </div>

            <section class="latest-posts">
                <div v-for="newsPosts in latestPosts" class="blog-post" :class="newsPosts._embedded['wp:term'][0][0].slug">
                    <div class="row">
                        <div class="col-12">
                            <div class="blog-feat-img">
                                <router-link :to="{ name: 'single', params: { postName: newsPosts.slug }}"><img v-if="newsPosts._embedded['wp:featuredmedia']" :src="newsPosts._embedded['wp:featuredmedia'][0].source_url" class="img-fluid" /></router-link>
                            </div>
                            <div class="blog-info">
                                <span class="date-text" v-html="newsPosts.formatted_date"></span>
                                <span class="blog-cats" v-html="newsPosts._embedded['wp:term'][0][0].name"></span>
                            </div>
                            <h2><router-link :to="{ name: 'single', params: { postName: newsPosts.slug }}" v-html="newsPosts.title.rendered"></router-link></h2> 
                            <p v-html="newsPosts.excerpt.rendered"></p>

                            <router-link class="btn ia-insitenav" :to="{ name: 'single', params: { postName: newsPosts.slug }}">Read More</router-link>
                        </div>
                    </div>
                </div>
            </section>

            <section class="pagination" v-if="latestPosts.length">
                <router-link class="btn btn-prev" :to="{ name: 'news', params: { pageNum: currentPage - 1 }}" v-if="currentPage > 1"><i class="fas fa-arrow-left"></i></router-link>
                <div class="pg-count">{{ currentPage }} of {{ totalPages }}</div>
                <router-link class="btn btn-next" :to="{ name: 'news', params: { pageNum: currentPage + 1 }}" v-if="currentPage < totalPages"><i class="fas fa-arrow-right"></i></router-link>
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
                .get(this.$apiUrl + 'wp-json/wp/v2/posts?per_page=10&page=' + pageNum + '&_embed')
                .then(response => {
                    this.latestPosts = response.data

                    this.totalPages = response.headers['x-wp-totalpages']
                    this.totalPosts = response.headers['x-wp-total']
                    this.currentPage = pageNum
                }
            )
        },
        goToCategory: function(event) {
            app.$router.push('/category/' + event.target.value)
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.latestPosts = []
        let cp = 1;

        if(typeof(to.params.pageNum) !== 'undefined' && to.params.pageNum !== null)
        {
            cp = to.params.pageNum
        }

        this.getPostData(cp)
        VueScrollTo.scrollTo('#main_app', 500)
        next()
    },
    beforeRouteEnter (to, from, next)
    {
        let cp = 1;

        if(typeof(to.params.pageNum) !== 'undefined' && to.params.pageNum !== null)
        {
            cp = to.params.pageNum
        }
        
        next(vm => {
            VueScrollTo.scrollTo('#main_app', 500)
            vm.getPostData(cp);
        })
    },
    mounted: function() {
        
    }
};