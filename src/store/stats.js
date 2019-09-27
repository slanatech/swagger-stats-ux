import api from '@/store/api';
import statsContainer from '@/store/statscontainer';

// TODO consider placeholders
const state = {
  updated: 0
};

const getters = {};

const mutations = {
  SET_STATS(state, { stats }) {
    // We store all stats in container: there is no need to make all stats observable,
    // size of stats can be quite big and they can be updated frequently
    // In Vuex we store the timestamp of last stats update, so views can watch on it and react
    statsContainer.updateStats(stats);
    state.updated = Date.now();
  }
};

const actions = {
  async getStats({ commit }, { fields = null, method = null, path = null }) {
    let stats = null;
    let getStatsRes = await api.getStats({ fields: fields, method: method, path: path });
    if (getStatsRes.success) {
      stats = getStatsRes.payload;
    }
    commit('SET_STATS', { stats: stats });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
