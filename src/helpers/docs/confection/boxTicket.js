export function getBoxTicket({ confection, company }, isLastEl) {
  const { day_index, final_product, lot_installment, nbr_boxes } = confection

  return [...new Array(nbr_boxes)].reduce((accum, _, index, array) => {
    let lastIndex = index === array.length - 1

    return (
      accum +
      `<div class="flex justify-center items-center w-[226px] ${
        lastIndex && isLastEl ? 'h[264.566px]' : 'h-[264.56692913px]'
      }
       p-2 text-[13px]">
          <div class="text-center h-full">
            <h1 class="uppercase font-bold mb-[4px]">${final_product.name}</h1>
            <div class=" mb-[4px]">Exporter : ${company.name}</div>
            <div class=" mb-[4px]">Ref.Station : 7679U</div>
            <div class=" mb-[4px]">Ref.Exportateur : 9701</div>
            <div class="text-[8px] mb-[4px]">${company.address}</div>
            <div class=" mb-[4px]">Pois Net : ${final_product.net_weight} Kg</div>
            <div class="grid grid-cols-2 mb-[4px] text-[8px]">
              <div class="col-span-1 mb-[4px]">Categorie : ${final_product.product_category.label}</div>
              <div class="col-span-1 mb-[4px]">Calibre : ${final_product.product_caliber.label}</div>
            </div>
            <div class=" mb-[4px]">Origin Maroc</div>
            <div class=" mb-[4px]">GGN 4063061552464</div>
            <div class=" mb-[4px]">
              ${lot_installment?.pallets[0]?.cultivation?.code} - ${day_index.code} - ${lot_installment.code}
            </div>
          </div>  
       </div>`
    )
  }, '')
}
