import Vue from 'vue';
import Vuex from 'vuex';
import stats from '@/store/stats';
import RRRCollection from '@/store/rrrcollection';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    refreshTrigger: 0,
    refreshTimeout: 5000,
    refreshLast: 0,
    intervalId: null
  },
  modules: {
    stats,
    lasterrors: RRRCollection,
    longestrequests: RRRCollection
  },
  mutations: {
    SET_INTERVAL_ID(state, { id }) {
      state.intervalId = id;
    },
    SET_REFRESH_TIMEOUT(state, { timeout }) {
      state.refreshTimeout = timeout;
    },
    PERFORM_REFRESH(state) {
      state.refreshLast = Date.now();
      state.refreshTrigger = state.refreshLast;
    }
  },
  actions: {
    initRefresh({ commit, state }) {
      if (state.intervalId) {
        return; // Already set up
      }
      let intervalId = setInterval(() => {
        if (state.refreshTimeout === 0) {
          return;
        }
        let tsNow = Date.now();
        let elapsed = tsNow - state.refreshLast;
        // If we're almost at refresh interval, refresh
        if (elapsed >= state.refreshTimeout - 100) {
          console.log(`Need to refresh: ${tsNow} - ${elapsed}`);
          commit('PERFORM_REFRESH');
        }
      }, 1000);
      commit('SET_INTERVAL_ID', { id: intervalId });
    },
    setRefreshTimeout({ commit }, { timeout }) {
      commit('SET_REFRESH_TIMEOUT', { timeout: timeout });
    },
    performRefresh({ commit }) {
      commit('PERFORM_REFRESH');
    }
  }
});
