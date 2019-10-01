import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import './quasar';

// Dashblocks CSS
//import '../../dashblocks/dist/dashblocks.css';

// TEMP - for development
//import '../../dashblocks/dist/dashblocks.css';


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
