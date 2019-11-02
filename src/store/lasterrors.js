/* Collection of Request Response Records captured for detailed view in UI
 */
const state = {
  items: [],
  expanded: []
};

const getters = {};

const mutations = {
  ADD(state, { rrr }) {
    state.expanded.unshift(true);
    state.items.unshift(rrr);
  },
  REMOVE(state, { index }) {
    state.expanded.splice(index, 1);
    state.items.splice(index, 1);
  }
};

const actions = {
  add({ commit }, { rrr }) {
    commit('ADD', { rrr: rrr });
  },
  remove({ commit }, { index }) {
    commit('REMOVE', { index: index });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
