import { DATE_FORMAT } from '@/constants'
import { InputFilter, SelectFilter } from '@/helpers'
import { dayjs, t } from '@/plugins'

import { useCultivationStore } from '@/stores/cultivation'
import { useSiteStore } from '@/stores/site'
import { useVarietyStore } from '@/stores/variety'
import { useTaskStore } from '@/stores/task'
import { useStadeStore } from '@/stores/stade'

const siteStore = useSiteStore()
const varietyStore = useVarietyStore()
const taskStore = useTaskStore()
const stadeStore = useStadeStore()
const cultivationStore = useCultivationStore()

const pointingTasks = () => ({
  title: 'pointing-tasks-report',
  description:
    'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard',
  endpoint: 'pointing-task',
  permission: 'report-pointing-task',
  footer: 'pointing_task_total',
  columns: [
    {
      field: 'day',
      title: t('added-at'),
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
      ...InputFilter({ type: 'date' }),
    },
    {
      field: 'site.name',
      title: t('site'),
      ...SelectFilter({ filters: siteStore.getSites }),
    },
    {
      field: 'cultivation.variety.name',
      title: t('variety'),
      ...SelectFilter({
        filters: varietyStore.getVarieties,
      }),
    },
    {
      field: 'task.stade.name',
      title: t('task-stade'),
      ...SelectFilter({
        filters: stadeStore.stades?.map((el) => ({ label: el.name, value: el.name })) ?? [],
      }),
    },
    {
      field: 'task.name',
      title: t('task'),
      ...SelectFilter({
        filters: taskStore.tasks?.map((el) => ({ label: el.name, value: el.name })) ?? [],
      }),
    },
    { field: 'cultivation.parcel.name', title: t('parcel') },
    { field: 'cultivation.code', title: t('cultivation-code'), ...InputFilter({ type: 'number' }) },
    { field: 'nbr_total', title: t('number'), formatter: ({ cellValue }) => (+cellValue).toFixed(2) },
    { field: 'total_cost', title: t('total-cost'), formatter: ({ cellValue }) => (+cellValue).toFixed(2) },
    {
      field: 'cultivation.season',
      title: t('cultivation-season'),
      visible: false,
      ...InputFilter({ type: 'number' }),
    },
    {
      field: 'cultivation.available_surface',
      title: t('cultivation-surface'),
      visible: false,
      ...InputFilter({ type: 'number' }),
    },
    {
      field: 'cultivation.arrached_surface',
      title: t('arrached-surface'),
      visible: false,
      ...InputFilter({ type: 'number' }),
    },
    {
      field: 'cultivation.sowing_date',
      title: t('cultivation-sowing-date'),
      visible: false,
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
      ...InputFilter({ type: 'date' }),
    },
    {
      field: 'cultivation.uprooting_date',
      title: t('cultivation-uprooting-date'),
      visible: false,
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
      ...InputFilter({ type: 'date' }),
    },
    {
      field: 'cultivation.status',
      title: t('cultivation-status'),
      visible: false,
      formatter: ({ cellValue }) => (cellValue ? t(cellValue) : null),
      className: ({ row }) =>
        cultivationStore.statusList.find(({ label }) => label == row.cultivation?.status)?.class,
      ...SelectFilter({
        filters: cultivationStore.statusList.map((el) => ({ label: t(el.label), value: el.label })),
      }),
    },

    {
      field: 'hour_unit',
      title: t('hour') + '/' + t('unit'),
      visible: false,
      formatter: (row) => (row.unity == null ? t('hour') : t('unit')),
    },

    {
      field: 'bonus_total',
      title: t('hours-bonus'),
      visible: false,
      formatter: ({ cellValue }) => (+cellValue).toFixed(2),
    },
  ],
  footerCondition: (field, { nbr_total, bonus_total, total_cost }) => {
    switch (field) {
      case 'date':
        return t('total')
      case 'nbr_total':
        return (+nbr_total).toFixed(2)
      case 'bonus_total':
        return (+bonus_total).toFixed(2)
      case 'total_cost':
        return (+total_cost)?.toFixed(2)
      default:
        return ''
    }
  },
  fetchData: async () => {
    await siteStore.fetchAllSites()
    await varietyStore.fetchAllVarieties()
    await taskStore.fetchAllTasks()
    await stadeStore.fetchAllStades()
  },
})

export default pointingTasks
