export function getTransportBarcode({ data }) {
  let employeePairs = data
    .flat()
    .filter((employee) => employee)
    .reduce((acc, curr, i) => {
      if (i % 2 === 0) {
        acc.push([curr])
      } else {
        acc[acc.length - 1].push(curr)
      }
      return acc
    }, [])

  return employeePairs.reduce((zplString, pair) => zplString + generateBarcode(pair), '')
}

const generateBarcode = (pair) => {
  return `
    ^XA
    ~TA000
    ~JSN
    ^LT-40
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
    ^PW472
    ^LL136
    ^LS40
    ^BY2,3,47^FT52,82^BCN,,Y,N
    ^FH\\^FD${pair[0].employee.uid}^FS
    ^BY2,3,47^FT284,82^BCN,,Y,N
    ^FH\\^FD${pair[0].employee.uid}^FS
    ^PQ1,0,1,Y
    ^XZ
  `
}
