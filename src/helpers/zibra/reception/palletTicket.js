import dayjs from 'dayjs'

export function getPalletTicket({ data }) {
  return data.reduce((zplString, currVal) => {
    const { cultivation, unity, added_at, nbr_boxes, pallet_code } = currVal

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
      ^FT72,178^A0N,75,76^FH\\^CI28^FDFerme :  ${cultivation.parcel.site.name}^FS^CI27
      ^FT72,394^A0N,75,76^FH\\^CI28^FDCulture  :  ${cultivation.variety.name}^FS^CI27
      ^FT72,610^A0N,75,76^FH\\^CI28^FDUnité   :  ${unity.label}^FS^CI27
      ^FT72,828^A@N,75,70,TT0003M_^FH\\^CI28^FDDrilling Code  :  ${cultivation.code}^FS^CI27
      ^FT72,1044^A@N,75,70,TT0003M_^FH\\^CI28^FDDate de réception  :  ${dayjs(added_at).format(
        'DD MMM YYYY',
      )}^FS^CI27
      ^FT72,1260^A@N,75,70,TT0003M_^FH\\^CI28^FDNombre caisse : ${nbr_boxes}^FS^CI27
      ^BY4,3,236^FT383,1589^BCN,,Y,N
      ^FH\\^FD>;${pallet_code.toString().padStart(12, '0')}^FS
      
      ^XZ`
    )
  }, '')
}
