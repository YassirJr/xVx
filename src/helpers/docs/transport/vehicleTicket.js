import JsBarcode from 'jsbarcode'

export function getVehicleTicket(employee, roadImg, lastRow) {
  const { registration_nbr, transporter, type } = employee

  const img = document.createElement('img')
  JsBarcode(img, registration_nbr, { displayValue: false, margin: 0, format: 'CODE128B' })
  return `<div
  class="${
    lastRow ? 'h-[111px]' : 'h-[112px]'
  } border border-black border-dashed col-span-1 mb-[4px] relative text-[6px] overflow-hidden p-1"
>
  <div class="grid grid-cols-3">
    <div class="col-span-2 text-start tracking-widest text-[5px]" style="font-weight: 700">BADGE DE TRANSPORT</div>
    <div class="col-span-1">
      <img class="h-6 w-6 m-auto" src="${roadImg}" />
    </div>
    <div class="col-span-3 pl-2">
      <div class="font-bold">${transporter.name}</div>
      <div class="text-[5px]">${type.name}</div>
    </div>
    <div class="col-span-3 mt-3 m-auto">
      <div class="w-16">
        <img class="h-6 w-full" src="${img.src}" />
        <div class="text-center text-[7px] mt-2" style="font-weight: 700">${registration_nbr ?? ''}</div>
      </div>
    </div>
  </div>
</div>`
}
