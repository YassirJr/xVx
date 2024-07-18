import { jsPDF } from 'jspdf'
import axios from 'axios'

export const loadFont = async () => {
  const src = 'https://fonts.cdnfonts.com/s/14885/Amiri-Regular.ttf'
  const name = 'Amiri-Bold'
  const style = 'normal'
  const weight = 400
  const filename = src.split('\\').pop().split('/').pop()
  const axiosFont = axios.create({ responseType: 'arraybuffer', baseURL: '/' })
  let amiriFont = localStorage.getItem('amiri-font')

  if (!amiriFont) {
    const fontBytes = await axiosFont.get(src).then(({ data }) => data)
    const uint8Array = new Uint8Array(fontBytes)
    let binaryString = ''
    uint8Array.forEach((byte) => (binaryString += String.fromCharCode.apply(null, [byte])))
    amiriFont = window.btoa(binaryString)
    localStorage.setItem('amiri-font', amiriFont)
  }

  const callAddFont = function () {
    this.addFileToVFS(filename, amiriFont)
    this.addFont(filename, name, style, weight)
  }

  jsPDF.API.events.push(['addFonts', callAddFont])
}
