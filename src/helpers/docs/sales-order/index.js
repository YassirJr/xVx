import { getInvoice } from './invoice'
import { getGnInvoice } from './gnInvoice'
import { getGnSalesPackageList } from './gnSalesPackageList'

export const getSaleHtmlDoc = (data) => {
  let { orientation, sales, docType, company } = data
  let element = ``
  let options
  let init

  if (docType == 'sales-order-invoice') {
    element += getInvoice(sales[0], company)
    if (orientation === 'portrait') {
      element = `<div class="w-[446.46px] h-[631px] text-[8px] flex justify-center">${element}</div>`
    } else if (orientation === 'landscape') {
      element = `<div class="col-span-1 h-[446px]">${element}</div>`
    } else if (orientation === 'landscape-duplicated') {
      element = `<div class="h-[446px] w-[631.4175px] text-[7px] grid grid-cols-2">
        <div class="col-span-1 h-[446px]">${element}</div>
        <div class="col-span-1 h-[446px]">${element}</div></div>`
    }
  } else if (docType == 'gn-invoice') {
    element += getGnInvoice(sales ? sales[0] : data.data[0])
    element = `<div class="w-[446.46px] h-[630px] text-[8px] flex justify-center">${element}</div>`
  } else if (docType == 'gn-sales-package-list') {
    element += getGnSalesPackageList(data.data[0], company)
    element = `<div>${element}</div>`
  }

  switch (docType) {
    case 'sales-order-invoice':
      init = { unit: 'px' }
      break
    case 'gn-invoice':
      init = { unit: 'px' }
      break
    case 'gn-sales-package-list':
      init = { unit: 'px' }
      break
    default:
      break
  }

  return {
    element,
    options,
    init,
    name: docType,
    data,
  }
}
