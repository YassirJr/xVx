import JsBarcode from 'jsbarcode'
import store from '@/store'

const formats = store.getters['pointingTransporter/getBarcodePageFormats']

export function getEmployeeBarcode({ employee }, copies, format) {
  const { uid } = employee
  const img = document.createElement('img')
  JsBarcode(img, uid, { displayValue: false, margin: 0, format: 'CODE128B' })
  let employeeBarcode = ''
  let barcodeWrapper
  if (format == formats[0].value) {
    barcodeWrapper = `<div class="col-span-1 h-[25px] p-1">
    <img class="w-full h-[12px]" src="${img.src}" />
    <div class="text-center text-[4px]">${uid}</div>
    </div>`
  } else if (format == formats[1].value) {
    barcodeWrapper = `<div class="col-span-1 h-[21.3px] p-1 overflow-hidden">
    <img class="w-full h-[11px]" src="${img.src}" />
    <div class="text-center text-[4px]">${uid}</div>
    </div>`
  } else if (format == formats[2].value) {
    barcodeWrapper = `<div class="col-span-1 h-[15px] mt-[5px] p-[2px] overflow-hidden">
    <img class="w-full h-[7px]" src="${img.src}" />
    <div class="text-center text-[4px]">${uid}</div>
    </div>`
  }
  for (let i = 0; i < copies; i++) {
    employeeBarcode += barcodeWrapper
  }

  return employeeBarcode
}

export function getBarcodePageSetting(barcodes, format) {
  let element = ''
  let document
  if (format == formats[0].value) {
    element = `<div class="w-[210px] grid grid-cols-4 px-[10px]">${barcodes}</div>`
    document = { element, options: { margin: [11, 0, 11, 0] } }
  } else if (format == formats[1].value) {
    element = `<div class="w-[210px] grid grid-cols-5 px-[10px]">${barcodes}</div>`
    document = { element, options: { margin: [10, 0, 10, 0] } }
  } else if (format == formats[2].value) {
    element = `<div class="w-[71px] grid grid-cols-2 gap-x-[5px] px-[5px]">${barcodes}</div>`
    document = { element, init: { format: [71, 297] } }
  }

  return {
    element,
    document,
  }
}
