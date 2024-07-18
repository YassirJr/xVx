import { t } from '@/plugins'
import { SelectFilter, InputFilter } from '@/helpers'
import { useSiteStore } from '@/stores/site'
import { useVarietyStore } from '@/stores/variety'
import { useUnityStore } from '@/stores/unity'

const siteStore = useSiteStore()
const varietyStore = useVarietyStore()
const unityStore = useUnityStore()

const packhouseYield = () => ({
  title: 'packhouse-yield',
  description: 'Le Lorem Ipsum est implement du faux',
  endpoint: 'packhouse-yield',
  permission: 'report-packhouse-yield',
  columns: [
    {
      field: 'site.name',
      title: t('packhouse'),
      ...SelectFilter({
        filters: siteStore.getStationSites.map(({ name }) => ({ label: name, value: name })),
      }),
    },
    {
      field: 'lot_installment.pivot_pallets.pallet.site.name',
      title: t('farm'),
      formatter: ({ row }) => row.lot_installment.pivot_pallets[0]?.pallet.site.name,
      ...SelectFilter({ filters: siteStore.getSites }),
    },
    {
      field: 'lot_installment.pivot_pallets.pallet.cultivation.variety.name',
      title: t('variety'),
      formatter: ({ row }) => row.lot_installment.pivot_pallets[0]?.pallet.cultivation.variety.name,
      ...SelectFilter({ filters: varietyStore.getVarieties }),
    },
    {
      field: 'lot_installment.pivot_pallets.pallet.cultivation.variety_field.label',
      title: t('variety-field'),
      formatter: ({ row }) => row.lot_installment.pivot_pallets[0]?.pallet.cultivation.variety_field?.label,
      ...InputFilter(),
    },
    {
      field: 'lot_installment.pivot_pallets.pallet.cultivation.code',
      title: t('cultivation-code'),
      formatter: ({ row }) => row.lot_installment.pivot_pallets[0]?.pallet.cultivation.code,

      ...InputFilter(),
    },
    {
      field: 'lot_installment.pivot_pallets.pallet.unity.label',
      title: t('unity'),
      ...SelectFilter({ filters: unityStore.getUnities }),
      formatter: ({ row }) => row.lot_installment.pivot_pallets[0].pallet.unity.label,
    },
    { field: 'lot_installment.code', title: t('lot-installment'), ...InputFilter() },
    {
      title: t('confection'),
      children: [{ field: 'net_weight', title: t('net-weight'), width: 150, fixed: null }],
      headerAlign: 'center',
      fixed: null,
    },
    {
      title: t('reception'),
      children: [
        {
          field: 'lot_installment.pivot_pallets[0].nbr_boxes',
          title: t('nbr-boxes'),
          width: 150,
          fixed: null,
        },
        {
          field: 'lot_installment.pivot_pallets[0].net_weight',
          title: t('net-weight'),
          width: 150,
          fixed: null,
        },
        {
          field: 'avg_per_box',
          title: t('avg-per-box'),
          formatter: ({ row }) =>
            (
              row.lot_installment.pivot_pallets[0].net_weight / row.lot_installment.pivot_pallets[0].nbr_boxes
            ).toFixed(2),
          width: 150,
          fixed: null,
        },
      ],
      headerAlign: 'center',
      fixed: null,
    },
    {
      field: 'gap',
      title: t('gap'),
      formatter: ({ row }) => row.lot_installment.pivot_pallets[0].net_weight - row.net_weight,
    },
    {
      field: 'percent_gap',
      title: `${t('gap')} (${t('percent')})`,
      formatter: ({ row }) =>
        row.lot_installment.pivot_pallets[0].net_weight > 0
          ? (
              ((row.lot_installment.pivot_pallets[0].net_weight - row.net_weight) * 100) /
              row.lot_installment.pivot_pallets[0].net_weight
            ).toFixed(2)
          : 0,
    },
  ],
  fetchData: async () => {
    await siteStore.fetchAllSites()
    await varietyStore.fetchAllVarieties()
    await unityStore.fetchUnities({ list: true })
  },
})

export default packhouseYield
