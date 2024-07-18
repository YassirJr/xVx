import { defineStore } from 'pinia'
import { isGanFruits } from '@/helpers'

export const useExpeditionStore = defineStore('expedition', {
  state: () => ({
    expeditions: [],
    latestExpeditionsCode: 1,
    status: [
      { label: 'on-hold', value: false, class: 'text-orange-500' },
      { label: 'shipped', value: true, class: 'text-green-500' },
    ],
    labels: [
      // { name: 'absence-certificate', icon: 'box' },
      // { name: 'invoice', icon: 'box' },
      // { name: 'phytosanitary-certificate', icon: 'box' },
      { name: 'package-list', icon: 'box', ganFruits: false },
      { name: 'charges', icon: 'box' },
      { name: 'gn-package-list', icon: 'box', ganFruits: true },
    ],
  }),
  getters: {
    getLabels() {
      return [...this.labels.filter(({ ganFruits }) => ganFruits == isGanFruits || ganFruits == undefined)]
    },
  },
  actions: {
    fetch(query) {
      return new Promise((resolve) => {
        axios
          .get('expedition', { params: query })
          .then(({ data }) => {
            if (query.list) {
              this.expeditions = data
            }

            if (data?.latest_expedition_code) {
              this.latestExpeditionsCode = data.latest_expedition_code + 1
            }

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    create(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('expedition', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    update(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`expedition/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    remove(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`expedition/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateStatus(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`expedition/${form.id}`, { is_shipped: !form.is_shipped })
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
