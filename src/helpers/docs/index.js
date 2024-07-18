import { i18n } from '@/plugins'
import { jsPDF } from 'jspdf'

import store from '@/store'
import { getEmployeeHtmlDoc } from './employee'
import { getReceptionHtmlDoc } from './reception'
import { getTransportHtmlDoc } from './transport'
import { getPackhouseHtmlDoc } from './confection'
import { getExpeditionHtmlDoc } from './expedition'
import { getSaleHtmlDoc } from './sales-order'

const employeeDocs = [...store.getters['employee/getEmployeeDocs'], 'payroll-check', 'payroll-senegal']
const receptionDocs = ['pallet-ticket', 'reception-receipt', 'gn-reception-dilivery-receipt']
const confectionDocs = [
  'confection-ticket',
  'box-ticket',
  'box-ticket-90_61',
  'box-ticket-80_55',
  'confection-receipt',
  'confection-receipt-2',
  'box-ticket-80_80',
  'confection-pallet',
  'gn-confection-organic-ticket',
]
const transportDocs = ['transport-barcode', 'vehicle-ticket']
const salesOrdersDocs = ['sales-order-invoice', 'gn-invoice', 'gn-sales-package-list']
const expeditionDocs = [
  'absence-certificate',
  'phytosanitary-certificate',
  'package-list',
  'invoice',
  'charges',
  'gn-package-list',
]

function getHtmlDoc(data) {
  if (employeeDocs.includes(data.docType)) {
    return getEmployeeHtmlDoc(data)
  } else if (receptionDocs.includes(data.docType)) {
    return getReceptionHtmlDoc(data)
  } else if (transportDocs.includes(data.docType)) {
    return getTransportHtmlDoc(data)
  } else if (confectionDocs.includes(data.docType)) {
    return getPackhouseHtmlDoc(data)
  } else if (expeditionDocs.includes(data.docType)) {
    return getExpeditionHtmlDoc(data)
  } else if (salesOrdersDocs.includes(data.docType)) {
    return getSaleHtmlDoc(data)
  }
}

export function downloadDocs(data) {
  let style = document.createElement('style')
  let jsPdfDoc = getHtmlDoc(data)
  let doc = new jsPDF({ ...jsPdfDoc?.init, compress: true })

  return new Promise((resolve) => {
    doc
      .html(jsPdfDoc.element, {
        ...jsPdfDoc?.options,
        html2canvas: {
          onclone: function () {
            style.innerHTML = `img { display: inline-block; }`
            document.head.appendChild(style)
          },
        },
      })
      .then(() => doc.save(`${i18n.global.t(jsPdfDoc.name)}.pdf`))
      .finally(() => {
        style.remove()
        resolve()
      })
  })
}
