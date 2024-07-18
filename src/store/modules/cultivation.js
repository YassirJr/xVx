import { sum } from '@/helpers'

export default {
  namespaced: true,
  state: {
    cultivations: [],
    activeCultivations: [],
    statusList: [
      { label: 'open', value: 0, class: 'text-green-500' },
      { label: 'parcely-arrached', value: 1, class: 'text-orange-500' },
      { label: 'arrached', value: 2, class: 'text-red-500' },
    ],
  },
  getters: {
    cultivations: (state) => state.cultivations,
    activeCultivations: (state) => (parcelId) => {
      const filteredCultivationByParcel = state.activeCultivations
        .filter(({ parcel_id }) => {
          return parcel_id == parcelId
        })
        .map(({ surface }) => surface)

      return sum(filteredCultivationByParcel) ?? 0
    },
  },
  mutations: {
    SET_CULTIVATIONS(state, value) {
      state.cultivations = value
    },
    SET_ACTIVE_CULTIVATIONS(state, value) {
      state.activeCultivations = value
    },
  },
  actions: {
    fetchCultivations({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('cultivation', { params: query })
          .then(({ data }) => {
            if (query?.list) commit('SET_CULTIVATIONS', data)
            if (data?.active_cultivations?.length) commit('SET_ACTIVE_CULTIVATIONS', data.active_cultivations)

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newCultivation(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('cultivation', form)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateCultivation(_, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`cultivation/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeCultivation(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`cultivation/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
}
