import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import VueGoodTablePlugin from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css';

import './quasar';

// Dashblocks CSS
//import '../../dashblocks/dist/dashblocks.css';

// TEMP - for development
//import '../../dashblocks/dist/dashblocks.css';

Vue.config.productionTip = false;

Vue.use(VueGoodTablePlugin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
