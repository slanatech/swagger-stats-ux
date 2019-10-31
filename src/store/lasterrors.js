/* Collection of Request Response Records captured for detailed view in UI
 */
const state = {
  errors: []
};

const getters = {};

const mutations = {
  ADD(state, { rrr }) {
    state.errors.push(rrr);
  },
  REMOVE(state, { index }) {
    state.errors.splice(index, 1);
  }
};

const actions = {
  async add({ commit }, { rrr }) {
    commit('ADD', { rrr: rrr });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
