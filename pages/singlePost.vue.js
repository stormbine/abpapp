var Single = {
	template: `
    <div class="content-wrap" v-if="postData != ''">
        <div class="container">
            <section class="blog-post-wrap">
                <div class="blog-post-single" :class="postData.post_current_cat.slug">
                    <div class="row">
                        <div class="col-12">
                            <div class="blog-feat-img"><img v-if="postData.featured_image" :src="postData.featured_image" class="img-fluid" /></div>
                            <div class="blog-info">
                                <span class="date-text" v-html="postData.formatted_date"></span>
                                <span class="blog-cats" v-html="postData.post_current_cat.cat_name"></span>

                                <div v-if="postData.acf.author" class="blog-auth-top" style="padding-top: 8px;">
                                    by <router-link :to="{ name: 'author', params: { authorName: postData.acf.author.ID }}" v-html="postData.acf.author.post_title"></router-link>
                                </div>

                                <div class="fav-link" v-if="$store.state.isLoggedIn">
                                    <div class="fav-icon" @click="favArticle(postData.ID, $store.state.user_details.id)">
                                        <i class="fas fa-thumbs-up" v-if="$store.state.fav_articles.includes(postData.ID)"></i>
                                        <i class="far fa-thumbs-up" v-else></i>
                                    </div> 
                                </div>
                            </div>
                            <h2 v-html="postData.post_title"></h2> 
                            <div v-html="postData.post_content"></div>

                            <div class="row sicon">
                                <div class="col-12">
                                    <h4>Share this on</h4>
                                    <div class="social-icons">
                                        <a :href="'https://www.facebook.com/sharer/sharer.php?u=https://abpdaily.com/' + postData.post_current_cat.slug + '/' + postData.post_name" target="_blank"><i class="fab fa-facebook"></i></a>
                                        <a :href="'https://twitter.com/intent/tweet?url=https://abpdaily.com/' + postData.post_current_cat.slug + '/' + postData.post_name" target="_blank"><i class="fab fa-twitter"></i></a>
                                        <a :href="'https://www.linkedin.com/shareArticle?mini=true&url=https://abpdaily.com/' + postData.post_current_cat.slug + '/' + postData.post_name" target="_blank"><i class="fab fa-linkedin"></i></a>
                                    </div>
                                </div>
                            </div>

                            <div class="post-comments" v-if="postComments != ''">
                                <h4>Comments</h4>
        		                <div class="comment" v-for="pComment in postComments">
				                    <div class="comment-author vcard">
			                            <cite class="fn">{{ pComment.author_name }}</cite> <span class="says">says:</span>		
                                    </div>
		
		                            <div class="comment-meta commentmetadata">
                                        {{ new Date(pComment.date).toLocaleString() }}
                                    </div>

		                            <div v-html="pComment.content.rendered"></div>
				                </div>
                            </div>

                            <div class="leave-comment">
                                <h4>Leave a Comment</h4>

                                <form id="createUserForm" novalidate @submit.prevent="leaveComment">
                                    <div id="caFname" class="form-group">
                                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" v-model="commentText"></textarea>
                                    </div>

                                    <button type="submit" id="commentSubmit" class="btn btn-primary">Submit</button>
                                </form>
                            </div>
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
            postData: "",
            postComments: "",
            commentText: "",
        }
    },
    methods: {
        getPostData: function(postName)
        {
            axios
                .get(this.$apiUrl + 'wp-json/abp-app/v1/get-post-by-slug/' + postName)
                .then(response => {
                    this.postData = response.data[0]
                    console.log(response.data[0].post_title)

                    if(typeof mixpanel != "undefined") {
                        mixpanel.track( "Article Open", {"Title": response.data[0].post_title });
                    }

                    //get the comments for this post.
                    axios.get(this.$apiUrl + 'wp-json/wp/v2/comments?post=' + response.data[0].ID)
                    .then(comments => {
                        this.postComments = comments.data
                    })
                }
            )
        },
        leaveComment: function()
        {
            if(this.commentText != "")
            {
                let submitButton = document.getElementById('commentSubmit')
                submitButton.disabled = 'true';
                
                let commentSubmit = {
                    post_id: this.postData.ID,
                    comment_author: this.$store.state.user_details.user_display_name,
                    author_email: this.$store.state.user_details.user_email,
                    comment_content: this.commentText,
                    user_id: this.$store.state.user_details.id,
                    user_agent: window.navigator.userAgent
                }

                axios
                    .post(this.$apiUrl + 'wp-json/abp-app/v1/abp-add-comment', commentSubmit, { crossdomain: true })
                    .then(response => {
                        if(response.data == 1)
                        {
                            submitButton.disabled = 'false'
                            this.$router.go()
                        }
                    }
                )
            }
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.postData = []
        this.$store.state.navOpen = 0
        let cp = 1;

        if(typeof(to.params.postName) !== 'undefined' && to.params.postName !== null)
        {
            cp = to.params.postName
        }

        this.getPostData(cp)
        next()
    },
    beforeRouteEnter (to, from, next)
    {
        let cp = 1;

        if(typeof(to.params.postName) !== 'undefined' && to.params.postName !== null)
        {
            cp = to.params.postName
        }
        
        next(vm => {
            vm.$store.state.navOpen = 0
            vm.getPostData(cp);
        })
    },
    mounted: function() {
        
    }
};