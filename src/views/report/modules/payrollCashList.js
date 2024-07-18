import { t } from '@/plugins'
import { InputFilter } from '@/helpers'
import { usePayrollSectionStore } from '@/stores/payrollSection'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { usePayClosureStore } from '@/stores/payClosure'

const payrollSectionStore = usePayrollSectionStore()
const employeeTypeStore = useEmployeeTypeStore()
const payClosureStore = usePayClosureStore()

const payrollCashList = () => ({
  title: 'payroll-cash-report',
  description:
    'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard',
  endpoint: 'payroll-employee-listing',
  permission: 'report-payroll-employee-listing',
  isPayClosure: true,
  footer: 'total_values',
  columns: [
    { field: 'employee.uid', title: t('code'), ...InputFilter() },
    { field: 'employee.firstname', title: t('firstname') },
    { field: 'employee.lastname', title: t('lastname') },
    { field: 'employee.cin', title: t('cin') },
    { field: 'total', title: payrollSectionStore.payrollSections.find(({ code }) => code === 6000)?.label },
  ],
  footerCondition: (field, total) => {
    switch (field) {
      case 'employee.uid':
        return t('total')
      case 'total':
        return (+total.footer).toFixed(2)
      default:
        return ''
    }
  },
  fetchData: async () => {
    await payrollSectionStore.fetch({ list: true })
    await employeeTypeStore.fetchEmployeeTypes({ list: true })
    await payClosureStore.fetchPayClosures({ list: true })
  },
})

export default payrollCashList
