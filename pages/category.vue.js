var Category = {
	template: `
    <div class="content-wrap" v-if="latestPosts.length > 0">
        <div class="container">
            <div class="category-browse">
                <div class="form-group">
                    <select name="blog-cats" class="form-control" id="blogCategories" v-model="categorySelected" @change="goToCategory($event)">
                        <option value="">Latest News</option>
                        <option value="business-tools">Business Tools</option>
                        <option value="checking-in-with-abp">Checking in with ABP</option>
                        <option value="current-markets-forecasts">Current Markets & Forcasts</option>
                        <option value="health-production">Health & Production</option>  
                        <option value="innovation-technology">Innovation & Technology</option>
                        <option value="inspiration">Inspiration</option>
                        <option value="issues-insights-influence">Issues & Insights</option>
                        <option value="trail-blazers">Trailblazers</option>
                        <option value="weather">Weather</option>
                        <option value="press-releases">Press Releases</option>
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

                                <div class="fav-link" v-if="$store.state.isLoggedIn">
                                    <div class="fav-icon" @click="favArticle(newsPosts.id, $store.state.user_details.id)">
                                        <i class="fas fa-thumbs-up" v-if="$store.state.fav_articles.includes(newsPosts.id)"></i>
                                        <i class="far fa-thumbs-up" v-else></i>
                                    </div> 
                                </div>
                            </div>
                            <h2><router-link :to="{ name: 'single', params: { postName: newsPosts.slug }}" v-html="newsPosts.title.rendered"></router-link></h2> 
                            <p v-html="newsPosts.excerpt.rendered"></p>

                            <router-link class="btn ia-insitenav" :to="{ name: 'single', params: { postName: newsPosts.slug }}">Read More</router-link>
                        </div>
                    </div>
                </div>
            </section>

            <section class="pagination" v-if="latestPosts.length">
                <router-link class="btn btn-prev" :to="{ name: 'category', params: { catName: categorySelected , pageNum: currentPage - 1 }}" v-if="currentPage > 1"><i class="fas fa-arrow-left"></i></router-link>
                <div class="pg-count">{{ currentPage }} of {{ totalPages }}</div>
                <router-link class="btn btn-next" :to="{ name: 'category', params: { catName: categorySelected , pageNum: currentPage + 1 }}" v-if="currentPage < totalPages"><i class="fas fa-arrow-right"></i></router-link>
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
            siteCategories: {
                "business-tools": 7,
                "checking-in-with-abp": 12,
                "current-markets-forecasts": 5,
                "innovation-technology": 3,
                "inspiration": 9,
                "issues-insights-influence": 8,
                "trail-blazers": 4,
                "weather": 6,
                "press-releases": 270,
                "health-production": 280
            },
            categorySelected: "",
            pageMessage: "",
        }
    },
    methods: {
        getPostData: function(catNum, pageNum)
        {
            axios
                .get(this.$apiUrl + 'wp-json/wp/v2/posts?categories=' + catNum + '&per_page=10&page=' + pageNum + '&_embed')
                .then(response => {
                    this.latestPosts = response.data

                    this.totalPages = response.headers['x-wp-totalpages']
                    this.totalPosts = response.headers['x-wp-total']
                    this.currentPage = pageNum
                }
            )
        },
        goToCategory: function(event) {
            if(event.target.value != "")
                app.$router.push('/category/' + event.target.value)
            else
                app.$router.push('/news/')
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.latestPosts = []
        let cp = 1;

        if(typeof(to.params.pageNum) !== 'undefined' && to.params.pageNum !== null)
        {
            cp = to.params.pageNum
        }

        this.getPostData(this.siteCategories[to.params.catName], cp)
        this.categorySelected = to.params.catName
        next()
    },
    beforeRouteEnter (to, from, next)
    {
        let cp = 1    

        if(typeof(to.params.pageNum) !== 'undefined' && to.params.pageNum !== null)
        {
            cp = to.params.pageNum
        }
        
        next(vm => {
            vm.getPostData(vm.siteCategories[to.params.catName], cp);
            vm.categorySelected = to.params.catName
        })
    },
    mounted: function() {
        
    }
};