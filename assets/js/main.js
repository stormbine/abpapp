Vue.prototype.$apiUrl = 'http://abpdaily.local/'

const store = new Vuex.Store({
    state: {
        navOpen: 0,
        display_name: '',
        user_details: {},
        fav_articles: [],
        fav_categories: [],
        latest_articles: {},
        isLoggedIn: false,
        formMessage: {
            messageText: '',
            messageType: '',
        }
    },
    mutations: {
        updateArticles(state, payload) {
            state.fav_articles = payload;
        }
    }
})

//Mixins
Vue.mixin({
    methods: {
        favArticle: function(articleId, userId)
        {
            let favDetails = {
                user_id: userId,
                article_id: articleId
            }
            
            axios
                .post(this.$apiUrl + 'wp-json/abp-app/v1/abp-fav-article', favDetails, { crossdomain: true })
                .then(response => {
                    if(response.data == "removed")
                    {
                        const index = router.app.$store.state.fav_articles.indexOf(articleId);
                        if (index !== -1) router.app.$store.state.fav_articles.splice(index, 1);
                    }
                    else
                    {
                        router.app.$store.state.fav_articles.push(articleId)
                    }
                }
            )
        },
        logoutUser: function() {
            let newStore = {
                navOpen: 0,
                display_name: '',
                user_details: {},
                fav_articles: [],
                fav_categories: [],
                latest_articles: {},
                isLoggedIn: false,
                formMessage: {
                    messageText: '',
                    messageType: '',
                }
            }
            store.replaceState(newStore)

            localStorage.removeItem('abpAccessToken')

            this.$store.state.navOpen = 0

            router.push({ path: '/' })
       },
       getLatestFavs: function() {
            let catQuery = ""

            if(store.state.fav_categories.length > 0)
            {
                catQuery = "categories=" + store.state.fav_categories.join() + "&"

                axios
                    .get(this.$apiUrl + 'wp-json/wp/v2/posts?' + catQuery + 'per_page=6&_embed')
                    .then(lposts => {
                        store.state.latest_articles = lposts.data

                        localStorage.abpLatestArticles = JSON.stringify(lposts.data)
                        localStorage.abpLatestArticlesUpdated = new Date()
                    }
                )
            }
       },
       getNotifyDate: function(notifyDate)
       {
            var today = new Date();
            var createdOn = new Date(notifyDate);
            var msInDay = 24 * 60 * 60 * 1000;
            
            createdOn.setHours(0,0,0,0);
            today.setHours(0,0,0,0)
            
            var diff = (+today - +createdOn)/msInDay
            
            if(diff < 7)
            {
                diff = diff + "d"
            }
            else
            {
                diff = Math.round(diff / 7) + "w"
            }
            return diff
       },
       updateNotifyItems: function() {
            toReturn = ""
            
            if(store.state.latest_articles.length > 0)
            {
                store.state.latest_articles.forEach((newsPosts, index) => { 
                    toReturn = toReturn + '<div class="latest-notify ' + newsPosts._embedded['wp:term'][0][0].slug +'"> ' +
                    '<h2><a href="#/single/' + newsPosts.slug + '">' + newsPosts.title.rendered + '</a></h2> ' +
                    '<div class="blog-info"> ' +
                    '    <span class="blog-cats">' + newsPosts._embedded['wp:term'][0][0].name + '</span>' +
                    '    <span class="date-text">' + this.getNotifyDate(newsPosts.formatted_date) + '</span>' +
                    '</div></div>'
                })

                toReturn = toReturn + '<div class="feed-btn"><a href="#/feed/2">Show More</a></router-link></div>'
            }

            return toReturn
       }
    }
})

var routes = [
    { path: '/', component: Home, name: "home" },
    { path: '/cattleReport', component: CattleReport, name: "cattleReport" },
    { path: '/news/:pageNum?', component: News, name: "news" },
    { path: '/category/:catName/:pageNum?', component: Category, name: "category" },
    { path: '/about', component: About, name: "about" },
    { path: '/events', component: Events, name: "events" },
    { path: '/contact', component: Contact, name: "contact" },
    { path: '/delegates', component: Delegates, name: "delegates" },
    { path: '/staff', component: Staff, name: "staff" },
    { path: '/single/:postName', component: Single, name: "single" },
    { path: '/author/:authorName', component: Author, name: "author" },
    { path: '/login', component: Login, name: "login" },
    { path: '/createAccount', component: CreateAccount, name: "createAccount" },
    { path: '/profile', component: Profile, name: "profile", meta: { requiresAuth: true }},
    { path: '/updateAccount', component: UpdateAccount, name: "updateAccount", meta: { requiresAuth: true }},
    { path: '/updatePassword', component: UpdatePassword, name: "updatePassword", meta: { requiresAuth: true }},
    { path: '/favCategories', component: FavCategories, name: "favCategories", meta: { requiresAuth: true }},
    { path: '/favPosts', component: FavPosts, name: "favPosts", meta: { requiresAuth: true }},
    { path: '/feed/:pageNum?', component: Feed, name: "feed", meta: { requiresAuth: true }},
    { path: '/userComments', component: UserComments, name: "userComments", meta: { requiresAuth: true }},
];

