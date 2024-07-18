import { t, dayjs } from '@/plugins'
import { SelectFilter, InputFilter } from '@/helpers'
import { DATE_FORMAT } from '@/constants'
import { useConfectionStore } from '@/stores/confection'
import { useProductStore } from '@/stores/product'
import { useSiteStore } from '@/stores/site'
import { useVarietyStore } from '@/stores/variety'
import { useVarietyFieldStore } from '@/stores/varietyField'
import { useUnityStore } from '@/stores/unity'

const confectionStore = useConfectionStore()
const productStore = useProductStore()
const siteStore = useSiteStore()
const varietyStore = useVarietyStore()
const varietyFieldStore = useVarietyFieldStore()
const unityStore = useUnityStore()

const confection = () => ({
  title: 'confections-report',
  description:
    'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard',
  endpoint: 'confections',
  permission: 'report-confection-view',
  footer: 'total_values',
  columns: [
    {
      title: t('added-at'),
      field: 'added_at',
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
      filters: [{ data: '' }],
      ...InputFilter({ type: 'date', clearable: true }),
    },
    {
      title: t('index-date'),
      field: 'day_index.code',
      ...InputFilter({ type: 'number' }),
    },
    {
      title: t('packhouse'),
      field: 'site.name',
      ...SelectFilter({
        filters: siteStore.getStationSites.map(({ name }) => ({ label: name, value: name })) ?? [],
      }),
    },
    {
      title: t('pallet-code'),
      field: 'pallet_code',
      ...InputFilter({ type: 'number' }),
    },
    {
      title: t('farm'),
      field: 'lot_installment.pallets.site.name',
      formatter: ({ row }) => row.lot_installment.pallets[0]?.site?.name,
      ...SelectFilter({ filters: siteStore.getSites }),
    },
    {
      title: t('variety'),
      field: 'lot_installment.pallets.cultivation.variety.name',
      formatter: ({ row }) => row.lot_installment.pallets[0]?.cultivation?.variety?.name,
      ...SelectFilter({ filters: varietyStore.getVarieties }),
    },
    {
      title: t('variety-field'),
      field: 'lot_installment.pallets.cultivation.variety_field.label',
      formatter: ({ row }) => row.lot_installment.pallets[0]?.cultivation?.variety_field?.label,
      ...SelectFilter({
        filters: varietyFieldStore.varietyFields.map(({ label }) => ({ label: label, value: label })) ?? [],
      }),
    },
    {
      title: t('unity'),
      field: 'lot_installment.pallets.unity.label',
      formatter: ({ row }) => row.lot_installment.pallets[0]?.unity?.label,
      ...SelectFilter({ filters: unityStore.getUnities }),
    },
    {
      title: t('drilling-code'),
      field: 'lot_installment.pallets.cultivation.code',
      formatter: ({ row }) => row.lot_installment.pallets[0]?.cultivation.code,
      ...InputFilter(),
    },
    {
      field: 'lot_installment.code',
      title: t('lot-installment-nbr'),
      ...InputFilter(),
    },
    {
      title: t('product'),
      field: 'final_product.name',
      ...SelectFilter({ filters: productStore.getProducts }),
    },
    {
      title: t('brand'),
      field: 'final_product.brand.label',
      ...InputFilter(),
    },
    { title: t('category'), field: 'final_product.product_category.label' },
    {
      title: t('product-caliber'),
      field: 'final_product.product_caliber.label',
      ...InputFilter(),
    },
    {
      title: t('nature'),
      field: 'final_product.destination',
      formatter: ({ cellValue }) =>
        t(productStore.destinations.find(({ value }) => value == cellValue).label),
      ...SelectFilter({
        filters: productStore.destinations.map(({ label, value }) => ({ label: t(label), value: value })),
      }),
    },
    { title: t('unity-measure'), field: 'final_product.unity_measure' },
    { title: t('nbr-boxes'), field: 'nbr_boxes' },
    { title: t('number-of-unities'), field: 'nbr_unities' },
    { title: t('weight-per-package'), field: 'final_product.net_weight' },
    { title: t('total-gross'), field: 'gross_weight' },
    { title: t('total-net'), field: 'net_weight' },
    {
      title: t('status'),
      field: 'status',
      formatter: ({ cellValue }) =>
        t(confectionStore.statusOptions.find(({ value }) => value == cellValue).label),
      className: ({ row }) => confectionStore.statusOptions.find(({ value }) => value == row.status).class,
      ...SelectFilter({
        filters: confectionStore.statusOptions.map(({ label, value }) => ({ label: t(label), value: value })),
      }),
    },
  ],
  footerCondition: (field, { nbr_boxes, nbr_unities, gross_weight, net_weight, pallet_code }) => {
    switch (field) {
      case 'added_at':
        return t('total')
      case 'nbr_boxes':
        return +nbr_boxes
      case 'nbr_unities':
        return +nbr_unities
      case 'gross_weight':
        return (+gross_weight)?.toFixed(2)
      case 'net_weight':
        return (+net_weight)?.toFixed(2)
      case 'pallet_code':
        return +pallet_code
      default:
        return ''
    }
  },
  fetchData: async () => {
    await siteStore.fetchAllSites()
    await varietyStore.fetchAllVarieties()
    await varietyFieldStore.fetch({ list: true })
    await productStore.fetch({ list: true })
    await unityStore.fetchUnities({ list: true })
  },
})

export default confection
