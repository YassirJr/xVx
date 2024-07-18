import { getAbsenceCertificate } from './absenceCertificate'
import { getCharges } from './charges'
import { getInvoice } from './invoice'
import { getPackageList } from './packageList'
import { getPhytosanitaryCertificate } from './phytosanitaryCertificate'
import { getGnPackageList } from './gnPackageList'

export const getExpeditionHtmlDoc = ({ data, docType }) => {
  let html = `<div class="class="pdf-font">`
  let options
  let init

  data.forEach((element, index, array) => {
    let lastIndex = index === array.length - 1

    if (docType == 'absence-certificate') {
      html += getAbsenceCertificate(element)
    } else if (docType == 'invoice') {
      html += getInvoice(element)
    } else if (docType == 'phytosanitary-certificate') {
      html += getPhytosanitaryCertificate(element)
    } else if (docType == 'package-list') {
      html += getPackageList(element)
    } else if (docType == 'charges') {
      html += getCharges(element)
    } else if (docType == 'gn-package-list') {
      html += getGnPackageList(element, lastIndex)
    }
  })

  switch (docType) {
    case 'absence-certificate':
      options = { margin: 19.7087 }
      init = { unit: 'px' }
      break
    case 'invoice':
      options = { margin: 19.7087 }
      init = { unit: 'px' }
      break
    case 'phytosanitary-certificate':
      options = { margin: 19.9865 }
      init = { unit: 'px' }
      break
    case 'package-list':
      options = { margin: 19.7087 }
      init = { unit: 'px', orientation: 'landscape' }
      break
    case 'charges':
      options = { margin: 19.7087 }
      init = { unit: 'px' }
      break
    case 'gn-package-list':
      init = { unit: 'px' }
      break
    default:
      break
  }
  html += `</div>`

  return {
    element: html,
    options,
    init,
    name: docType,
  }
}
