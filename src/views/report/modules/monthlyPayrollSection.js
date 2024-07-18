import { t } from '@/plugins'
import { useEmployeeTypeStore } from '@/stores/employeeTypes'
import { usePayClosureStore } from '@/stores/payClosure'

const employeeTypeStore = useEmployeeTypeStore()
const payClosureStore = usePayClosureStore()

const monthlyPayrollSection = () => ({
  title: 'payroll-sections-report',
  description:
    'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard',
  endpoint: 'payroll-sections',
  permission: 'report-payroll-sections',
  isPayClosure: true,
  pagerConfig: {
    pageSize: -1,
    pageSizes: [{ label: t('all'), value: -1 }],
  },
  columns: [
    { field: 'label', title: t('section') },
    { field: 'total', title: t('total') },
  ],
  fetchData: async () => {
    await employeeTypeStore.fetchEmployeeTypes({ list: true })
    await payClosureStore.fetchPayClosures({ list: true })
  },
})

export default monthlyPayrollSection
