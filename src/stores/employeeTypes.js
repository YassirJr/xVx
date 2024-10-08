import { defineStore } from 'pinia'
import { isQFS } from '@/helpers'

export const useEmployeeTypeStore = defineStore('employee-type', {
  state: () => ({
    types: [],
    type: null,
    cnssSchemes: [
      { value: 'xVxcultural', label: 'xVxcultural' },
      { value: 'general', label: 'general' },
    ],
    frequenciesPay: [
      { value: 'fortnightly', label: 'fortnightly' },
      { value: 'monthly', label: 'monthly' },
    ],
    nbrHours: [
      { value: 8, label: '8:00' },
      { value: 8.5, label: '8:30' },
      { value: 9, label: '9:00' },
      { value: 10, label: '10:00' },
    ],
    weekdays: [
      { value: 'monday', label: 'monday' },
      { value: 'tuesday', label: 'tuesday' },
      { value: 'wednesday', label: 'wednesday' },
      { value: 'thursday', label: 'thursday' },
      { value: 'friday', label: 'friday' },
      { value: 'saturday', label: 'saturday' },
      { value: 'sunday', label: 'sunday' },
    ],
    dayOffTypes: [
      { value: 'rolling', label: 'rolling' },
      { value: 'fixed', label: 'fixed' },
    ],
    calcSeniorities: [
      { value: 'day', label: 'day' },
      { value: 'hire-date', label: 'hire-date' },
      { value: 'no', label: 'no' },
    ],
    payBasis: [
      { value: 'hour', label: 'hour' },
      { value: 'day', label: 'day' },
      { value: 'month', label: 'month' },
    ],
    pointingHourSources: [
      { value: 'pointing-in-out', label: 'pointing-in-out' },
      { value: 'pointing-tasks', label: 'pointing-tasks' },
    ],
    pointingUnitySources: [{ value: 'pointing-tasks', label: 'pointing-tasks' }],
  }),

  getters: {
    getCnssScheme: (state) => (cnss_scheme) => {
      return state.cnssSchemes.find(({ value }) => value == cnss_scheme)?.label
    },
    getFrequencyPay: (state) => (frequency_pay) => {
      return state.frequenciesPay.find(({ value }) => value == frequency_pay)?.label
    },
    getCalcSeniority: (state) => (calc_seniority) => {
      return state.calcSeniorities.find(({ value }) => value == calc_seniority)?.label
    },
    getPayBasis: (state) => (pay_basis) => {
      return state.payBasis.find(({ value }) => value == pay_basis)?.label
    },
    getNbrHours: (state) => (nbr_hours) => {
      return state.nbrHours.find(({ value }) => value == nbr_hours)?.label
    },
    getDayOff: (state) => (day_off) => {
      return state.weekdays.find(({ value }) => value == day_off)?.label
    },
    getTypeDayOff: (state) => (type_day_off) => {
      return state.dayOffTypes.find(({ value }) => value == type_day_off)?.label
    },
    getPointingHourSource: (state) => (source) => {
      return state.pointingHourSources.find(({ value }) => value == source)?.label
    },
    getPointingUnitySource: (state) => (source) => {
      return state.pointingUnitySources.find(({ value }) => value == source)?.label
    },
    getFilteredNbrHours: (state) => {
      return state.nbrHours.filter(({ value }) => (isQFS ? value !== 9 : value !== 8.5))
    },
  },
  actions: {
    fetchEmployeeTypes(query) {
      return new Promise((resolve) => {
        axios
          .get('employee-type', { params: query })
          .then(({ data }) => {
            if (query?.list) this.types = data
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newEmployeeType(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('employee-type', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    updateEmployeeType(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`employee-type/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    removeEmployeeType(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`employee-type/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    fetchEmployeeType(id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`employee-type/${id}`)
          .then(({ data }) => {
            this.type = data
            resolve()
          })
          .catch(() => reject())
      })
    },
  },
})