const scrollBehavior = (to, from, savedPosition) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (savedPosition) {
                resolve(savedPosition);
            } else {
                resolve({ x: 0, y: 0 });
            }
        }, 800);
    });
  };
  
const router = new VueRouter({
    routes: routes,
    base: '/',
    scrollBehavior,
});

router.beforeEach(async (to, from, next) => {
    if (from === VueRouter.START_LOCATION) 
    {
        if(store)
        {
            let newStore = {
                navOpen: 0,
                display_name: '',
                user_details: {},
                fav_articles: [],
                fav_categories: [],
                latest_articles: {},
                isLoggedIn: false,
                formMessage: {
                    messageText: '',
                    messageType: '',
                }
            }

            if(localStorage.abpAccessToken && !store.state.isLoggedIn)
            {
                let tokenObject = JSON.parse(localStorage.abpAccessToken)
                
                //validate the token.
                await axios({
                    method: 'post',
                    url: router.app.$apiUrl + 'wp-json/jwt-auth/v1/token/validate',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + tokenObject.token
                    }
                })
                .then(async (res) => {
                    newStore.display_name = tokenObject.profile.user_display_name
                    newStore.isLoggedIn = true
                    newStore.user_details = tokenObject.profile

                    //get the user favs.
                    await axios
                        .get(router.app.$apiUrl + 'wp-json/abp-app/v1/get-user-favs/' + tokenObject.profile.id)
                        .then(userfavs => {
                            newStore.fav_articles = userfavs.data.articles
                            newStore.fav_categories = userfavs.data.categories

                            store.replaceState(newStore)
                        }
                    )
                })
                .catch((err) => {
                    // bad token, just remove it.
                    localStorage.removeItem('abpAccessToken');
                });

                //load fav articles.
                if(localStorage.abpLatestArticles)
                {
                    let articleObject = JSON.parse(localStorage.abpLatestArticles)
                    store.state.latest_articles = articleObject
                }
                
            }
        }
    } 

    if (to.meta.requiresAuth && router.app.$store) {
        if (router.app.$store.state.isLoggedIn) {
            next();
        }
        else
        {
            next({ name: "login" })
        }
    } else {
        next();
    }
  });

var app = new Vue({
    el: '#main_app',
    store: store,
    router: router,
    data: {
        weatherIcon: "01d",
        weatherTemp: "",
        weatherCity: "Calgary",
        navOpen: 0,
        catOpen: 0,
        contactOpen: 0,
        currentYear: new Date().getFullYear(),
    },
    methods: {
        toggleNav: function(nav = 0)
        {
            if(this.$store.state.navOpen != nav)
            {
                this.$store.state.navOpen = nav
            }
            else
            {
                this.$store.state.navOpen = 0
            }
        },
        toggleCats: function()
        {
            if(this.catOpen == 0)
            {
                this.catOpen = 1
            }
            else
            {
                this.catOpen = 0
            }
        },
        toggleContact: function()
        {
            if(this.contactOpen == 0)
            {
                this.contactOpen = 1
            }
            else
            {
                this.contactOpen = 0
            }
        },
        scrollToTop: function() {
            window.scrollTo({
                top: 0,
                left: 0, 
                behavior: 'smooth'
            });
        }
    }, 
    computed: {
        currentRouteName() {
            return this.$route.name;
        },
        currentCategory() {
            return this.$route.params.catName;
        }
    },
    watch: {
        '$store.state.latest_articles': function() {
            if(document.getElementById("notifyMenuItems"))
            {
                console.log("update notifications")
                document.getElementById("notifyMenuItems").innerHTML = this.updateNotifyItems()
            }
        }
    },
    created () {

    },
    destroyed () {
        
    },
    mounted () {
        
    } 
})
