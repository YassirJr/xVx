import { getBoxTicket } from './boxTicket'
import { getConfectionTicket } from './confectionTicket'
import { getBoxTicket90_61 } from './boxTicket90_61'
import { getBoxTicket80_55 } from './boxTicket80_55'
import { getConfectionReceipt } from './confectionReceipt'
import { getConfectionReceipt_M2 } from './confectionReceipt_M2'
import { getBoxTicket80_80 } from './boxTicket80_80'
import { getGnConfectionPallet } from './gnConfectionPallet'
import { getGnConfectionOrganicTicket } from './gnConfectionOrganicTicket'

export function getPackhouseHtmlDoc({ data, docType }) {
  let html = ``
  let options
  let init

  data.forEach((element, key, arr) => {
    let isLastEl = Object.is(arr.length - 1, key)

    const ticketFunctions = {
      'confection-ticket': getConfectionTicket,
      'box-ticket': getBoxTicket,
      'box-ticket-90_61': getBoxTicket90_61,
      'box-ticket-80_55': getBoxTicket80_55,
      'confection-receipt': getConfectionReceipt,
      'box-ticket-80_80': getBoxTicket80_80,
      'confection-pallet': getGnConfectionPallet,
      'confection-receipt-2': getConfectionReceipt_M2,
      'gn-confection-organic-ticket': getGnConfectionOrganicTicket,
    }

    html += ticketFunctions[docType](element, isLastEl)
  })

  switch (docType) {
    case 'confection-ticket':
      html = `<div class="pdf-font w-[446.46px]">${html}</div>`
      options = { margin: [7, 7, 7, 7] }
      init = { unit: 'px', format: [377.952756, 566.929134] }
      break
    case 'box-ticket':
      html = `<div class="pdf-font">${html}</div>`
      options = { margin: [0, 0, 0, 0] }
      init = { unit: 'px', format: [226.77165354, 264.56692913] }
      break
    case 'box-ticket-90_61':
      html = `<div class="pdf-font">${html}</div>`
      options = { margin: [0, 0, 0, 0] }
      init = { unit: 'px', format: [230.5511811, 340.15748031], orientation: 'landscape' }
      break
    case 'box-ticket-80_55':
      html = `<div class="pdf-font">${html}</div>`
      options = { margin: [0, 0, 0, 0] }
      init = { unit: 'px', format: [302.36220472, 207.87401575], orientation: 'landscape' }
      break
    case 'confection-receipt':
      html = `<div class="pdf-font">${html}</div>`
      options = { margin: [0, 0, 0, 0] }
      init = { unit: 'px', format: [226.77165354, 151.18110236], orientation: 'landscape' }
      break
    case 'gn-confection-organic-ticket':
      html = `<div class="pdf-font">${html}</div>`
      options = { margin: [0, 0, 0, 0] }
      init = { unit: 'px', format: [226.77165354, 151.18110236], orientation: 'landscape' }
      break
    case 'confection-receipt-2':
      html = `<div class="pdf-font">${html}</div>`
      options = { margin: [0, 0, 0, 0] }
      init = { unit: 'px', format: [226.77165354, 151.18110236], orientation: 'landscape' }
      break
    case 'box-ticket-80_80':
      html = `<div class="pdf-font">${html}</div>`
      options = { margin: [0, 0, 0, 0] }
      init = { unit: 'px', format: [302.36220472, 302.36220472], orientation: 'landscape' }
      break
    case 'confection-pallet':
      html = `<div class="pdf-font">${html}</div>`
      init = { unit: 'px', format: [378, 567] }
      break
    default:
      break
  }

  return {
    element: html,
    options,
    init,
    name: docType,
  }
}
