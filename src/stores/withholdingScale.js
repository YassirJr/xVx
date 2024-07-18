import { defineStore } from 'pinia'

export const useWithholdingScaleStore = defineStore('withholding-scale', {
  state: () => ({
    withholdingScales: [],
    fields: [
      { name: 'gross_salary' },
      { name: 'trimf' },
      { name: 'part_1' },
      { name: 'part_1_5' },
      { name: 'part_2' },
      { name: 'part_2_5' },
      { name: 'part_3' },
      { name: 'part_3_5' },
      { name: 'part_4' },
      { name: 'part_4_5' },
      { name: 'part_5' },
    ],
  }),
  actions: {
    fetch(query) {
      return new Promise((resolve) => {
        axios
          .get('withholding-scale', { params: query })
          .then(({ data }) => {
            this.withholdingScales = data.data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    create(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('withholding-scale', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
