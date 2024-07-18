import { getTransportBarcode, getBarcodePageSetting } from './transportBarcode'
import { getVehicleTicket } from './vehicleTicket'

export function getTransportHtmlDoc({ data, format, docType, roadImg }) {
  let html = ``
  let document

  data.forEach((element, index, array) => {
    let lastRow = index === array.length - 1 || index === array.length - 2
    if (docType == 'transport-barcode') {
      element.forEach((employee) => {
        html += getTransportBarcode(employee, format)
      })
    }
    if (docType == 'vehicle-ticket') {
      html += getVehicleTicket(element, roadImg, lastRow)
    }
  })

  switch (docType) {
    case 'transport-barcode':
      document = getBarcodePageSetting(html, format)
      break
    case 'vehicle-ticket':
      html = `<div class="w-[446.46px] m-auto grid grid-cols-2 gap-x-[50px] px-4 pdf-font">${html}</div>`
      document = { element: html, options: { margin: [26.4175, 0, 25, 0] }, init: { unit: 'px' } }
      break
    default:
      break
  }
  return { ...document, name: docType }
}
