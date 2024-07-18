import { t, dayjs } from '@/plugins'
import { InputFilter, SelectFilter } from '@/helpers'
import { DATE_FORMAT } from '@/constants'
import { useSiteStore } from '@/stores/site'
import { useProductStore } from '@/stores/product'
import { useClientStore } from '@/stores/client'

const siteStore = useSiteStore()
const productStore = useProductStore()
const clientStore = useClientStore()

const salesOrder = () => ({
  title: 'sales-order-report',
  description:
    'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard',
  endpoint: 'sales-order',
  permission: 'report-sales-order-view',
  footer: 'total_values',
  columns: [
    {
      field: 'sales_order.added_at',
      title: t('date'),
      formatter: ({ cellValue }) => dayjs(cellValue).format(DATE_FORMAT),
      ...InputFilter({ type: 'date' }),
    },
    {
      field: 'sales_order.invoice_nbr',
      title: t('invoice-nbr'),
      ...InputFilter(),
    },
    {
      field: 'sales_order.client.is_international',
      title: t('nature'),
      formatter: ({ cellValue }) => t(cellValue ? 'international' : 'local-market'),
      ...SelectFilter({
        filters: clientStore.marketTypes.map(({ label, value }) => ({ label: t(label), value })),
      }),
    },
    {
      field: 'sales_order.site.name',
      title: t('station'),
      ...SelectFilter({
        filters: siteStore.getStationSites.map(({ name }) => ({ label: name, value: name })),
      }),
    },
    {
      field: 'expedition-bl',
      title: t('expedition/BL'),
      formatter: ({ row }) => row?.sales_order?.delivery_nbr ?? row?.sales_order?.expedition.code,
      ...InputFilter(),
    },
    {
      field: 'sales_order.client.name',
      title: t('client'),
      ...InputFilter(),
    },
    {
      field: 'final_product.name',
      title: t('product'),
      ...SelectFilter({ filters: productStore.getProducts }),
    },
    {
      field: 'net_weight',
      title: t('net-weight'),
    },
    {
      field: 'gross_weight',
      title: t('gross-weight'),
    },
    { field: 'pallet_nbr', title: t('pallet-nbr') },
    {
      field: 'quantity',
      title: t('quantity'),
    },
    {
      field: 'unit_price',
      title: t('unit-price'),
    },
    {
      field: 'total',
      title: t('amount'),
    },
  ],
  footerCondition: (field, { gross_weight, net_weight, pallet_nbr, quantity, total, unit_price }) => {
    switch (field) {
      case 'sales_order.added_at':
        return t('total')
      case 'quantity':
        return +quantity
      case 'net_weight':
        return (+net_weight).toFixed(2)
      case 'pallet_nbr':
        return +pallet_nbr
      case 'gross_weight':
        return (+gross_weight)?.toFixed(2)
      case 'unit_price':
        return (+unit_price)?.toFixed(2)
      case 'total':
        return (+total)?.toFixed(2)
      default:
        return ''
    }
  },
  fetchData: async () => {
    await productStore.fetch({ list: true })
    await siteStore.fetchAllSites()
  },
})

export default salesOrder
