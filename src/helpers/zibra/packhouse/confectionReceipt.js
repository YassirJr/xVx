import { GAN_FRUITS_COMPANIES } from '@/constants'

export function getConfectionReceipt({ data }) {
  let zplString = ``

  data.forEach((element) => {
    zplString += singleBoxTicket(element)
  })

  return zplString
}

export function singleBoxTicket({ company, confection }) {
  const gnCompany = confection?.company ? GAN_FRUITS_COMPANIES[confection.company] : company

  return [...new Array(confection.nbr_boxes)].reduce((collect) => {
    return (
      collect +
      `
      ^XA
      ~TA000
      ~JSN
      ^LT0
      ^MNW
      ^MTD
      ^PON
      ^PMN
      ^LH0,0
      ^JMA
      ^PR6,6
      ~SD15
      ^JUS
      ^LRN
      ^CI27
      ^PA0,1,1,0
      ^XZ
      ^XA
      ^MMT
      ^PW496
      ^LL336
      ^LS0
      ^FT0,45^A0N,28,28^FB495,1,7,C^FH\\^CI28^FDSté ${gnCompany.label ?? gnCompany.name}^FS^CI27
      ^FT22,82^A0N,16,15^FH\\^FB400,2,0\\^CI28^FD${gnCompany.address.replaceAll('<br/>', ' ') ?? ''}^FS^CI27
      ^FT22,105^A0N,16,15^FH\\^CI28^FDEMAIL: ${gnCompany?.email ?? '---'} / TEL: ${
        gnCompany?.phone_nbr ?? '---'
      }^FS^CI27
      ^FT22,131^A0N,16,15^FH\\^CI28^FDLa Marque: ${confection?.final_product?.brand?.label ?? ''}^FS^CI27
      ^FT22,156^A0N,16,15^FH\\^CI28^FDProduit: ${
        confection?.lot_installment?.pallets[0]?.cultivation?.variety?.name ?? '---'
      } // Variété ${
        confection?.lot_installment?.pallets[0]?.cultivation?.variety_field?.label ?? '---'
      } // ${confection?.final_product?.product_category?.label ?? '---'}^FS^CI27
      ^FT22,182^A0N,16,15^FH\\^CI28^FDCoC: ${confection?.site.green_gold_license ?? '---'} // GGN: ${
        confection?.lot_installment?.pallets[0]?.site.global_gap_number ?? '---'
      }^FS^CI27
      ^FT22,208^A0N,16,15^FH\\^CI28^FDStation N°: 1557 Z // Exportateur N° ${
        gnCompany?.exporter_nbr ?? ''
      }^FS^CI27
      ^FT22,245^A0N,16,15^FH\\^FB400,2,0\\^CI28^FDLOT N°: ${
        confection?.lot_installment?.pallets[0]?.site?.code?.toString()?.padStart(2, '0') ?? ''
      } - ${confection?.day_index?.code ?? ''} - ${
        confection?.lot_installment?.code
      }A // Autorisation Saniitaire N°: MA FLC.60.36.14^FS^CI27
      ^FT0,282^A0N,28,28^FB496,1,7,C^FH\\^CI28^FDCalibre: ${
        confection?.final_product?.product_caliber?.label ?? ''
      }^FS^CI27
      ^FT0,308^A0N,20,20^FB496,1,5,C^FH\\^CI28^FDProduit du Maroc^FS^CI27
      ^FT0,309^A0N,14,15^FB67,1,4,C^FH\\^CI28^FD${''}^FS^CI27
      ^PQ3,0,1,Y
      ^XZ    
    `
    )
  }, '')
}
