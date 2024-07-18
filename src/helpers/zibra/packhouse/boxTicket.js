export function getBoxTicket({ data }) {
  let zplString = ``

  data.forEach((element) => {
    zplString += singleBoxTicket(element)
  })

  return zplString
}
const singleBoxTicket = ({ confection, company }) => {
  const { day_index, final_product, lot_installment, nbr_boxes } = confection

  return [...new Array(nbr_boxes)].reduce((zplString) => {
    return (
      zplString +
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
      ^PR4,4
      ~SD15
      ^JUS
      ^LRN
      ^CI27
      ^PA0,1,1,0
      ^XZ
      ^XA
      ^MMT
      ^PW496
      ^LL591
      ^LS0
      ^FT0,79^A0N,28,28^FB496,1,7,C^FH\\^CI28^FD${final_product.name}^FS^CI27
      ^FT1,196^A0N,28,28^FB495,1,7,C^FH\\^CI28^FDRef.Station : 7679U^FS^CI27
      ^FT0,247^A0N,28,28^FB496,1,7,C^FH\\^CI28^FDRef.Exportateur : 9701^FS^CI27
      ^FT1,290^A0N,20,20^FB495,1,5,C^FH\\^CI28^FD${company.address}^FS^CI27
      ^FT0,339^A0N,28,28^FB496,1,7,C^FH\\^CI28^FDPois Net : ${final_product.net_weight} Kg^FS^CI27
      ^FT0,382^A0N,20,20^FB496,1,5,C^FH\\^CI28^FDCategorie : ${final_product.product_category.label} | Calibre : ${final_product.product_caliber.label}^FS^CI27
      ^FT1,431^A0N,28,28^FB495,1,7,C^FH\\^CI28^FDOrigin Maroc^FS^CI27
      ^FT0,482^A0N,28,28^FB496,1,7,C^FH\\^CI28^FDGGN 4063061552464^FS^CI27
      ^FT1,533^A0N,28,28^FB495,1,7,C^FH\\^CI28^FD${lot_installment?.pallets[0]?.cultivation?.code} ${lot_installment.code} ${day_index.code}^FS^CI27
      ^FPH,1^FT0,138^A0N,25,25^FB496,1,6,C^FH\\^CI28^FDExporter : ${company.name}^FS^CI27
      ^PQ1,0,1,Y
      ^XZ
    `
    )
  }, '')
}
