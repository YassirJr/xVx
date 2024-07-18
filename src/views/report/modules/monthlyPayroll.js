import { t, dayjs } from '@/plugins'
import { DATE_FORMAT } from '@/constants'
import { InputFilter, SelectFilter } from '@/helpers'
import { usePayrollSectionStore } from '@/stores/payrollSection'
import { useEmployeeStore } from '@/stores/employee'
import { useMissionStore } from '@/stores/mission'

const payrollSectionStore = usePayrollSectionStore()
const employeeStore = useEmployeeStore()
const missionStore = useMissionStore()

const monthlyPayroll = () => ({
  title: 'monthly-payroll-report',
  description:
    'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard',
  endpoint: 'monthly-payroll',
  permission: 'report-payroll-monthly',
  columns: [
    { field: 'employee.uid', title: t('code'), ...InputFilter() },
    { field: 'employee.firstname', title: t('firstname'), ...InputFilter() },
    { field: 'employee.lastname', title: t('lastname'), ...InputFilter() },
    { field: 'employee.cin', title: t('cin'), ...InputFilter() },
    {
      field: 'employee.hiring_date',
      title: t('hiring-date'),
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
      ...InputFilter({ type: 'date' }),
    },
    { field: 'nbr_working_days', title: t('nbr-working-days') },
    { field: 'nbr_declared_days', title: t('nbr-declared-days') },
    {
      field: 'employee.family_status',
      title: t('family-status'),
      formatter: ({ cellValue }) => t(cellValue),
      ...SelectFilter({
        filters: employeeStore.familyStatus?.map(({ label }) => ({ label: t(label), value: label })),
      }),
    },
    { field: 'employee.nbr_children', title: t('number-of-children') },
    { field: 'employee.cnss_nbr', title: t('cnss-nbr'), ...InputFilter() },
    {
      field: 'employee.mission.label',
      title: t('mission'),
      ...SelectFilter({
        filters: missionStore.missions?.map(({ label }) => ({ label: label, value: label })),
      }),
    },

    ...payrollSectionStore.payrollSections
      .filter(({ payroll_slip, is_active }) => is_active && payroll_slip)
      .map(({ label }, i) => ({
        field: `payroll_data.${i}.total`,
        title: label,
      })),
  ],
  fetchData: async () => {
    await payrollSectionStore.fetch({ list: true })
    await missionStore.fetchAllMissions()
  },
})

export default monthlyPayroll
