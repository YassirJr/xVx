import { getPalletTicket } from './palletTicket'
import { getReceptionReceipt } from './receptionReceipt'
import { getGnReceptionReceipt } from './gnReceptionRecipt'
import { getGnDeliveryReceipt } from './gnDeliveryRecipt'
import { isGanFruits } from '@/helpers'

export function getReceptionHtmlDoc({ data, docType }) {
  let html = ``
  let init

  if (docType == 'pallet-ticket') {
    html = getPalletTicket(data)
  } else if (docType == 'reception-receipt') {
    data.forEach((element, index, array) => {
      let lastIndex = index === array.length - 1
      html += isGanFruits
        ? getGnReceptionReceipt(element, lastIndex)
        : getReceptionReceipt(element, lastIndex)
    })
  } else if (docType == 'gn-reception-dilivery-receipt') {
    html = getGnDeliveryReceipt(data)
  }

  switch (docType) {
    case 'pallet-ticket':
      html = `<div class="pdf-font">${html}</div>`
      init = { unit: 'px', format: [378, 567] }
      break
    case 'reception-receipt':
      html = `<div class="pdf-font">${html}</div>`
      init = { unit: 'px', format: [420, 298] }
      break
    case 'gn-reception-dilivery-receipt':
      html = `<div class="pdf-font">${html}</div>`
      init = { unit: 'px', format: [420, 298] }
      break
    default:
      break
  }

  return {
    element: html,
    options: { margin: [0, 0, 0, 0] },
    init,
    name: docType,
  }
}
