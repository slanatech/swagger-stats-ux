import Vue from 'vue';
import Vuex from 'vuex';
import stats from '@/store/stats';
import RRRCollection from '@/store/rrrcollection';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    stats: null // ???
  },
  modules: {
    stats,
    lasterrors: RRRCollection,
    longestrequests: RRRCollection
  },
  mutations: {
    // +++
  },
  actions: {
    // +++
  }
});
