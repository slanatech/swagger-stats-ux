import Vue from 'vue';
import Router from 'vue-router';
import DefaultLayout from './layouts/Default.vue';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Summary from './views/summary.vue';
import Rates from './views/rates.vue';
import Horizon from './views/horizon.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'summary',
          component: Summary
        },
        {
          path: '/horizon',
          name: 'horizon',
          component: Horizon
        },
        {
          path: '/rates',
          name: 'rates',
          component: Rates
        }
      ]
    }
  ]
});
