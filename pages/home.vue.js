var Home = {
	template: `
    <div class="container">
        <section class="report-home" v-if="cattleReport.acf">
            <h3>Cattle Report</h3>
            <div class="updated">Updated: {{ cattleReport.acf.date_updated }}</div>
            <div class="report-row">
                <div class="report-col">
                    <h4>Steers</h4>
                    <p>
                        Live: <span v-if="cattleReport.acf.steers_live">{{ cattleReport.acf.steers_live }}</span><span v-else>---</span><br />
                        Rail: <span v-if="cattleReport.acf.steers_rail">{{ cattleReport.acf.steers_rail }}</span><span v-else>---</span>
                    </p>
                </div>
                <div class="report-col">
                    <h4>Heifers</h4>
                    <p>
                        Live: <span v-if="cattleReport.acf.heifers_live">{{ cattleReport.acf.heifers_live }}</span><span v-else>---</span><br />
                        Rail: <span v-if="cattleReport.acf.heifers_rail">{{ cattleReport.acf.heifers_rail }}</span><span v-else>---</span>
                    </p>
                </div>
            </div>
            <div class="report-row">
                <div class="report-col">
                    <h4>Choice Steers</h4>
                    <p>
                        Live: <span v-if="cattleReport.acf.choice_steers_live">{{ cattleReport.acf.choice_steers_live }}</span><span v-else>---</span><br />
                        Rail: <span v-if="cattleReport.acf.choice_steers_rail">{{ cattleReport.acf.choice_steers_rail }}</span><span v-else>---</span>
                    </p>
                </div>
                <div class="report-col">
                    <h4>Choice Heifers</h4>
                    <p>
                        Live: <span v-if="cattleReport.acf.choice_heifers_live">{{ cattleReport.acf.choice_heifers_live }}</span><span v-else>---</span><br />
                        Rail: <span v-if="cattleReport.acf.choice_heifers_rail">{{ cattleReport.acf.choice_heifers_rail }}</span><span v-else>---</span>
                    </p>
                </div>
            </div>
            <div class="report-row">
                <div class="report-col full">
                    <h4>Boner Cows</h4>
                    <p>
                        Over 500 lbs: <span v-if="cattleReport.acf.boner_cows">{{ cattleReport.acf.boner_cows }}</span><span v-else>---</span>
                    </p>
                </div>
            </div>
            <div class="report-row">
                <div class="report-col full">
                    <h4>Canadian Dollar</h4>
                    <p>
                        $<span v-html="cattleReport.acf.canadian_dollar"></span> &nbsp;<i class="fas fa-caret-up" :class="'fa-caret-' + cattleReport.acf.canadian_dollar_updown"></i> {{ cattleReport.acf.canadian_dollar_updown_by }}
                    </p>
                </div>
            </div>

            <div class="report-more">
                <router-link class="btn ia-insitenav" to="/cattleReport">View Full Report</router-link>
            </div>
        </section>

        <section class="featured-cta">
            <div class="row">
                <div class="col-12">
                    <a href="https://coop.ufa.com/resources/animals/calving-resources?utm_source=ABP-Paid&amp;utm_medium=Display&amp;utm_campaign=ABPMag" target="_blank"><img src="assets/img/ufa-livestock.jpg" class="img-fluid"></a>
                </div>
            </div>
        </section>

        <section class="latest-posts">
            <h1>What's New</h1>
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

        <section class="all-posts-btn">
            <router-link class="btn" to="/news">View all</router-link>
        </section>
    </div>
    `,
    data() {
        return {
            latestPosts: [],
            cattleReport: "",
        }
    },
    methods: {

    },
    mounted: function() {
        axios
            .get(this.$apiUrl + 'wp-json/wp/v2/posts?per_page=5&_embed')
            .then(lposts => {
                this.latestPosts = lposts.data

                console.log(lposts.data)
            }
        )
        
        axios
            .get(this.$apiUrl + 'wp-json/abp-app/v1/get-page/12')
            .then(response => {
                this.cattleReport = response.data
            }
        )

        VueScrollTo.scrollTo('#main_app', 500)
    }
};