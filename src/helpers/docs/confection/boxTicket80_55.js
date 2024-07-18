export function getBoxTicket80_55({ confection, company }, isLastEl) {
  const { day_index, final_product, lot_installment, nbr_boxes } = confection

  return [...new Array(nbr_boxes)].reduce((accum, _, index, array) => {
    let lastIndex = index === array.length - 1

    return (
      accum +
      `<div class="flex justify-center items-center w-[302px] ${
        isLastEl && lastIndex ? 'h-[206.8px]' : 'h-[207.87401575px]'
      } p-2 text-[13px]">
        <div class="text-center">
          <h1 class="uppercase font-bold mb-[4px]">${final_product.name}</h1>
          <div class=" mb-[4px]">Exporter : ${company.name}</div>
          <div class="text-[8px] mb-[4px]">${company.address}</div>
          <div class="grid grid-cols-2 mb-[4px] text-[8px]">
            <div class="col-span-1 mb-[4px]">Ref.Station : 7679U</div>
            <div class="col-span-1 mb-[4px]">Ref.Exportateur : 9701</div>
          </div>
          <div class=" mb-[4px]">Type : ${lot_installment?.pallets[0]?.unity?.label}</div>
          <div class=" mb-[4px]">Origin Maroc</div>
          <div class=" mb-[4px]">GGN: 4063061552464</div>
          <div class=" mb-[4px]">${lot_installment?.pallets[0]?.cultivation?.code} ${lot_installment.code} ${
            day_index.code
          }</div>
        </div>
      </div>`
    )
  }, '')
}
