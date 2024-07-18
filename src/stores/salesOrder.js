import { defineStore } from 'pinia'
import { dayjs } from '@/plugins'
import { isGanFruits } from '@/helpers'

export const useSalesOrderStore = defineStore('sales-order', {
  state: () => ({
    salesOrders: [],
    latestInvoiceNbr: 0,
    natureOptions: [
      { label: 'export', value: true },
      { label: 'local-market', value: false },
    ],
    incoterms: [
      { label: 'cost-and-freight', value: 0 },
      { label: 'cost-insurance-and-freight', value: 1 },
      { label: 'carriage-and-insurance-paid-to', value: 2 },
      { label: 'carriage-paid-to', value: 3 },
      { label: 'delivery-at-placet', value: 4 },
      { label: 'delivery-at-terminal', value: 5 },
      { label: 'delivery-duty-paid', value: 6 },
      { label: 'ex-works', value: 7 },
      { label: 'free-alongside-ship', value: 8 },
      { label: 'free-carrier', value: 9 },
      { label: 'free-on-board', value: 10 },
    ],
    labels: [
      { name: 'sales-order-invoice', icon: 'box', ganFruits: false },
      { name: 'gn-invoice', icon: 'box', ganFruits: true },
      { name: 'gn-sales-package-list', icon: 'box', ganFruits: true },
    ],
  }),
  getters: {
    getLatestinvoice(state) {
      const currentyear = dayjs().format('YYYY')

      if (state.latestInvoiceNbr == 0) {
        return `${currentyear}/0001`
      } else {
        const [latestYear, latestNumber] = state.latestInvoiceNbr.split('/')

        return currentyear != +latestYear
          ? `${currentyear}/0001`
          : `${currentyear}/${(+latestNumber + 1).toString().padStart(4, '0')}`
      }
    },
    getLabels() {
      return this.labels.filter(({ ganFruits }) => ganFruits == isGanFruits)
    },
  },
  actions: {
    fetch(query) {
      return new Promise((resolve, reject) => {
        axios
          .get('sales-order', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              this.salesOrders = data
            }
            this.latestInvoiceNbr = data.latest_invoice_nbr

            resolve(data)
          })
          .catch(() => reject())
      })
    },
    create(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('sales-order', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    update(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`sales-order/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    remove(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`sales-order/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
