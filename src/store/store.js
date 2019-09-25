import Vue from 'vue';
import Vuex from 'vuex';
import stats from '@/store/stats';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    stats: null
  },
  modules: {
    stats
  },
  mutations: {
    // +++
  },
  actions: {
    // +++
  }
});
