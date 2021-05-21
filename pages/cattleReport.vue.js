var CattleReport = {
	template: `
    <div class="content-wrap" v-if="pageData.acf">
        <div class="container cattle-report-wrap">
            <section class="page-hero">
                <div class="row">
                    <div class="col-12">
                        <img :src="pageData.featured_image" class="hero-img" />

                        <h1 v-html="pageData.post_title"></h1>
                        <h4>Last Updated: {{ pageData.acf.date_updated }}</h4>
                    </div>
                </div>
            </section>

            <section class="audio-updates">
                <div class="row">
                    <div class="col-12">
                        <h2>Audio Updates</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-6">
                        <audio controls>
                            <source :src="pageData.acf.feeder_report_audio" type="audio/mp3">
                        </audio>
                        <p>Feeder Report</p>
                    </div>
                    <div class="col-12 col-md-6">
                        <audio controls>
                            <source :src="pageData.acf.slaughter_report_audio" type="audio/mp3">
                        </audio>
                        <p>Slaughter Report</p>
                    </div>
                </div>
            </section>

            <section class="alberta-direct">
                <div class="row">
                    <div class="col-12">
                        <h2>Direct Sales</h2>
                        <div v-html="pageData.post_content"></div>

                        <h3>Canadian Dollar</h3>
                        <p>
                            $<span v-html="pageData.acf.canadian_dollar"></span> &nbsp;<i class="fas fa-caret-up" :class="'fa-caret-' + pageData.acf.canadian_dollar_updown"></i> {{ pageData.acf.canadian_dollar_updown_by }}
                        </p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-10 offset-md-1 col-lg-6 offset-lg-0">
                        <h3>Steer & Heifer Trade</h3>
                        <div class="table-responsive">
                            <table class="table table-hover table-bordered">
                                <thead class="thead-dark">
                                    <tr>
                                        <th></th>
                                        <th>Live</th>
                                        <th>Rail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Steers</td>
                                        <td><div v-if="pageData.acf.steers_live">{{ pageData.acf.steers_live }}</div><div v-else>---</div></td>
                                        <td><div v-if="pageData.acf.steers_rail">{{ pageData.acf.steers_rail }}</div><div v-else>---</div></td>
                                    </tr>
                                    <tr>
                                        <td>Heifers</td>
                                        <td><div v-if="pageData.acf.heifers_live">{{ pageData.acf.heifers_live }}</div><div v-else>---</div></td>
                                        <td><div v-if="pageData.acf.heifers_rail">{{ pageData.acf.heifers_rail }}</div><div v-else>---</div></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-12 col-md-10 offset-md-1 col-lg-6 offset-lg-0">
                        <h3>Cow & Bull Trade</h3>

                        <div class="table-responsive">
                            <table class="table table-hover table-bordered">
                                <thead class="thead-dark">
                                    <tr>
                                        <th>D1, D2 Cows</th>
                                        <th>D3 Cows</th>
                                        <th>Bulls</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><div v-if="pageData.acf.d1_d2_cows">{{ pageData.acf.d1_d2_cows }}</div><div v-else>---</div></td>
                                        <td><div v-if="pageData.acf.d3_cows">{{ pageData.acf.d3_cows }}</div><div v-else>---</div></td>
                                        <td><div v-if="pageData.acf.bulls">{{ pageData.acf.bulls }}</div><div v-else>---</div></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-12 col-md-10 offset-md-1 col-lg-6 offset-lg-0">
                        <h3>National slaughter cows</h3>

                        <div class="table-responsive">
                            <table class="table table-hover table-bordered">
                                <thead class="thead-dark">
                                    <tr>
                                        <th>Boner Cows</th>
                                        <th>Rail Average</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Over 500 lbs.</td>
                                        <td><div v-if="pageData.acf.boner_cows">{{ pageData.acf.boner_cows }}</div><div v-else>---</div></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <section class="us-trade">
                <div class="row">
                    <div class="col-12">
                        <h2>US Trade</h2>
                        <div v-html="pageData.acf.us_trade_content"></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-10 offset-md-1 col-lg-6 offset-lg-0">
                        <div class="table-responsive-sm">
                            <h3>US Trade</h3>
                            <table class="table table-hover table-bordered">
                                <thead class="thead-dark">
                                    <tr>
                                        <th></th>
                                        <th>Live</th>
                                        <th>Rail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Choice Steers</td>
                                        <td><div v-if="pageData.acf.choice_steers_live">{{ pageData.acf.choice_steers_live }}</div><div v-else>---</div></td>
                                        <td><div v-if="pageData.acf.choice_steers_rail">{{ pageData.acf.choice_steers_rail }}</div><div v-else>---</div></td>
                                    </tr>
                                    <tr>
                                        <td>Choice Heifers</td>
                                        <td><div v-if="pageData.acf.choice_heifers_live">{{ pageData.acf.choice_heifers_live }}</div><div v-else>---</div></td>
                                        <td><div v-if="pageData.acf.choice_heifers_rail">{{ pageData.acf.choice_heifers_rail }}</div><div v-else>---</div></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-12 col-md-10 offset-md-1 col-lg-6 offset-lg-0">
                        <h3>Chicago Mercantile Exchange</h3>
                        <div class="table-responsive-sm">
                            <table class="table table-hover table-bordered" v-if="pageData.acf.chicago_mercantile_exchange">
                                <thead class="thead-dark">
                                    <tr>
                                        <th v-for="cme in pageData.acf.chicago_mercantile_exchange">{{ cme.month }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td v-for="cme in pageData.acf.chicago_mercantile_exchange">{{ cme.value }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <section class="replacement-cattle">
                <div class="row">
                    <div class="col-12">
                        <h2>Replacement Trade</h2>
                        <p>
                            Information provided on this report is supplied by various auction markets throughout Alberta. In reference to the following prices, producers are reminded to check with individual markets on current prices and trends. 
                            Prices quoted include top quality cattle only.
                        </p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-10 offset-md-1">
                        <table class="table table-hover table-bordered">
                            <thead class="thead-dark">
                                <tr>
                                    <th></th>
                                    <th>Steer</th>
                                    <th>Heifer</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="rc in pageData.acf.replacement_cows">
                                    <td>{{ rc.weight }}</td>
                                    <td>{{ rc.steer }}</td>
                                    <td>{{ rc.heifer }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-10 offset-md-1">
                        <table class="table table-hover table-bordered">
                            <thead class="thead-dark">
                                <tr>
                                    <th>Bred Cows</th>
                                    <th>Bred Heifers</th>
                                    <th>Cow/Calf Pairs</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><div v-if="pageData.acf.bred_cows">{{ pageData.acf.bred_cows }}</div><div v-else>---</div></td>
                                    <td><div v-if="pageData.acf.bred_heifers">{{ pageData.acf.bred_heifers }}</div><div v-else>---</div></td>
                                    <td><div v-if="pageData.acf.cow_calf_pairs">{{ pageData.acf.cow_calf_pairs }}</div><div v-else>---</div></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section class="disclaimer">
                <div class="container">
                    <div class="row">
                        <div class="col-12 text-center">
                            <p>Disclaimer: Information on this page is not for further distribution without permission from Canfax.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="lpi-info">
                <div class="row">
                    <div class="col-12">
                        <h2>Livestock Price Insurance Index</h2>
                        <p>
                            The Cattle Price Insurance Program offers producers the ability to manage their bottom line by purchasing price insurance to provide a floor price on future cattle sales. This is a snapshot of top coverage offered this past week. LPI-Calf is available to purchase from February to June.
                        </p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-md-10 offset-md-1">
                        <div class="table-responsive">
                            <table class="table table-hover table-bordered">
                                <thead class="thead-dark">
                                    <tr>
                                        <th>Expiry Date</th>
                                        <th>LPI-Fed <br />Price</th>
                                        <th>LPI-Feeder <br />Alberta</th>
                                        <th>LPI-Calf <br />Alberta</th>
                                        <th>LPI-Feeder <br />SaskMan</th>
                                        <th>LPI-Calf <br />SaskMan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="lpi in pageData.acf.lpi_info">
                                        <td><div v-if="lpi.expiry_date">{{ lpi.expiry_date }}</div><div v-else>---</div></td>
                                        <td><div v-if="lpi.lpi_fed_price">{{ lpi.lpi_fed_price }}</div><div v-else>---</div></td>
                                        <td><div v-if="lpi.lpi_feeder_alberta">{{ lpi.lpi_feeder_alberta }}</div><div v-else>---</div></td>
                                        <td><div v-if="lpi.lpi_calf_alberta">{{ lpi.lpi_calf_alberta }}</div><div v-else>---</div></td>
                                        <td><div v-if="lpi.lpi_feeder_saskman">{{ lpi.lpi_feeder_saskman }}</div><div v-else>---</div></td>
                                        <td><div v-if="lpi.lpi_calf_saskman">{{ lpi.lpi_calf_saskman }}</div><div v-else>---</div></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <section class="producer-ads" v-if="producerAds">
                <div class="row">
                    <div class="col-12 col-md-6 col-lg-4 text-center" v-for="pa in producerAds">
                        <a :href="pa.acf.link" target="_blank"><img :src="pa.acf.image" style="width: 100%; height: auto;" /></a>
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
            pageData: [],
            producerAds: [],
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

            axios
                .get(this.$apiUrl + 'wp-json/abp-app/v1/get-producer-ads/')
                .then(response => {
                    this.producerAds = response.data
                }
            )
        },
        
    },
    beforeRouteUpdate (to, from, next) {
        if(typeof mixpanel != "undefined") {
            mixpanel.track("Cattle Report Open", {"Action": "Open"});
        }
        mixpanel.track("Cattle Report Open", {"Action": "Open"});
        this.pageData = []
        this.getPostData(12)
        next()
    },
    beforeRouteEnter (to, from, next)
    {
        if(typeof mixpanel != "undefined") {
            mixpanel.track("Cattle Report Open", {"Action": "Open"});
        }   
        next(vm => {
            vm.getPostData(12);
        })
    },
    mounted: function() {
        
    }
};