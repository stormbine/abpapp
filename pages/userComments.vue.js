var UserComments = {
	template: `
    <div class="content-wrap" v-if="$store.state.isLoggedIn">
        <div class="profile-wrap">
            <h2>Your Comment History</h2>
        
            <div class="post-comments" v-if="pageData != ''">
                <div class="comment" v-for="pComment in pageData">
                    <div class="comment-author vcard">
                        <cite class="fn"><router-link :to="{ name: 'single', params: { postName: pComment.post_name }}">{{ pComment.post_title }}</router-link></cite> 		
                    </div>

                    <div class="comment-meta commentmetadata">
                        {{ new Date(pComment.comment_date).toLocaleString() }}
                    </div>

                    <div v-html="pComment.comment_content"></div>
                </div>
            </div>
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
            abpLoginToken: '',
        }
    },
    methods: {
        getComments: function(commentUser)
        {
            axios
                .get(this.$apiUrl + 'wp-json/abp-app/v1/get-comments-by-author/' + commentUser)
                .then(response => {
                    this.pageData = response.data
                }
            )
        },
    },
    beforeRouteUpdate (to, from, next) {
        this.pageData = []
        this.$store.state.navOpen = 0

        this.getComments(this.$store.state.user_details.user_email)

        next()
    },
    beforeRouteEnter (to, from, next)
    {
        next(vm => {
            vm.$store.state.navOpen = 0

            vm.getComments(vm.$store.state.user_details.user_email)
        })
    },
    mounted: function() {

    }
};