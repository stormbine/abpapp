var Events = {
	template: `
    <div class="content-wrap" v-if="pageData.acf">
        <div class="container">
            <div class="row">
                <div class="col-12 col-md-7 col-lg-8">
                    <div class="page-feat-img"><img :src="pageData.featured_image" class="img-fluid" /></div>
                    <div v-html="pageData.post_content"></div>
                </div>
            </div>

            <section class="abp-events" v-if="pageData.acf.events">
                <div class="event-box" v-for="evt in pageData.acf.events">
                    <h4>{{ evt.event_date }} <span v-if="evt.event_time">- {{ evt.event_time }} </span></h4>
                    <h3>{{ evt.name }}</h3>
                    
                    <div v-if="evt.description" class="desc" v-html="evt.description"></div>
                    <a :href="evt.link" target="_blank" class="event-link" rel="noopener" v-if="evt.link">Learn More</a>
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
            pageData: []
        }
    },
    methods: {
        getPostData: function(pageId)
        {
            axios
                .get(this.$apiUrl + 'wp-json/abp-app/v1/get-page/' + pageId)
                .then(response => {
                    this.pageData = response.data
                }
            )
        },
        
    },
    beforeRouteUpdate (to, from, next) {
        this.pageData = []
        this.getPostData(250)
        VueScrollTo.scrollTo('#main_app', 500)
        next()
    },
    beforeRouteEnter (to, from, next)
    {
        next(vm => {
            VueScrollTo.scrollTo('#main_app', 500)
            vm.getPostData(250);
        })
    },
    mounted: function() {
        
    }
};