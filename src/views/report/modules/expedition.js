import { InputFilter, SelectFilter } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { DATE_FORMAT } from '@/constants'
import { useExpeditionStore } from '@/stores/expedition'
import { useSiteStore } from '@/stores/site'
import { useProductStore } from '@/stores/product'
import { useProductCategoryStore } from '@/stores/productCategory'
import { useProductCaliberStore } from '@/stores/productCaliber'
import { useVarietyStore } from '@/stores/variety'
import { useBrandStore } from '@/stores/brand'

const expeditionStore = useExpeditionStore()
const siteStore = useSiteStore()
const productStore = useProductStore()
const productCategoryStore = useProductCategoryStore()
const productCaliberStore = useProductCaliberStore()
const varietyStore = useVarietyStore()
const brandStore = useBrandStore()

const expedition = () => ({
  title: 'expeditions-report',
  description:
    'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard',
  endpoint: 'expeditions',
  permission: 'report-expedition-view',
  footer: 'total_values',
  columns: [
    { title: t('expedition-code'), field: 'expedition.code', ...InputFilter() },
    {
      title: t('date'),
      field: 'expedition.added_at',
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
      ...InputFilter({ type: 'date' }),
    },
    {
      title: t('packhouse'),
      field: 'confection.site.name',
      ...SelectFilter({
        filters: siteStore.getStationSites.map(({ name }) => ({ label: name, value: name })) ?? [],
      }),
    },
    { title: t('vehicle'), field: 'expedition.vehicle.registration_nbr', ...InputFilter() },
    { title: t('nbr-pallets'), field: 'expedition.nbr_pallets' },
    { title: t('total-gross'), field: 'expedition.gross_weight' },
    { title: t('total-net'), field: 'expedition.net_weight' },
    { title: t('client'), field: 'expedition.client.name', ...InputFilter() },
    {
      title: t('status'),
      field: 'is_shipped',
      formatter: ({ cellValue }) => t(expeditionStore.status.find(({ value }) => value == cellValue).label),
      className: ({ row }) => expeditionStore.status.find(({ value }) => value == row.is_shipped).class,
      ...SelectFilter({
        filters: expeditionStore.status.map(({ label, value }) => ({ label: t(label), value: value })),
      }),
    },
    { title: t('pallet-code'), field: 'confection.pallet_code', ...InputFilter({ type: 'number' }) },
    { title: t('index-date'), field: 'confection.day_index.code', ...InputFilter({ type: 'number' }) },
    {
      title: t('lot-installments'),
      field: 'confection.lot_installment.code',
      ...InputFilter({ type: 'number' }),
    },
    {
      title: t('drilling-code'),
      field: 'confection.lot_installment.pallets.cultivation.code',
      formatter: ({ row }) => row.confection.lot_installment.pallets[0]?.cultivation.code,
      ...InputFilter(),
    },
    {
      title: t('product'),
      field: 'confection.final_product.name',
      ...SelectFilter({ filters: productStore.getProducts }),
    },
    {
      title: t('category'),
      field: 'confection.final_product.product_category.label',
      ...SelectFilter({ filters: productCategoryStore.getProductCategories }),
    },
    {
      title: t('product-caliber'),
      field: 'confection.final_product.product_caliber.label',
      ...SelectFilter({ filters: productCaliberStore.getProductCalibers }),
    },
    {
      title: t('variety'),
      field: 'confection.final_product.variety.name',
      ...SelectFilter({ filters: varietyStore.getVarieties }),
    },
    {
      title: t('brand'),
      field: 'confection.final_product.brand.label',
      ...SelectFilter({ filters: brandStore.getBrands }),
    },
    {
      title: t('unity-measure'),
      field: 'confection.final_product.unity_measure',
      formatter: ({ cellValue }) => (cellValue ? t(cellValue) : ''),
      ...SelectFilter({
        filters: productStore.measureUnits.map(({ label, value }) => ({ label: t(label), value })),
      }),
    },
    { title: t('nbr-boxes'), field: 'confection.nbr_boxes' },
    { title: t('nbr-unit'), field: 'confection.nbr_unities' },
    { title: t('weight-per-package'), field: 'confection.final_product.net_weight' },
    { title: t('net-weight'), field: 'confection.net_weight' },
    { title: t('gross-weight'), field: 'confection.gross_weight' },
    { title: t('temperature'), field: 'temperature' },
  ],
  footerCondition: (
    field,
    {
      nbr_boxes,
      nbr_unities,
      final_product_net_weight,
      gross_weight,
      net_weight,
      expedition_gross_weight,
      expedition_net_weight,
      nbr_pallets,
    },
  ) => {
    switch (field) {
      case 'expedition.code':
        return t('total')
      case 'expedition.gross_weight':
        return expedition_gross_weight
      case 'expedition.net_weight':
        return expedition_net_weight
      case 'expedition.nbr_pallets':
        return nbr_pallets
      case 'confection.nbr_boxes':
        return nbr_boxes
      case 'confection.nbr_unities':
        return nbr_unities
      case 'confection.final_product.net_weight':
        return final_product_net_weight
      case 'confection.gross_weight':
        return gross_weight
      case 'confection.net_weight':
        return net_weight
      default:
        return ''
    }
  },
  fetchData: async () => {
    await siteStore.fetchAllSites()
    await productStore.fetch({ list: true })
    await productCategoryStore.fetchProductCategories({ list: true })
    await productCaliberStore.fetchProductCalibers({ list: true })
    await varietyStore.fetchAllVarieties()
    await brandStore.fetchBrands({ list: true })
  },
})

export default expedition
