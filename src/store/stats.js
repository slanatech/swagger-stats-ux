import api from '@/store/api';

// TODO consider placeholders
const state = {
  all: null
};

const getters = {};

const mutations = {
  SET_STATS(state, { stats }) {
    for (let key of Object.keys(stats)) {
      // Store whatever we loaded
      state[key] = stats[key];
    }
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
