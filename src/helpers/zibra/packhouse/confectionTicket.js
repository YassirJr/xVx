export function getConfectionTicket({ data }) {
  return data.reduce((zplString, currVal) => {
    const { lot_installment, day_index, nbr_boxes, pallet_code } = currVal.confection
    const drilling_code = lot_installment.pallets[0].cultivation.code
    const variety = lot_installment.pallets[0].cultivation.variety.name

    return (
      zplString +
      `^XA
      
      ~TA000
      ~JSN
      ^LT0
      ^MNW
      ^MTT
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
      ^MMT
      ^PW1205
      ^LL1795
      ^LS0
      ^FT214,223^A0N,92,91^FH\\^CI28^FDETIQUETTE PALETTE^FS^CI27
      ^FT70,416^A0N,75,76^FH\\^CI28^FDDRILLING CODE^FS^CI27
      ^FT0,416^A0N,75,71^FB1125,1,19,R^FH\\^CI28^FD${drilling_code}^FS^CI27
      ^FT72,588^A0N,75,76^FH\\^CI28^FDCODE DATE^FS^CI27
      ^FT0,588^A0N,75,71^FB1127,1,19,R^FH\\^CI28^FD${day_index.code}^FS^CI27
      ^FT70,761^A0N,75,76^FH\\^CI28^FDN VERSEMENT^FS^CI27
      ^FT0,761^A0N,75,71^FB1125,1,19,R^FH\\^CI28^FD${lot_installment.code}^FS^CI27
      ^FT72,933^A0N,75,76^FH\\^CI28^FDVARIETE^FS^CI27
      ^FT0,933^A0N,75,71^FB1127,1,19,R^FH\\^CI28^FD${variety}^FS^CI27
      ^FT75,1099^A0N,75,76^FH\\^CI28^FDNOMBRE DE COLIS^FS^CI27
      ^FT0,1099^A0N,75,71^FB1130,1,19,R^FH\\^CI28^FD${nbr_boxes}^FS^CI27
      ^FT75,1297^A0N,75,76^FH\\^CI28^FDNOMBRE DE^FS^CI27
      ^FT75,1391^A0N,75,76^FH\\^CI28^FDTRACABILITE^FS^CI27
      ^FT0,1352^A0N,75,71^FB1134,1,19,R^FH\\^CI28^FD46879898980^FS^CI27
      ^BY5,3,207^FT369,1688^BCN,,Y,N
      ^FH\\^FD>;${pallet_code.toString().padStart(12, '0')}^FS
      
      ^XZ`
    )
  }, '')
}
