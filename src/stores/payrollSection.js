import { isQFS } from '@/helpers'
import { defineStore } from 'pinia'

export const usePayrollSectionStore = defineStore('payroll-section', {
  state: () => ({
    payrollSections: [],
    sectionTypes: [
      { value: 'secondary', label: 'secondary' },
      { value: 'main', label: 'main' },
    ],
    modes: [
      { value: 'input', label: 'input' },
      { value: 'calculated', label: 'calculated' },
    ],
    symbols: [
      { value: '*', label: '*' },
      { value: '/', label: '/' },
      { value: '+', label: '+' },
      { value: '-', label: '-' },
    ],
    natures: [
      { value: 'gain', label: 'gain' },
      { value: 'withheld', label: 'withheld' },
      { value: 'value', label: 'value' },
    ],
    extraValues: [
      { value: 1111, label: 'business-days' },
      { value: 1112, label: 'daily-based-salary' },
      { value: 1113, label: 'hourly-based-salary' },
      { value: 1114, label: 'total-unities' },
      { value: 1115, label: 'price-unity-medium' },
      { value: 1116, label: 'number-hour-normal' },
      { value: 1117, label: 'extra-hours25' },
      { value: 1139, label: 'extra-hours40', qfs: true },
      { value: 1118, label: 'extra-hours50', qfs: false },
      { value: 1140, label: 'extra-hours60', qfs: true },
      { value: 1119, label: 'extra-hours100' },
      { value: 1120, label: isQFS ? 'rate-salary-ipres-rg' : 'rate-salary-cnss' },
      { value: 1121, label: 'rate-salary-amo', qfs: false },
      { value: 1122, label: isQFS ? 'rate-salary-ipres-rc' : 'rate-salary-cimr' },
      { value: 1123, label: 'gross-salary-cnss', qfs: false },
      { value: 1124, label: 'professional-charge' },
      { value: 1125, label: 'rate-tax-revenue' },
      { value: 1126, label: 'gross-tax-revenue' },
      { value: 1127, label: 'net-tax-revenue' },
      { value: 1128, label: 'number-hour-25' },
      { value: 1202, label: 'number-hour-40', qfs: true },
      { value: 1129, label: 'number-hour-50', qfs: false },
      { value: 1203, label: 'number-hour-60', qfs: true },
      { value: 1204, label: 'number-hour-100', qfs: true },
      { value: 1130, label: 'rate-seniority' },
      { value: 1131, label: 'hourly-bonus' },
      { value: 1132, label: 'sum-task-bonus' },
      { value: 1133, label: 'trimf', qfs: true },
      { value: 1134, label: 'nbr-parts', qfs: true },
      { value: 1135, label: 'tax-revenue', qfs: true },
      { value: 1136, label: 'gross-salary-ipres-rc', qfs: true },
      { value: 1137, label: 'gross-salary-ipres-rg', qfs: true },
      { value: 1138, label: 'ipm', qfs: true },
      { value: 1141, label: 'ipres-rc-employer-rate', qfs: true },
      { value: 1142, label: 'ipres-rg-employer-rate', qfs: true },
      { value: 1143, label: 'cfce-employer-rate', qfs: true },
      { value: 1144, label: 'ipm-employer-rate', qfs: true },
      { value: 1145, label: 'css-at-employer-rate', qfs: true },
      { value: 1146, label: 'css-af-employer-rate', qfs: true },
      { value: 1200, label: 'number-zero' },
      { value: 1201, label: 'number-one' },
    ],
  }),
  getters: {
    getSectionType: (state) => (section_type) => {
      return state.sectionTypes.find(({ value }) => value == section_type)?.label
    },
    getMode: (state) => (mode) => {
      return state.modes.find(({ value }) => value == mode)?.label
    },
    getNature: (state) => (nature) => {
      return state.natures.find(({ value }) => value == nature)?.label
    },
    getExtraValue: (state) => (val) => {
      return state.extraValues.find(({ value }) => value == val)?.label
    },
    getExtraValues: (state) => {
      return state.extraValues.filter(({ qfs }) => qfs == undefined || qfs == isQFS)
    },
  },
  actions: {
    fetch(query) {
      return new Promise((resolve) => {
        axios
          .get('payroll-section', { params: query })
          .then(({ data }) => {
            if (query?.list) {
              this.payrollSections = data
            }

            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    create(form) {
      return new Promise((resolve, reject) => {
        axios
          .post('payroll-section', form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    update(form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`payroll-section/${form.id}`, form)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    remove(id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`payroll-section/${id}`)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
    reorder(list) {
      return new Promise((resolve, reject) => {
        axios
          .put('payroll-section/reorder', list)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
})
