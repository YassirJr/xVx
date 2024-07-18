import { GAN_FRUITS_COMPANIES } from '@/constants'

export function getConfectionReceipt_M2({ company, confection }, isLastEl) {
  const gnCompany = confection?.company ? GAN_FRUITS_COMPANIES[confection.company] : company

  return [...new Array(confection.nbr_boxes)].reduce((collect, _, index, array) => {
    let lastIndex = index === array.length - 1

    return (
      collect +
      `<div class="w-[226.77165354px] p-2 text-[0.35rem] tracking-tight
      ${isLastEl && lastIndex ? 'h-[150px]' : 'h-[151.18110236px]'}">
      <div class=" h-full w-full flex justify-center items-center text center font-semibold">
        <div class="text-center flex justify-between flex-col h-full relative">
          <h1 class="mb-0.5 font-bold text-[0.5rem]">Sté ${gnCompany.label ?? gnCompany.name}</h1>
          <div class="text-center leading-[0.6rem]">
              ${gnCompany.address ?? ''}</br>
              Variété: ${confection?.lot_installment?.pallets[0]?.cultivation?.variety?.name ?? '---'} ${
                confection?.lot_installment?.pallets[0]?.cultivation?.variety_field?.label ?? '---'
              }
               // ${confection?.final_product?.product_category?.label ?? '---'}</br>
              Station N°: 1557 Z</br>
              Exportateur N° ${gnCompany?.exporter_nbr ?? ''}</br>
              CoC: ${confection?.site.green_gold_license ?? '---'} // GGN: ${
                confection?.lot_installment?.pallets[0]?.site.global_gap_number ?? '---'
              }</br>
              LOT N°: ${
                confection?.lot_installment?.pallets[0]?.site?.code?.toString()?.padStart(2, '0') ?? ''
              } - ${confection?.day_index?.code ?? ''} - ${confection?.lot_installment?.code}A</br>
              Autorisation Saniitaire N°: MA FLC.60.36.14</br>
          </div>
          <div>
              <h3 class="font-bold my-2 mb-1 text-[8px]">Calibre: ${
                confection?.final_product?.product_caliber?.label ?? ''
              }</h3>
              <h4 class="font-bold text-[6px]">Produit du Maroc</h4>
          </div>
        </div>
      </div>
    </div>`
    )
  }, '')
}
