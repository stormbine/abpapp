var FavPosts = {
	template: `
    <div class="content-wrap" v-if="latestPosts.length > 0">
        <div class="container">
            <section class="latest-posts">
                <h1>Liked Posts</h1>
                <div v-if="latestPosts[0] == 'none'">
                    <p class="fav-inst">You have no liked posts. <br /><br />Clicking on the thumbs up icon (<i class="far fa-thumbs-up"></i>) on any post will like it and save it here for later.</p>
                </div>
                <div v-for="(newsPosts, index) in latestPosts" class="blog-post" :class="newsPosts._embedded['wp:term'][0][0].slug" v-else>
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

    },
    mounted: function() {
        let postQuery = ""

        if(store.state.fav_articles.length > 0)
        {
            store.state.fav_articles.forEach(function(element)
            {
                postQuery = postQuery + "include[]=" + element + "&"
            })
            
            postQuery = postQuery.slice(0, -1)

            axios
                .get(this.$apiUrl + 'wp-json/wp/v2/posts?' + postQuery + '&_embed')
                .then(lposts => {
                    this.latestPosts = lposts.data
                }
            )
        }
        else
        {
            this.latestPosts = ["none"]
        }

        VueScrollTo.scrollTo('#main_app', 500)
    }
};