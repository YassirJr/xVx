import { GAN_FRUITS_COMPANIES } from '@/constants'

export function getGnConfectionPallet({ data }) {
  const { confection, company } = data[0]
  const gnCompany = confection?.company ? GAN_FRUITS_COMPANIES[confection.company] : company

  return `
      ^XA
      ^MMT
      ^PW799
      ^LL1199
      ^LS0
      ^FO20,20^GB759,1159,4^FS
      ^FT20,190^A0N,76,74^FB799,2,0,C^FH\\^FD${gnCompany.label ?? gnCompany.name}^FS
      ^BY4,3,96^FT105,1075^BCN,,N,N
      ^FD${confection.pallet_code}^FS
      ^FH\\^FD^FS
      ^FT105,1140^A0N,50,50^FH\\^FD${confection.pallet_code}^FS
      ^FT105,948^A0N,44,45^FH\\^FDCalibre : ${confection?.final_product?.product_caliber?.label}^FS
      ^FT105,288^A0N,49,62^FH\\^FDExportateur N\\F8 : ${gnCompany?.exporter_nbr ?? ''}^FS
      ^FT105,355^A0N,49,62^FH\\^FDStation N\\F8 : 1557 Z^FS
      ^FT105,423^A0N,49,62^FH\\^FDProduit : ${
        confection?.lot_installment?.pallets[0]?.cultivation?.variety?.name ?? '---'
      }^FS
      ^FT105,490^A0N,49,62^FH\\^FDVari\\82t\\82 : ${
        confection?.lot_installment?.pallets[0]?.cultivation?.variety_field?.label ?? '---'
      }^FS
      ^FT105,558^A0N,49,62^FH\\^FDNombre Colis : ${confection.nbr_boxes}^FS
      ^FT105,626^A0N,49,62^FH\\^FDPoids Brut : ${confection.gross_weight} KG^FS
      ^FT105,693^A0N,49,62^FH\\^FDPoids Net : ${confection.net_weight} KG^FS
      ^FT105,761^A0N,49,62^FH\\^FDN\\F8 Palette : ${confection.pallet_code}^FS
      ^FT105,870^A0N,49,62^FH\\^FB674,2,0^FDN\\F8 LOT : ${confection?.tracking_nbr}^FS
      ^PQ1,0,1,Y^XZ
    `
}
