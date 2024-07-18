import JsBarcode from 'jsbarcode'

export function getConfectionTicket({ confection }, isLastEl) {
  const { lot_installment, day_index, nbr_boxes, pallet_code } = confection
  const drilling_code = lot_installment.pallets[0].cultivation.code
  const variety = lot_installment.pallets[0].cultivation.variety.name
  const variety_field = lot_installment.pallets[0].cultivation.variety_field?.label ?? ''
  const img = document.createElement('img')

  JsBarcode(img, pallet_code, { displayValue: false, margin: 0, format: 'CODE128B' })

  return `<div class="w-[362.9527px]
  ${isLastEl ? 'h-[550.929px]' : 'h-[552.929134px]'} border p-4 text-md">
  <div class="font-semibold mb-5 text-center">ETIQUETTE PALETTE</div>
  <div class="grid grid-cols-2 gap-x-1 gap-y-5">
    <div class="col-span-1 uppercase">drilling code</div>
    <div class="col-span-1 border border-black grid place-content-center">${drilling_code}</div>
    <div class="col-span-1 uppercase">code date</div>
    <div class="col-span-1 border border-black grid place-content-center">${day_index.code}</div>
    <div class="col-span-1 uppercase">n versement</div>
    <div class="col-span-1 border border-black grid place-content-center">${lot_installment.code}</div>
    <div class="col-span-1 uppercase">variete</div>
    <div class="col-span-1 border border-black grid place-content-center text-center">${variety}</div>
    <div class="col-span-1 uppercase">variete champ</div>
    <div class="col-span-1 border border-black grid place-content-center">${variety_field}</div>
    <div class="col-span-1 uppercase">nombre de colis</div>
    <div class="col-span-1 border border-black grid place-content-center">${nbr_boxes}</div>
    <div class="col-span-1 uppercase">code de tracabilite</div>
    <div class="col-span-1 border border-black grid place-content-center">${drilling_code}${day_index.code}${
      lot_installment.code
    }</div>
    </div>
    <div class="mt-5">
      <img class="w-1/3 m-auto h-[30px]" src="${img.src}" />
      <div class="text-center">${pallet_code}</div>
    </div>
  </div>`
}
