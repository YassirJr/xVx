export default {
  namespaced: true,
  state: {
    types: [],
    sites: [],
    groups: [
      { label: 'pack-house', value: 2 },
      { label: 'farm', value: 0 },
      { label: 'grower', value: 1 },
    ],
  },
  getters: {
    types: (state) => state.types,
    sites: (state) => state.sites,
    groups: (state) => state.groups,
  },
  mutations: {
    SET_TYPES(state, value) {
      state.types = value
    },
    SET_SITES(state, value) {
      state.sites = value
    },
  },
  actions: {
    fetchTypes({ commit }) {
      return axios.get('site-type').then(({ data }) => {
        commit('SET_TYPES', data)
      })
    },
    fetchSites(_, query) {
      return new Promise((resolve) => {
        axios
          .get('site', { params: query })
          .then(({ data }) => {
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newType({ commit, getters }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('site-type', form)
          .then(({ data }) => {
            commit('SET_TYPES', [data, ...getters.types])
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateType({ commit, getters }, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`site-type/${form.id}`, form)
          .then(() => {
            getters.types.find((el) => el.id == form.id).type = form.type
            commit('SET_TYPES', getters.types)
            resolve()
          })
          .catch(() => reject())
      })
    },
    removeType({ commit, getters }, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`site-type/${id}`)
          .then(() => {
            const types = getters.types.filter((el) => el.id != id)
            commit('SET_TYPES', types)
            resolve()
          })
          .catch(() => reject())
      })
    },
    newSite({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('site', form)
          .then(() => {
            dispatch('fetchAllSites')
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateSite(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`site/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeSite(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`site/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    fetchAllSites({ commit }) {
      return new Promise((resolve) => {
        axios
          .get('sites')
          .then(({ data }) => {
            commit('SET_SITES', data)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
  },
}
