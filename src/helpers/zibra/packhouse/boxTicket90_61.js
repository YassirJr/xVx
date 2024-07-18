export function getBoxTicket90_61({ data }) {
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
      `^XA
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
      ^PW719
      ^LL504
      ^LS0
      ^FT0,93^A0N,49,76^FB709,1,13,C^FH\\^CI28^FD${final_product.name}^FS^CI27
      ^FT7,137^A0N,31,33^FB712,1,8,C^FH\\^CI28^FDExporter : ${company.name}^FS^CI27
      ^FT0,175^A0N,25,25^FB697,1,6,C^FH\\^CI28^FD${company.address}^FS^CI27
      ^FT0,237^A0N,31,33^FB334,1,8,C^FH\\^CI28^FDRef. Station : 7679U^FS^CI27
      ^FT487,237^A0N,31,33^FB232,1,8,C^FH\\^CI28^FDRef. :   9701^FS^CI27
      ^FT0,292^A0N,31,33^FB382,1,8,C^FH\\^CI28^FDType : ${lot_installment?.pallets[0]?.unity?.label}^FS^CI27
      ^FT2,346^A0N,31,43^FB717,1,8,C^FH\\^CI28^FDOrigin Maroc^FS^CI27
      ^FT6,395^A0N,31,33^FB713,1,8,C^FH\v^CI28^FDGGN 4063061552464^FS^CI27
      ^FT0,451^A0N,31,38^FB696,1,8,C^FH\\^CI28^FD${lot_installment?.pallets[0]?.cultivation?.code} ${lot_installment.code} ${day_index.code}^FS^CI27
      ^PQ1,0,1,Y
      ^XZ`
    )
  }, '')
}
