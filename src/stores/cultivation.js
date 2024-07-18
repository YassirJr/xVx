import { defineStore } from 'pinia'

export const useCultivationStore = defineStore('cultivation', {
  state: () => ({
    cultivations: [],
    cycles: [
      { value: 1, label: '1st-cycle' },
      { value: 2, label: '2nd-cycle' },
      { value: 3, label: '3rd-cycle' },
      { value: 4, label: '4th-cycle' },
    ],
    statusList: [
      { label: 'open', value: 0, class: 'text-green-500' },
      { label: 'parcely-arrached', value: 1, class: 'text-orange-500' },
      { label: 'arrached', value: 2, class: 'text-red-500' },
    ],
  }),
  actions: {
    fetchCultivations(query) {
      return new Promise((resolve) => {
        axios
          .get('cultivation', { params: query })
          .then(({ data }) => {
            if (query?.list) this.cultivations = data

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newCultivation(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('cultivation', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateCultivation(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`cultivation/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeCultivation(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`cultivation/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
