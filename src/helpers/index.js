import dialog from './dialog'
import dayjs from '@/plugins/dayjs'
import { getRandom } from './random'
import { InputFilter, SelectFilter } from './tableFilters'

// Logo
import logoCard from '@/assets/images/logoCard.webp'
import logoQFS from '@/assets/images/logoQFS.webp'
import logoPP from '@/assets/images/logoPP.webp'
import logoGF from '@/assets/images/logoGF.webp'

const useDialog = dialog

const groupBy = (items, key) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {},
  )

const sum = (items) => items.reduce((a = 0, b = 0) => a + b, 0)

const uniqueArray = (items) =>
  [...new Set(items.map((item) => item.map((el) => JSON.stringify(el))).flat())].map((el) => JSON.parse(el))

export const csvToArray = (data, columns = [], splitter = ',') => {
  const [keys, ...rest] = data
    .trim()
    .split('\n')
    .map((item) => item.split(splitter))

  return rest.map((item) => {
    const object = {}
    keys.forEach((key, index) => {
      let value = item.at(index)?.replace('\r', '')

      if (!isNaN(value)) {
        value = +value
      } else {
        value = value.replaceAll('"', '')
      }

      if (columns.length) {
        object[columns[index].field ?? columns[index].index] = value
      } else {
        object[key && key != '' ? key.trim() : index] = value
      }
    })
    return object
  })
}

export const toCapitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1)

export const timeToFloat = (date) => {
  const time = dayjs(date)
  const hours = time.hour()
  const minutes = time.minute()

  return (hours + minutes / 60).toFixed(2)
}

export const floatToTime = (num) => {
  const hour = dayjs.duration(num, 'hours').format('HH')
  const minutes = dayjs.duration(num, 'hours').format('mm')

  return `${hour}:${minutes}`
}

// Company Environment
export const isQFS = import.meta.env.VITE_APP_IS_QFS == `${true}`
export const isPurePassion = import.meta.env.VITE_APP_IS_PURE_PASSION == `${true}`
export const isGanFruits = import.meta.env.VITE_APP_IS_GAN_FRUITS == `${true}`

export const datetimeValueFormat = 'yyyy-MM-ddTHH:mm:ssZ'

export const dateLabelFormat = (uppercase = false) => {
  const format = 'dd-MM-yyyy'
  return uppercase ? format.toUpperCase() : format
}

export const labelDate = ({ start_date, end_date }) =>
  `${dayjs(start_date).format(dateLabelFormat(true))} > ${dayjs(end_date).format(dateLabelFormat(true))}`

export const dateToChunks = ({ start_date, end_date }) => {
  const startAt = dayjs(start_date)
  const endAt = dayjs(end_date)

  const firstMonday = startAt.startOf('week').day(1)
  const lastSunday = endAt.endOf('week').day(0)

  const result = []
  let weekStart = firstMonday

  while (weekStart.isBefore(lastSunday)) {
    const weekEnd = weekStart.endOf('week').day(0)

    result.push({
      start_date: dayjs.max(dayjs(weekStart), dayjs(startAt)).format(dateLabelFormat(true)),
      end_date: dayjs.min(dayjs(weekEnd), dayjs(endAt)).format(dateLabelFormat(true)),
    })

    weekStart = weekEnd.add(1, 'day')
  }

  return result
}

export const getExcelModelData = (columns, rowsNbr = 4) => {
  let rows = [...new Array(rowsNbr)].map(() =>
    columns.reduce((acc, { title, modelVal }) => {
      return {
        ...acc,
        [title]: typeof modelVal == 'object' ? getRandom(modelVal.type, modelVal.length) : modelVal,
      }
    }, {}),
  )

  let comments = columns.map((column, i) => ({ col: i, msg: column.comment })).filter(({ msg }) => msg)

  return {
    rows,
    comments,
  }
}

const useQuery = ({ page, filters, sorts, grouped }) => {
  const query = {
    page: page.currentPage,
    per_page: page.pageSize,
    filter: {},
  }

  query.sort = sorts.map((sort) => `${sort.order == 'desc' ? '-' : ''}${sort.field}`).join(',')

  filters.forEach((filter) => {
    const value = filter?.datas?.filter((el) => el != undefined)?.length
      ? filter.datas.join(',')
      : filter.values.join(',')
    query.filter[filter.property] = value
  })

  if (grouped) {
    query.grouped = true
  } else {
    delete query.grouped
  }

  return query
}

export const PhoneNumRegex = /^(0){1}(5|6|7|8){1}[-]([0-9]{2}){4}/g

export const phoneNumberFormat = (newVal, phoneNumber) => {
  if (newVal && newVal.length == 2) {
    phoneNumber = newVal + '-'
  }

  return phoneNumber
}

export const getCompanyLogo = () => {
  switch (true) {
    case isQFS:
      return logoQFS
    case isPurePassion:
      return logoPP
    case isGanFruits:
      return logoGF
    default:
      return logoCard
  }
}

export const resetInputsValue = (tableRef, index, items) => {
  items.forEach((item) => {
    const key = typeof item == 'object' && 'key' in item ? item.key : item
    const value = typeof item == 'object' && 'value' in item ? item.value : null

    tableRef.data[index][key] = value
  })
}

export const formDataHeaders = { headers: { 'Content-Type': 'multipart/form-data' } }

export const cloneObj = (obj) => JSON.parse(JSON.stringify(obj))

export const resetObj = (obj = {}, initObj = {}) => Object.assign(obj, { ...initObj })

export { groupBy, sum, uniqueArray, useDialog, useQuery, InputFilter, SelectFilter }
