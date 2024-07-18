import { defineStore } from 'pinia'
import { isGanFruits } from '@/helpers'
import { useLotInstallmentStore } from '@/stores/lotInstallment'

const lotInstallmentStore = useLotInstallmentStore()

export const useConfectionStore = defineStore('confection', {
  state: () => ({
    confections: [],
    latestPalletCode: 1,
    statusOptions: [
      { label: 'in-stock', value: 0, class: 'text-green-500' },
      { label: 'prepare', value: 1, class: 'text-orange-500' },
      { label: 'charged', value: 2, class: 'text-red-500' },
    ],
    labels: [
      { name: 'confection-ticket', icon: 'menu-2', ganFruits: false },
      { name: 'confection-receipt', icon: 'box', ganFruits: true },
      { name: 'confection-receipt-2', icon: 'box', ganFruits: true },
      { name: 'box-ticket', icon: 'box', ganFruits: false },
      { name: 'box-ticket-90_61', icon: 'box', ganFruits: false },
      { name: 'box-ticket-80_55', icon: 'box', ganFruits: false },
      { name: 'gn-confection-organic-ticket', icon: 'box', ganFruits: true },
      { name: 'box-ticket-80_80', icon: 'box', ganFruits: true },
      { name: 'confection-pallet', icon: 'menu-2', ganFruits: true },
    ],
  }),
  getters: {
    getLabels() {
      return this.labels.filter(({ ganFruits }) => ganFruits == isGanFruits)
    },
    getConfectionsInStock: (state) => {
      return state.confections.filter(({ status }) => status == state.statusOptions[0].value)
    },
  },
  actions: {
    fetch(query) {
      return new Promise((resolve) => {
        axios
          .get('confection', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              this.confections = data
            }

            if (data?.latest_pallet_code) {
              this.latestPalletCode = data.latest_pallet_code + 1
            }

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    create(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('confection', form)
          .then(() => {
            lotInstallmentStore.fetchLimiters().finally(() => resolve())
          })
          .catch(() => reject())
      })
    },
    update(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`confection/${form.id}`, form)
          .then(() => {
            lotInstallmentStore.fetchLimiters().finally(() => resolve())
          })
          .catch(() => reject())
      })
    },
    remove(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`confection/${id}`)
          .then(() => {
            lotInstallmentStore.fetchLimiters().finally(() => resolve())
          })
          .catch(() => reject())
      })
    },
  },
})
