import { isQFS, isGanFruits } from '@/helpers'

export default {
  namespaced: true,
  state: {
    employees: [],
    leaders: [],
    latest_uid: null,
    family_status: [
      { value: 'married', label: 'married' },
      { value: 'single', label: 'single' },
      { value: 'widower', label: 'widower' },
      { value: 'divorce', label: 'divorce' },
    ],
    social_categories: isQFS
      ? [
          { value: 'workers-1st', label: 'workers-1st', minSalary: 47937 },
          { value: 'workers-3rd', label: 'workers-3rd', minSalary: 50894 },
          { value: 'workers-2nd', label: 'workers-2nd', minSalary: 49473 },
          { value: 'workers-5th', label: 'workers-5th', minSalary: 60664 },
          { value: 'workers-4th', label: 'workers-4th', minSalary: 53648 },
          { value: 'workers-6th', label: 'workers-6th', minSalary: 66277 },
          { value: 'workers-7th', label: 'workers-7th', minSalary: 94668 },
          { value: 'drivers-a', label: 'drivers-a', minSalary: 57261 },
          { value: 'drivers-b', label: 'drivers-b', minSalary: 60680 },
          { value: 'drivers-c', label: 'drivers-c', minSalary: 65568 },
          { value: 'drivers-d', label: 'drivers-d', minSalary: 63743 },
          { value: 'employees-1st', label: 'employees-1st', minSalary: 52207 },
          { value: 'employees-2nd', label: 'employees-2nd', minSalary: 53941 },
          { value: 'employees-3rd', label: 'employees-3rd', minSalary: 56402 },
          { value: 'employees-4th', label: 'employees-4th', minSalary: 67793 },
          { value: 'employees-5th', label: 'employees-5th', minSalary: 70832 },
          { value: 'employees-6th', label: 'employees-6th', minSalary: 88148 },
          { value: 'employees-7th', label: 'employees-7th', minSalary: 96891 },
          { value: 'managers-am-1st', label: 'managers-am-1st', minSalary: 79844 },
          { value: 'managers-am-2nd', label: 'managers-am-2nd', minSalary: 89389 },
          { value: 'managers-am-3rd', label: 'managers-am-3rd', minSalary: 104380 },
          { value: 'managers-am-4th', label: 'managers-am-4th', minSalary: 109894 },
          { value: 'managers-am-5th', label: 'managers-am-5th', minSalary: 124457 },
          { value: 'managers-am-6th', label: 'managers-am-6th', minSalary: 147667 },
          { value: 'trade-manager-7th-a', label: 'trade-manager-7th-a', minSalary: 97539 },
          { value: 'trade-manager-7th-b', label: 'trade-manager-7th-b', minSalary: 105541 },
          { value: 'trade-manager-8th-a', label: 'trade-manager-8th-a', minSalary: 107146 },
          { value: 'trade-manager-8th-b', label: 'trade-manager-8th-b', minSalary: 114337 },
          { value: 'trade-manager-8th-c', label: 'trade-manager-8th-c', minSalary: 115051 },
          { value: 'trade-manager-9th-a', label: 'trade-manager-9th-a', minSalary: 119565 },
          { value: 'trade-manager-9th-b', label: 'trade-manager-9th-b', minSalary: 126189 },
          { value: 'trade-manager-10th-a', label: 'trade-manager-10th-a', minSalary: 134309 },
          { value: 'trade-manager-10th-b', label: 'trade-manager-10th-b', minSalary: 149616 },
          { value: 'trade-manager-10th-c', label: 'trade-manager-10th-c', minSalary: 165761 },
          { value: 'trade-manager-11th', label: 'trade-manager-11th', minSalary: 185828 },
          { value: 'service-provider', label: 'service-provider', minSalary: 0 },
          { value: 'out-of-scale', label: 'out-of-scale', minSalary: 0 },
        ]
      : [
          { value: 'senior', label: 'senior', minSalary: 0 },
          { value: 'executive', label: 'executive', minSalary: 0 },
          { value: 'supervisor', label: 'supervisor', minSalary: 0 },
          { value: 'technician-employee', label: 'technician-employee', minSalary: 0 },
          { value: 'worker', label: 'worker', minSalary: 0 },
        ],
    employee_docs: [
      { label: 'card', qfs: false },
      { label: 'card-permanent', qfs: false },
      { label: 'contract', qfs: false },
      { label: 'aptitude-file', qfs: false },
      { label: 'aptitude-file', qfs: true },
      { label: 'pointing-badge', qfs: true },
      { label: 'card-senegal', qfs: true },
      { label: 'seasonal-contract-senegal', qfs: true },
      { label: 'cdd-senegal', qfs: true },
      { label: 'dmt-senegal', qfs: true },
      { label: 'pointing-card', ganFruits: true },
    ],
    genders: [
      { value: 'female', label: 'female' },
      { value: 'male', label: 'male' },
    ],
    contract_types: [
      { value: 'cdi', label: 'cdi' },
      { value: 'cdi-manager', label: 'cdi-manager' },
      { value: 'cdd', label: 'cdd' },
      { value: 'seasonal', label: 'seasonal' },
      { value: 'service-contract', label: 'service-contract' },
    ],
    employee_number_days: 0,
  },
  getters: {
    employees: (state) => state.employees,
    leaders: (state) => state.leaders,
    getLeaders(state) {
      return state.employees.filter(({ leader_id }) => !leader_id)
    },
    latest_uid: (state) => state.latest_uid,
    familyStatus: (state) => state.family_status,
    socialCategories: (state) => state.social_categories,
    getFamilyStatus: (state) => (family_status) => {
      return state.family_status.find(({ value }) => value == family_status)?.label
    },
    getSocialCategory: (state) => (socialCategory) => {
      return state.social_categories.find(({ value }) => value == socialCategory)
    },
    getEmployeeDocs: (state) => {
      const docList = state.employee_docs.filter(({ qfs }) => isQFS == qfs).map(({ label }) => label)
      const additionalDocs = state.employee_docs
        .filter(({ ganFruits }) => isGanFruits == ganFruits)
        .map(({ label }) => label)

      return [...docList, ...additionalDocs]
    },
    getEmployeeNumberDays: (state) => state.employee_number_days,
    getGenders: (state) => state.genders,
    getContractTypes: (state) => state.contract_types,
  },
  mutations: {
    SET_EMPLOYEES(state, value) {
      state.employees = value
    },
    SET_LEADERS(state, value) {
      state.leaders = value
    },
    SET_LATEST_EMPLOYEE_UID(state, value) {
      state.latest_uid = value
    },
    SET_EMPLOYEE_NUMBER_DAYS(state, value) {
      state.employee_number_days = value
    },
  },
  actions: {
    fetchEmployees({ commit }, query) {
      return new Promise((resolve) => {
        axios
          .get('employee', { params: query })
          .then(({ data }) => {
            commit('SET_LATEST_EMPLOYEE_UID', data.latest_uid)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    newEmployee({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .post('employee', form)
          .then(() => {
            dispatch('fetchAllEmployees')
            resolve()
          })
          .catch(() => reject())
      })
    },
    updateEmployee({ dispatch }, form) {
      return new Promise((resolve, reject) => {
        axios
          .put(`employee/${form.id}`, form)
          .then(() => {
            dispatch('fetchAllEmployees')
            resolve()
          })
          .catch(() => reject())
      })
    },
    removeEmployee(_, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`employee/${id}`)
          .then(() => {
            resolve()
          })
          .catch(() => reject())
      })
    },
    fetchAllEmployees({ commit }, query = {}) {
      return new Promise((resolve) => {
        axios
          .get('employees', { params: query })
          .then(({ data }) => {
            commit(query?.leaders_only ? 'SET_LEADERS' : 'SET_EMPLOYEES', data)
            resolve(data)
          })
          .catch(() => resolve([]))
      })
    },
    employeeUpdater(_, data) {
      return new Promise((resolve, reject) => {
        axios
          .post(`employee/updater`, data)
          .then(() => resolve())
          .catch(() => reject())
      })
    },
  },
}
