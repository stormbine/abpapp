var Delegates = {
	template: `
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="page-feat-img"><img :src="pageData.featured_image" class="img-fluid" /></div>
                <div v-html="contactData.post_content"></div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div v-html="pageData.post_content"></div>
            </div>
        </div>

        <div id="map_wrap" class="delegate-map text-center">
            <img src="http://abpdaily.com/wp-content/themes/abp/img/abp-zonemap.jpg" usemap="#image-map" class="img-fluid">
            <map name="image-map">
                <area target="" alt="NW" title="NW" href="#" @click.prevent="mapClick('northwest')" coords="57,20,176,23,177,50,217,54,218,157,192,167,185,314,158,318,130,343,83,352,34,340" shape="poly">
                <area target="" alt="NE" title="NE" href="#" @click.prevent="mapClick('northeast')" coords="178,23,326,20,355,444,310,426,272,411,249,384,273,312,277,267,262,171,245,161,220,160,224,47,183,48" shape="poly">
                <area target="" alt="Central" title="Central" href="#" @click.prevent="mapClick('central')" coords="31,344,88,356,124,349,158,321,185,316,195,166,253,170,269,283,263,314,245,380,251,434,210,436,204,405,138,406,114,439,98,440,56,384" shape="poly">
                <area target="" alt="SW" title="SW" href="#" @click.prevent="mapClick('southwest')" coords="119,445,139,409,200,410,208,435,248,435,251,448,229,458,247,562,275,556,279,581,264,584,272,610,222,614" shape="poly">
                <area target="" alt="" title="" href="#" @click.prevent="mapClick('southeast')" coords="281,615,270,587,283,582,280,549,252,555,235,457,256,455,257,427,355,448,364,609" shape="poly">
            </map>
        </div>

        <section class="delegates" v-if="contactZones">
            <div class="zone" :id="zone.zone_name.toLowerCase()" :class="zone.zone_name" v-for="zone in contactZones">
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
                                <div class="del-con"><i class="fas fa-envelope"></i> <a :href="'mailto:' + delegate.email">{{ delegate.email }}</a></div>

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
            contactZones: [],
            contactData: []
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

            axios
                .get(this.$apiUrl + 'wp-json/abp-app/v1/get-page/442')
                .then(response => {
                    this.contactData = response.data
                }
            )
        },
        mapClick: function(clickArea)
        {
            VueScrollTo.scrollTo('#' + clickArea)
        }
    },
    beforeRouteUpdate (to, from, next) {
        if(typeof mixpanel != "undefined") {
            mixpanel.track("Delegates Open", {"Action": "Open"});
        }
        this.pageData = []
        this.getPostData(10)
        next()
    },
    beforeRouteEnter (to, from, next)
    {
        if(typeof mixpanel != "undefined") {
            mixpanel.track("Delegates Open", {"Action": "Open"});
        }
        next(vm => {
            vm.getPostData(10);
        })
    },
    mounted: function() {
        
    }
};