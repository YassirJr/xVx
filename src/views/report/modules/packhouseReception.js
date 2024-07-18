import { InputFilter, SelectFilter } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { TIME_FORMAT, DATE_FORMAT } from '@/constants'
import { useReceptionStore } from '@/stores/reception'
import { useSiteStore } from '@/stores/site'
import { useVarietyStore } from '@/stores/variety'
import { usePalletTypeStore } from '@/stores/palletType'
import { useBoxTypeStore } from '@/stores/boxType'
import { useUnityStore } from '@/stores/unity'

const receptionStore = useReceptionStore()
const siteStore = useSiteStore()
const varietyStore = useVarietyStore()
const palletTypeStore = usePalletTypeStore()
const boxTypeStore = useBoxTypeStore()
const unityStore = useUnityStore()

const getReceptionStatus = ({ status }) => {
  return receptionStore.status.find(({ value }) => status == value)
}

const packhouseReception = () => ({
  title: 'receptions-report',
  description: 'Le Lorem Ipsum est faux la composition et la mise en page',
  endpoint: 'receptions',
  permission: 'report-reception-view',
  footer: 'total_values',
  columns: [
    { title: t('code'), field: 'pallet_id', ...InputFilter() },
    { title: t('delivery-code'), field: 'delivery_nbr', ...InputFilter() },
    {
      title: t('farm'),
      field: 'site.name',
      ...SelectFilter({ filters: siteStore.getSites }),
    },
    {
      title: t('variety'),
      field: 'cultivation.variety.name',
      ...SelectFilter({ filters: varietyStore.getVarieties }),
    },
    { title: t('cultivation'), field: 'cultivation.code', ...InputFilter({ type: 'number' }) },
    {
      title: t('unity'),
      field: 'unity.label',
      ...SelectFilter({ filters: unityStore.getUnities }),
    },
    {
      title: t('box-type'),
      field: 'box_type.label',
      ...SelectFilter({ filters: boxTypeStore.boxTypes.map(({ label }) => ({ label, value: label })) }),
    },
    {
      title: t('pallet-type'),
      field: 'pallet_type.label',
      ...SelectFilter({ filters: palletTypeStore.palletTypes.map(({ label }) => ({ label, value: label })) }),
    },
    {
      field: 'type',
      title: t('type'),
      formatter: ({ cellValue }) => {
        const type = Object.keys(receptionStore.type).find((key) => receptionStore.type[key] === cellValue)

        return type ? t(type) : null
      },
      ...SelectFilter({
        filters: Object.keys(receptionStore.type).map((key) => ({
          label: t(key),
          value: receptionStore.type[key],
        })),
      }),
    },
    { title: t('nbr-boxes'), field: 'nbr_boxes' },
    { title: t('gross-weight'), field: 'gross_weight' },
    { title: t('net-weight'), field: 'net_weight' },
    { title: t('average-case'), field: 'avg_per_box' },
    { title: t('reception-code'), field: 'reception.code', ...InputFilter({ type: 'number' }) },
    {
      title: t('depart-hour'),
      field: 'depart_hour',
      formatter: ({ cellValue }) => dayjs(cellValue).format(TIME_FORMAT),
    },
    {
      title: t('arrival-hour'),
      field: 'arrival_hour',
      formatter: ({ cellValue }) => dayjs(cellValue).format(TIME_FORMAT),
    },
    {
      title: t('station'),
      field: 'reception.site.name',
      ...SelectFilter({
        filters: siteStore.getStationSites.map(({ name }) => ({ label: name, value: name })),
      }),
    },
    { title: t('vehicle'), field: 'reception.vehicle.registration_nbr', ...InputFilter() },
    {
      title: t('status'),
      field: 'status',
      className: ({ row }) => (row.status >= 0 ? getReceptionStatus(row).class : null),
      formatter: ({ cellValue }) =>
        cellValue >= 0 ? t(getReceptionStatus({ status: cellValue }).label) : null,
      ...SelectFilter({
        filters: receptionStore.status.map(({ label, value }) => ({ label: t(label), value })),
      }),
    },
    {
      title: t('added-at'),
      field: 'added_at',
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
      filters: [{ data: '' }],
      ...InputFilter({ type: 'date', clearable: true }),
    },
  ],
  footerCondition: (field, { nbr_boxes, avg_per_box, net_weight, gross_weight }) => {
    switch (field) {
      case 'pallet_id':
        return t('total')
      case 'nbr_boxes':
        return +nbr_boxes
      case 'net_weight':
        return (+net_weight).toFixed(2)
      case 'gross_weight':
        return (+gross_weight)?.toFixed(2)
      case 'avg_per_box':
        return (+avg_per_box)?.toFixed(2)
      default:
        return ''
    }
  },
  fetchData: async () => {
    await siteStore.fetchAllSites()
    await varietyStore.fetchAllVarieties()
    await palletTypeStore.fetchPalletTypes({ list: true })
    await boxTypeStore.fetchBoxTypes({ list: true })
    await unityStore.fetchUnities({ list: true })
  },
})

export default packhouseReception
