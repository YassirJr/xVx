import { GAN_FRUITS_COMPANIES } from '@/constants'
import JsBarcode from 'jsbarcode'

export function getGnConfectionPallet({ company, confection }, isLastEl) {
  let tickets = ``
  const gnCompany = confection?.company ? GAN_FRUITS_COMPANIES[confection.company] : company
  const img = document.createElement('img')

  JsBarcode(img, confection.pallet_code, { displayValue: false, margin: 0, format: 'CODE128B' })

  new Array(1).fill().forEach((_, index, array) => {
    let lastIndex = index === array.length - 1

    tickets += `<div class="flex ${isLastEl && lastIndex ? 'h-[566px]' : 'h-[567px]'}
    w-[378px] items-center justify-center p-6 text-sm">
        <div class="flex flex-col items-center justify-between h-full w-full border-2 border-black p-5">
          <div class="w-full">
            <div class="pb-4 text-center font-bold text-lg">${gnCompany.label ?? gnCompany.name}</div>
          </div>
          <div class="w-full">
            <div class="pb-2 font-semibold">Exportateur N° : ${gnCompany?.exporter_nbr ?? ''}</div>
            <div class="pb-2 font-semibold">Station N° : 1557 Z</div>
            <div class="pb-2 font-semibold">Produit : ${
              confection?.lot_installment?.pallets[0]?.cultivation?.variety?.name ?? '---'
            }</div>
            <div class="pb-2 font-semibold">Variété : ${
              confection?.lot_installment?.pallets[0]?.cultivation?.variety_field?.label ?? '---'
            }</div>
            <div class="pb-2 font-semibold">Nombre Colis : ${confection.nbr_boxes}</div>
            <div class="pb-2 font-semibold">Poids Brut : ${confection.gross_weight} KG</div>
            <div class="pb-2 font-semibold">Poids Net : ${confection.net_weight} KG</div>
            <div class="pb-2 font-semibold">N° Palette : ${confection.pallet_code}</div>
            <div class="pb-2 font-semibold">N° LOT : ${confection?.tracking_nbr} 
            </div>
          </div>
          <div class="w-full">
            <div class="pt-2 font-bold text-center text-sm">Calibre : ${
              confection?.final_product?.product_caliber?.label
            }</div>
            <div class="pt-3">
              <img class="w-1/3 m-auto h-9" src="${img.src}" />
              <div class="text-center text-sm mt-1">${confection.pallet_code}</div>
            </div>
          </div>
        </div>
      </div>`
  })

  return tickets
}
