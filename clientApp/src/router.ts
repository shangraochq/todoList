import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/home/entry.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/app',
            name: 'home',
            component: Home,
        },
        {
            path: '/app/login',
            name: 'login',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/login/entry.vue'),
        },
    ],
});
