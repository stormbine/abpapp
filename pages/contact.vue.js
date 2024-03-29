var Contact = {
	template: `
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-7 col-lg-8">
                <div class="page-feat-img"><img :src="pageData.featured_image" class="img-fluid" /></div>
                <div v-html="pageData.post_content"></div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            pageData: [],
            contactZones: []
        }
    },
    methods: {
        getPostData: function(pageId)
        {
            axios
                .get(this.$apiUrl + 'wp-json/abp-app/v1/get-page/' + pageId)
                .then(response => {
                    this.pageData = response.data
                    this.contactZones = response.data.acf.zone
                }
            )
        },
        
    },
    beforeRouteUpdate (to, from, next) {
        this.pageData = []
        this.getPostData(442)
        VueScrollTo.scrollTo('#main_app', 500)
        next()
    },
    beforeRouteEnter (to, from, next)
    {
        next(vm => {
            vm.getPostData(442);
            VueScrollTo.scrollTo('#main_app', 500)
        })
    },
    mounted: function() {
        
    }
};