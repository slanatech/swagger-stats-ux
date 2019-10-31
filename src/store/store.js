import Vue from 'vue';
import Vuex from 'vuex';
import stats from '@/store/stats';
import lasterrors from '@/store/lasterrors';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    stats: null // ???
  },
  modules: {
    stats,
    lasterrors
  },
  mutations: {
    // +++
  },
  actions: {
    // +++
  }
});
