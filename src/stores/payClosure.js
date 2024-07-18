import { defineStore } from 'pinia'
import { dayjs } from '@/plugins'
import { DATE_FORMAT } from '@/constants'

export const usePayClosureStore = defineStore('payClosure', {
  state: () => ({
    payClosures: [],
    period: [
      { label: '1st-period', value: false },
      { label: '2nd-period', value: true },
    ],
  }),
  getters: {
    payClosuresByEmployeeType: (state) => (type_id) => {
      return state.payClosures
        .filter(({ employee_type_id }) => employee_type_id === type_id)
        .map((el) => ({
          ...el,
          start_date: dayjs(el.start_date).format(DATE_FORMAT),
          end_date: dayjs(el.end_date).format(DATE_FORMAT),
        }))
    },
  },
  actions: {
    fetchPayClosures(query) {
      this.payClosures = []
      return new Promise((resolve) => {
        axios
          .get('pay-closure', { params: query })
          .then(({ data }) => {
            if (query?.list) this.payClosures = data

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newPayClosure(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('pay-closure', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removePayClosure(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`pay-closure/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    toggleClosureStatus(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`pay-closure/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
