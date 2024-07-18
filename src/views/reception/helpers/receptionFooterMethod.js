import { sum } from '@/helpers'
import { t } from '@/plugins'

export const receptionFooterMethod = ({ columns, data }) => {
  if (data.length > 1) {
    return [
      columns.map(({ field }) => {
        switch (field) {
          case 'delivery_nbr':
            return t('total')
          case 'pallet_type_id':
            return data.length
          case 'pallet_type.label':
            return data.length
          case 'nbr_boxes':
            return sum(data.map(({ nbr_boxes }) => nbr_boxes ?? 0))
          case 'gross_weight':
            return sum(data.map(({ gross_weight }) => gross_weight ?? 0)).toFixed(2)
          case 'net_weight':
            return sum(data.map(({ net_weight }) => net_weight ?? 0)).toFixed(2)
          case 'avg_per_box':
            return (
              sum(data.map(({ net_weight }) => net_weight ?? 0)) /
              sum(data.map(({ nbr_boxes }) => nbr_boxes ?? 0))
            ).toFixed(2)
          default:
            return ''
        }
      }),
    ]
  }
}
