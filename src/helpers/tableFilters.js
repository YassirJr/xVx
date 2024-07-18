import dayjs from '@/plugins/dayjs'
import { DATE_TIME_ZONE_FORMAT } from '@/constants/dateFormats'

export const InputFilter = ({
  type = '',
  className = 'h-12 p-2',
  clearable = false,
  payClosure = {},
  data = '',
} = {}) => {
  const filterRender = {
    name: '$input',
    props: {
      type,
      placeholder: null,
      className,
      clearable,
    },
  }
  if (type == 'date') {
    filterRender.props = {
      ...filterRender.props,
      labelFormat: 'dd-MM-yyyy',
      valueFormat: DATE_TIME_ZONE_FORMAT,
      disabledMethod:
        payClosure?.start_date && payClosure?.end_date
          ? ({ date }) => {
              let start_date = dayjs(payClosure.start_date)
              let end_date = dayjs(payClosure.end_date)

              return !dayjs(date).isBetween(start_date, end_date, 'day', '[]')
            }
          : undefined,
    }
  }

  return { filters: [{ data: data }], filterRender }
}

export const SelectFilter = ({
  className = 'h-12 p-2',
  clearable = false,
  multiple = false,
  options = [],
  filters = [{ data: '' }],
  filterMultiple = false,
} = {}) => {
  return {
    filters,
    filterMultiple,
    filterRender: !options.length || {
      name: '$select',
      props: {
        multiple,
        options,
        placeholder: null,
        className,
        clearable,
      },
    },
  }
}
