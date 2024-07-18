export function getBoxTicket80_55({ data }) {
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
      ^PW655
      ^LL456
      ^LS0
      ^FT2,86^A0N,45,66^FB653,1,12,C^FH\\^CI28^FD${final_product.name}^FS^CI27
      ^FT2,125^A0N,28,28^FB653,1,7,C^FH\\^CI28^FDExporter : ${company.name}^FS^CI27
      ^FT3,159^A0N,23,23^FB652,1,6,C^FH\\^CI28^FD${company.address}^FS^CI27
      ^FT0,215^A0N,28,28^FB321,1,7,C^FH\\^CI28^FDRef. Station : 7679U^FS^CI27
      ^FT426,215^A0N,28,28^FB229,1,7,C^FH\\^CI28^FDRef. :   9701^FS^CI27
      ^FT0,265^A0N,28,28^FB356,1,7,C^FH\\^CI28^FDType : ${lot_installment?.pallets[0]?.unity?.label}^FS^CI27
      ^FT2,314^A0N,28,35^FB653,1,7,C^FH\\^CI28^FDOrigin Maroc^FS^CI27
      ^FT3,358^A0N,28,28^FB652,1,7,C^FH\\^CI28^FDGGN 4063061552464^FS^CI27
      ^FT3,408^A0N,28,33^FB652,1,7,C^FH\\^CI28^FD${lot_installment?.pallets[0]?.cultivation?.code} ${lot_installment.code} ${day_index.code}^FS^CI27
      ^PQ1,0,1,Y
      ^XZ
    `
    )
  }, '')
}
