import { formDataHeaders } from '@/helpers'
import { defineStore } from 'pinia'

export const useReceptionStore = defineStore('reception', {
  state: () => ({
    receptions: [],
    limiters: [],
    latestReception: {
      code: 1,
      palletCode: 1,
    },
    status: [
      { label: 'available', value: 0, class: 'text-green-500' },
      { label: 'partially-paid', value: 1, class: 'text-orange-500' },
      { label: 'fully-paid', value: 2, class: 'text-teal-500' },
    ],
    labels: [
      { name: 'pallet-ticket', icon: 'menu-2' },
      { name: 'reception-receipt', icon: 'menu-2' },
      { name: 'gn-reception-dilivery-receipt', icon: 'menu-2', ganFruits: true },
    ],
    type: {
      internal: 0,
      external: 1,
    },
  }),
  getters: {
    getLabels() {
      return this.labels
    },
    getPallets() {
      return this.receptions
        .map((el) => {
          return el.pallets.map((pallet) => {
            delete el.pallets

            return { ...el, ...pallet }
          })
        })
        .flat()
    },
  },
  actions: {
    fetchReceptions(query) {
      return new Promise((resolve) => {
        axios
          .get('reception', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              this.receptions = data
            }

            if (data?.latest_reception) {
              const code = data.latest_reception?.code ?? 0
              const palletCode = data.latest_reception?.pallets[0]?.pallet_id ?? 0

              this.latestReception = {
                code: code + 1,
                palletCode: palletCode + 1,
              }
            }

            resolve(data)
          })
          .catch(() => resolve())
      })
    },
    newReception(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('reception', form, formDataHeaders)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateReception(form) {
      return new Promise((resolve, reject) => {
        axios
          .post(`reception/${form.id}?_method=PUT`, form, formDataHeaders)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeReception(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`reception/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    increasePalletCode() {
      this.latestReception.palletCode++
    },
    fetchLimiters() {
      return new Promise((resolve, reject) => {
        axios
          .get('reception/limiter')
          .then(({ data }) => {
            this.limiters = data
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
})
