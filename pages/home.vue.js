var Home = {
	template: `
    <div class="content-wrap" v-if="latestPosts.length > 0">
        <div class="container">
            <section class="latest-posts">
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
                <h1>What's New</h1>
                <div v-for="(newsPosts, index) in latestPosts" class="blog-post" :class="newsPosts._embedded['wp:term'][0][0].slug">
                    <section class="featured-cta" v-if="index == 3 && pageAds.length > 0">
                        <div class="row">
                            <div class="col-12">
                                <a :href="pageAds[0].link" target="_blank"><img :src="pageAds[0].image" style="width: 100%; height: auto; margin-bottom: 40px;"></a>
                            </div>
                        </div>
                    </section>
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
                            <div v-html="newsPosts.excerpt.rendered"></div>

                            <router-link class="btn ia-insitenav" :to="{ name: 'single', params: { postName: newsPosts.slug }}">Read More</router-link>
                        </div>
                    </div>
                </div>
            </section>

            <section class="all-posts-btn">
                <router-link class="btn" to="/news">View all</router-link>
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
            pageAds: [],
            categorySelected: "",
            favCategories: [],
        }
    },
    methods: {
        goToCategory: function(event) {
            if(event.target.value != "")
                app.$router.push('/category/' + event.target.value)
            else
                app.$router.push('/news/')
        }
    },
    mounted: function() {
        this.$store.state.navOpen = 0

        axios
            .get(this.$apiUrl + 'wp-json/wp/v2/posts?per_page=6&_embed')
            .then(lposts => {
                this.latestPosts = lposts.data
            }
        )

        axios
            .get(this.$apiUrl + 'wp-json/abp-app/v1/get-page-ads/sidebar')
            .then(lads => {
                this.pageAds = lads.data
            }
        )

        this.getLatestFavs()

        VueScrollTo.scrollTo('#main_app', 500)
    }
};