var Delegates = {
	template: `
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-7 col-lg-8">
                <div class="page-feat-img"><img :src="pageData.featured_image" class="img-fluid" /></div>
                <div v-html="pageData.post_content"></div>
            </div>
        </div>

        <section class="delegates" v-if="contactZones">
            <div class="zone" :class="zone.zone_name" v-for="zone in contactZones">
                <h2>{{ zone.zone_name }} Zone</h2>
                <div class="zone-desc" v-html="zone.zone_description"></div>
                
                <div class="zone-del" v-if="zone.delegate">
                    <div class="del-info" v-for="delegate in zone.delegate">
                        <div class="row">
                            <div class="col-12 col-md-4">
                                <img :src="delegate.photo" class="img-fluid" />
                            </div>
                            <div class="col-12 col-md-8">
                                <h3 v-html="delegate.name"></h3>
                                <div class="del-con"><i class="fas fa-phone"></i> <span v-html="delegate.cell_number"></span></div>
                                <div class="del-con"><i class="fas fa-envelope"></i> <span v-html="delegate.email"></span></div>

                                <div class="del-bio" v-html="delegate.bio"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
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
        this.getPostData(10)
        next()
    },
    beforeRouteEnter (to, from, next)
    {
        next(vm => {
            vm.getPostData(10);
        })
    },
    mounted: function() {
        
    }
};