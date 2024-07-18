import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper'
import packhouse from './packhouse'
import reception from './reception'
import transport from './transport'
import { ElNotification } from 'element-plus'
import { i18n } from '@/plugins'

const browserPrint = new ZebraBrowserPrintWrapper()

export const getAvailablePrinters = async () => await browserPrint.getAvailablePrinters()

export const setSelectedDevice = async (uid) => {
  const printers = await getAvailablePrinters()
  const printer = await printers?.find((el) => el.uid == uid)

  return new Promise((resolve) => {
    if (printer) {
      browserPrint.setPrinter(printer)
    }

    resolve()
  })
}

export const printLabel = async ({ docType, ...data }) => {
  const { isReadyToPrint, errors } = await browserPrint.checkPrinterStatus()

  if (isReadyToPrint) {
    const zpl = zebraDoc(docType)(data)

    browserPrint.print(zpl)
  } else {
    errorsNotification(Array.isArray(errors) ? errors : [errors])
  }
}

const errorsNotification = (errors) => {
  ElNotification.error({
    title: i18n.global.t('error'),
    message: errors
      ?.split(',')
      .map((e) => `- ${i18n.global.t(e.toLowerCase().replace(/ /g, '-').replace(/:/g, ''))}`)
      .join()
      .replace(',', '<br />'),
    dangerouslyUseHTMLString: true,
    position: 'bottom-right',
    showClose: true,
    duration: 3000,
  })
}

const zebraDoc = (type) => {
  switch (type) {
    case 'box-ticket':
      return packhouse.getBoxTicket
    case 'box-ticket-80_55':
      return packhouse.getBoxTicket80_55
    case 'box-ticket-90_61':
      return packhouse.getBoxTicket90_61
    case 'confection-ticket':
      return packhouse.getConfectionTicket
    case 'confection-receipt':
      return packhouse.getConfectionReceipt
    case 'pallet-ticket':
      return reception.getPalletTicket
    case 'transport-barcode':
      return transport.getTransportBarcode
    case 'confection-receipt-2':
      return packhouse.getConfectionReceipt_M2
    case 'confection-pallet':
      return packhouse.getGnConfectionPallet
    default:
      throw new Error(`${i18n.global.t('invalid-document-type')}: ${type}`)
  }
}
