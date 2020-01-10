
Vue.filter('lowercase', function (value) {
    return !value ? '' : value.toLowerCase();
});

let store = new Vuex.Store({
    state: {
        list: {},
        filtered: false,
    },
    getters: {
        list: state => state.list,
        filtered: state => state.filtered,
    },
    mutations: {
        setCard(state, data) {
            state.list = data;
        },
        setFiltered(state, data) {
            state.filtered = data;
        },
    }
});

let pokemonlist = {
    prop: ['list', 'filtered', 'searchValue', 'searchFiltered'],
    data() {
        return {
            'list': {},
            'filtered': {},
            'searchValue': '',
            'searchFiltered': false,
            'searchResults': true
        }
    },
    methods: {
        clearSearch: function () {
            this.filtered = this.list;
            this.searchFiltered = false;
            store.commit('setFiltered', false);
        },
        clearStore: function () {
            store.commit('setCard', null);
            localStorage.setItem('pokemonPage', null);
        },
        search: function (value = null) {
            if (!value) value = this.searchValue.trim();
            if ((value || value !== '') && this.list) {

                let result = this.list.filter((card) => {
                    return card.name.toLowerCase().match(new RegExp(`^${value.toLowerCase()}`, 'ig')) !== null;
                });

                if (result.length >= 1) {
                    this.filtered = result;
                    store.commit('setFiltered', true);

                    this.searchFiltered = true;
                    this.searchResults = true;
                    return;
                }
                this.searchResults = false;
                this.clearSearch()
            }
        },
        scrollTop: function () {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        },
        openPage: function (card) {
            store.commit('setCard', card);
            store.commit('setFiltered', false);

            localStorage.setItem('pokemonPage', JSON.stringify(card));
            router.push({ path: `/pokemon/${card.name}` });
            this.scrollTop();
        },
        fetchPokemons: function (page = 1, size = 50) {
            let that = this;
            fetch('/pokemons',
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ page, size })
                })
                .then(response => response.json())
                .then((data) => {
                    that.list = that.filtered = data.cards.filter((card) => card.supertype === 'Pokémon')
                        .map((card) => {
                            return {
                                'name': card.name.toLowerCase(),
                                'id': card.id,
                                'image': card.imageUrl,
                                'type': card.types,
                                'attacks': card.attacks,
                                'resistances': card.resistances,
                                'weaknesses': card.weaknesses
                            }
                        }).sort((a, b) => {
                            let nameA = a.name.toUpperCase();
                            let nameB = b.name.toUpperCase();
                            return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
                        });
                });
        }
    },
    created() {
        this.fetchPokemons(1, 50);
    }
};

let pokemonPage = {
    props: ['card'],
    template: `
    <div v-show="!this.$store.getters.filtered && card && $route.params.id" class="card-container card mx-auto py-3 px-md-5">
        <h1 class="card-header">{{card.name}} - Mais informações</h1>
        <div class="card-body">
            <div class="row row-cols-12">
                <div class="pokemon-card col-md-6 col-lg-4 col-sm-12 col-xs-12">
                    <img v-lazyload :data-src='card.image' :alt='card.name' :title='card.name' />
                </div>
                <div class="col-md-6 col-lg-8 col-sm-12 col-xs-12 table-responsive">
                    <table class="table table-hover">
                        <tbody>
                            <tr v-for="info,key in card">
                                <td scope="row">{{key}}<div class="card"><pre>{{ info }}</pre></div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <a href="/" class="btn btn-primary">Home</a>
        </div>
    </div>
    `
};

let routes = [
    {
        path: '/pokemon/:id',
        component: pokemonPage,
        props: (route) => {
            return {
                card: (store.getters.list && store.getters.list.name ?
                    store.getters.list : JSON.parse(localStorage.getItem('pokemonPage')))
            }
        }
    }
];

let router = new VueRouter({
    routes,
    mode: 'history'
});


const LazyLoadDirective = (el) => {
    if ('IntersectionObserver' in window) {
        let io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    var img = entry.target;
                    var src = img.getAttribute('data-srcset') || img.getAttribute('data-src');
                    if (img.tagName == 'img' || img.tagName == 'IMG') img.setAttribute('src', src);
                    else img.setAttribute('srcset', src);
                    observer.disconnect();
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: .5
        });

        io.observe(el)
    }
};


Vue.directive("lazyload", LazyLoadDirective);

Vue.use(VueRouter);
Vue.use(Vuex);

new Vue({
    router,
    store,
    components: {
        pokemonlist
    }
}).$mount('#app');