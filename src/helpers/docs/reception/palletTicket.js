import { DATE_FORMAT } from '@/constants'
import dayjs from 'dayjs'
import JsBarcode from 'jsbarcode'

export function getPalletTicket(data) {
  let tickets = ``

  data
    .flatMap((item) => item.pallets.flatMap((pallet) => ({ ...item, ...pallet, station: item.site })))
    .forEach((el, index, array) => {
      const img = document.createElement('img')
      const vareityName = el.unity?.variety?.name ?? el.cultivation?.variety?.name
      const siteName = el.cultivation?.parcel?.site?.name ?? el.site?.name
      const globalGapNumber =
        el.site?.global_gap_number ?? el.cultivation?.parcel?.site?.global_gap_number ?? ''
      let lastIndex = index === array.length - 1

      JsBarcode(img, el.pallet_id, { displayValue: false, margin: 0, format: 'CODE128B' })

      tickets += `
        <div class="flex ${
          lastIndex ? 'h-[566px]' : 'h-[567px]'
        } w-[378px] items-center justify-center p-6 text-sm [word-spacing:3px]">
          <div class="flex flex-col items-center justify-between h-full w-full border-2 border-black p-5">
            <div class="w-full">
              <div class="pb-1 text-center text-2xl font-extrabold">${el.reception?.site?.name ?? '-'}</div>
              <div class="!text-[10px] pb-3 text-center">FICHE PALLETTE A LA RECEPTION</div>
            </div>
            <div class="w-full">
              <div class="pb-2 font-semibold">PRODUIT : ${vareityName}</div>
              <div class="pb-2 font-semibold">Unité : ${el.unity?.label}</div>
              <div class="pb-2 font-semibold">DATE : ${dayjs(el.added_at).format(DATE_FORMAT)}</div>
              <div class="pb-2 font-semibold">N° LOT : ${el.reception?.code ?? ''}A</div>
              <div class="pb-2 font-semibold">N° PALETTE : ${el.pallet_id}</div>
              <div class="pb-2 font-semibold">NBR DES CAISSES : ${el.nbr_boxes}</div>
              <div class="pb-2 font-semibold">POIDS BRUT : ${el.gross_weight}</div>
              <div class="pb-2 font-semibold">POIDS NET : ${el.net_weight}</div>
              <div class="pb-2 font-semibold">PRODUCTEUR : ${siteName}</div>
              <div class="pb-2 font-semibold">GGN : ${globalGapNumber}</div>
            </div>
            <div class="w-full">
              <div class="font-semibold">
                <img class="w-1/3 m-auto h-11" src="${img.src}" />
                <div class="text-center text-sm mt-1">${el.pallet_id}</div>
              </div>
            </div>
          </div>
        </div>
      `
    })

  return tickets
}
