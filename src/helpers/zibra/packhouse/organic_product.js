import { GAN_FRUITS_COMPANIES } from '@/constants'

export function getOrganicProductTicket({ data }) {
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
    ^MMT
    ^PW496
    ^LL0336
    ^LS0
    ^FO384,0^GFA,00768,00768,00012,:Z64:
    eJxjYBgFZAMFJgYGJgiTsYSdwYEdKl7BxJAAUxPAyFgAZTYgdLJeQDLmAYLJGAAikCSZ4ZpYGBgdMFwgwCAKZ+9AEq9hBRJQ5Rxgp0LVg8zH5h4kvRwI5QwBLAwMtRAmUwMHQ4MGhM3uEM94gAXC5gNCmA/kGUQZBZCMQThzsAIAnPQOrQ==:773D
    ^FT113,45^A0N,28,28^FB191,1,0,C^FH\\^FDOrganic product^FS
    ^FT21,76^A0N,14,16^FH\\^FDProduit: ${
      confection?.lot_installment?.pallets[0]?.cultivation?.variety?.name ?? '---'
    }^FS
    ^FT21,98^A0N,14,16^FH\\^FDVariety: ${
      confection?.lot_installment?.pallets[0]?.cultivation?.variety_field?.label ?? '---'
    }^FS
    ^FT21,121^A0N,14,16^FH\\^FDOrigin: Morocco^FS
    ^FT21,143^A0N,14,16^FH\\^FDCategory: ${confection?.final_product?.product_category?.label ?? '---'}^FS
    ^FT21,166^A0N,14,16^FH\\^FDSize: ${confection?.final_product?.product_caliber?.label ?? '---'}^FS
    ^FT21,189^A0N,14,16^FH\\^FDApprox weight: ${confection?.final_product?.net_weight} ${
      confection?.final_product?.unity_measure
    }^FS
    ^FT366,78^A0N,10,9^FB108,1,0,C^FH\\^FDcontrolled and certified by^FS
    ^FT366,90^A0N,10,9^FB108,1,0,C^FH\\^FDCCPA Maroc MA-102-bio^FS
    ^FT366,102^A0N,10,9^FB108,1,0,C^FH\\^FDAgreculture of Morocco^FS
    ^FT374,132^A0N,13,12^FH\\^FDExporter N\\F8 ${gnCompany?.exporter_nbr ?? '---'}^FS
    ^FT374,148^A0N,13,12^FH\\^FDPackhouse N\\F8 15572^FS
    ^FT21,215^A0N,14,14^FH\\^FDProduct tracking: ^FS
    ^FT222,215^A0N,14,14^FH\\^FDBatch N\\F80${confection?.lot_installment?.pallets[0]?.site?.id ?? '---'} - ${
      confection?.day_index?.code ?? '---'
    } - ${confection?.lot_installment?.code ?? '---'}  COC ${
      confection?.lot_installment?.pallets[0]?.site.green_gold_license ?? '---'
    }^FS
    ^FT21,239^A0N,14,14^FH\\^FDGGN: ${
      confection?.lot_installment?.pallets[0]?.site.global_gap_number ?? '---'
    }^FS
    ^FT221,239^A0N,14,14^FH\\^FDAutorisation sanitaire: N\\F8: MA FLC.60.36.14^FS
    ^FT21,259^A0N,14,14^FH\\^FDImported by:^FS
    ^FT21,282^A0N,14,14^FH\\^FDExported by: Sté ${gnCompany.label ?? gnCompany.name}^FS
    ^FT21,311^A0N,13,12^FH\\^FB400,2,0^FD${gnCompany.address.replaceAll('<br/>', ' ') ?? '---'}^FS
    ^PQ1,0,1,Y^XZ`
    )
  }, '')
}
