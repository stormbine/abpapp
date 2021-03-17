Vue.prototype.$apiUrl = 'https://abpdaily.com/'

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
];
  
var router = new VueRouter({
    routes: routes,
    mode: 'history',
    base: '/',
});
  
var app = new Vue({
    el: '#main_app',
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
            if(this.navOpen == 0)
            {
                this.navOpen = 1
            }
            else
            {
                this.navOpen = 0
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

    } 
})