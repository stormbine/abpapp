Vue.prototype.$apiUrl = 'http://stormbine.com/abp/'

const store = new Vuex.Store({
    state: {
        navOpen: 0,
        display_name: '',
        user_logged_in: 0,
        user_details: {},
        isLoggedIn: false,
    },
    mutations: {

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

router.beforeEach((to, from, next) => {
    if(router.app.$store)
    {
        console.log("has state")
    }
    else
    {
        console.log("no state")
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
        toggleNav: function()
        {
            if(this.$store.state.navOpen == 0)
            {
                this.$store.state.navOpen = 1
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
       },
       logoutUser: function() {
           this.$store.state.display_name = ''
           this.$store.state.isLoggedIn = false
           localStorage.removeItem('abpAccessToken');

           this.$store.state.navOpen = 0

           router.push({ path: '/' })
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
    created () {

    },
    destroyed () {
        
    },
    mounted () {
        if(localStorage.abpAccessToken)
        {
            let tokenObject = JSON.parse(localStorage.abpAccessToken)
            //validate the token.
            axios({
                method: 'post',
                url: this.$apiUrl + 'wp-json/jwt-auth/v1/token/validate',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + tokenObject.token
                }
            })
            .then((res) => {
                this.$store.state.display_name = tokenObject.profile.user_display_name
                this.$store.state.isLoggedIn = true
            })
            .catch((err) => {
                // bad token, just remove it.
                localStorage.removeItem('abpAccessToken');
            });
        }
    } 
})
