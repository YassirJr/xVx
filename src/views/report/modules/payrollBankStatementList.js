import { t } from '@/plugins'
import { InputFilter, SelectFilter } from '@/helpers'
import { usePayrollSectionStore } from '@/stores/payrollSection'
import { useBankStore } from '@/stores/bank'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { usePayClosureStore } from '@/stores/payClosure'

const payrollSectionStore = usePayrollSectionStore()
const bankStore = useBankStore()
const employeeTypeStore = useEmployeeTypeStore()
const payClosureStore = usePayClosureStore()

const payrollBankStatementList = () => ({
  title: 'payroll-per-installment-report',
  description:
    'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard',
  endpoint: 'payroll-employee-listing?statement',
  permission: 'report-payroll-employee-listing',
  isPayClosure: true,
  footer: 'total_values',
  columns: [
    { field: 'employee.uid', title: t('code'), ...InputFilter() },
    { field: 'employee.firstname', title: t('firstname') },
    { field: 'employee.lastname', title: t('lastname') },
    { field: 'employee.cin', title: t('cin') },
    {
      field: 'bank.label',
      title: t('bank'),
      ...SelectFilter({ filters: bankStore.banks.map(({ label }) => ({ label: label, value: label })) }),
    },
    { field: 'bank_statement', title: t('bank-statement') },
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
    await bankStore.fetchBanks({ list: true })
    await employeeTypeStore.fetchEmployeeTypes({ list: true })
    await payClosureStore.fetchPayClosures({ list: true })
  },
})

export default payrollBankStatementList
