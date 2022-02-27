var Feed = {
	template: `
    <div class="content-wrap" v-if="latestPosts.length > 0">
        <div class="container">
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
                <router-link class="btn btn-prev" :to="{ name: 'feed', params: { pageNum: currentPage - 1 }}" v-if="currentPage > 1"><i class="fas fa-arrow-left"></i></router-link>
                <div class="pg-count">{{ currentPage }} of {{ totalPages }}</div>
                <router-link class="btn btn-next" :to="{ name: 'feed', params: { pageNum: currentPage + 1 }}" v-if="currentPage < totalPages"><i class="fas fa-arrow-right"></i></router-link>
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
            currentPage: 2,
            categorySelected: "",
        }
    },
    methods: {
        getPostData: function(pageNum)
        {
            if(store.state.fav_categories.length > 0)
            {
                catQuery = "categories=" + store.state.fav_categories.join() + "&"

                axios
                    .get(this.$apiUrl + 'wp-json/wp/v2/posts?' + catQuery + 'per_page=6&page=' + pageNum + '&_embed')
                    .then(response => {
                        this.latestPosts = response.data

                        this.totalPages = response.headers['x-wp-totalpages']
                        this.totalPosts = response.headers['x-wp-total']
                        this.currentPage = parseInt(pageNum)
                    }
                )
            }
        },
    },
    beforeRouteUpdate (to, from, next) {
        if(typeof mixpanel != "undefined") {
            mixpanel.track("Filtered Feed", {"Action": "Open"});
        }

        this.latestPosts = []
        let cp = 1;

        if(typeof(to.params.pageNum) !== 'undefined' && to.params.pageNum !== null)
        {
            cp = to.params.pageNum
        }

        this.getPostData(cp)

        this.$store.state.navOpen = 0

        next()
    },
    beforeRouteEnter (to, from, next)
    {
        if(typeof mixpanel != "undefined") {
            mixpanel.track("Filtered Feed", {"Action": "Open"});
        }

        let cp = 1;

        if(typeof(to.params.pageNum) !== 'undefined' && to.params.pageNum !== null)
        {
            cp = to.params.pageNum
        }
        
        next(vm => {
            vm.getPostData(cp);

            vm.$store.state.navOpen = 0
        })
    },
    mounted: function() {
        
    }
};