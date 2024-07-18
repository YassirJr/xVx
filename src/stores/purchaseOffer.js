import { formDataHeaders } from '@/helpers'
import { defineStore } from 'pinia'

export const usePurchaseOfferStore = defineStore('purchase-offer', {
  state: () => ({
    latestPurchaseOffer: 0,
    purchaseOffers: [],
    priorities: [
      { label: 'urgent', value: 'urgent' },
      { label: 'high', value: 'high' },
      { label: 'medium', value: 'medium' },
      { label: 'low', value: 'low' },
    ],
    statusList: [
      { label: 'open', value: 'open', class: 'text-green-500' },
      { label: 'validated', value: 'validated', class: 'text-yellow-500' },
      { label: 'purchasing-in-progress', value: 'purchasing-in-progress', class: 'text-blue-500' },
      { label: 'parcel-delivered', value: 'parcel-delivered', class: 'text-red-500' },
      { label: 'entirely-delivered', value: 'entirely-delivered', class: 'text-gray-500' },
    ],
    natures: [
      { label: 'opex', value: 1 },
      { label: 'capex', value: 0 },
    ],
  }),
  actions: {
    fetchPurchaseOffers(query) {
      return new Promise((resolve) => {
        axios
          .get('purchase-offer', { params: query })
          .then(({ data }) => {
            if (query?.list) this.purchaseOffers = data
            else this.latestPurchaseOffer = data.latest_purchase_offer + 1

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPurchaseOffer(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('purchase-offer', form, formDataHeaders)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updatePurchaseOffer(form) {
      return new Promise((resolve, reject) => {
        axios
          .post(`purchase-offer/${form.id}?_method=PUT`, form, formDataHeaders)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePurchaseOffer(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`purchase-offer/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
