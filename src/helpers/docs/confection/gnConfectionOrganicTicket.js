import { GAN_FRUITS_COMPANIES } from '@/constants'
import bio_prod_logo from '@/assets/images/bio_prod_logo.webp'

export function getGnConfectionOrganicTicket({ company, confection }, isLastEl) {
  const gnCompany = confection?.company ? GAN_FRUITS_COMPANIES[confection.company] : company

  return [...new Array(confection.nbr_boxes)].reduce((collect, _, index, array) => {
    let lastIndex = index === array.length - 1

    return (
      collect +
      `<div class="pdf-font w-[226.77165354px] p-2 text-[6px] tracking-tight
      ${isLastEl && lastIndex ? 'h-[150px]' : 'h-[151.18110236px]'}">
      <div class=" h-full w-full">
        <div class="flex justify-between">
            <div class="grow">
                <div class="w-full text-center text-[9px] font-bold mb-1">Organic Product</div>
                <div>
                    <span>Product : </span>
                    <span>${confection.lot_installment?.pallets[0]?.cultivation?.variety?.name ?? ''}</span>
                </div>
                <div>
                    <span>Variete : </span>
                    <span>${confection.lot_installment?.pallets[0]?.cultivation?.variety_field ?? ''}</span>
                </div>
                <div>
                    <span>Origin : </span>
                    <span>Morocco</span>
                </div>
                <div>
                    <span>Category : </span>
                    <span>${confection.final_product?.product_category?.label ?? ''}</span>
                </div>
                <div>
                    <span>Size : </span>
                    <span>${confection.final_product?.product_caliber?.label ?? ''}</span>
                </div>
                <div>
                    <span>Approx weight : </span>
                    <span>${confection.final_product?.net_weight} ${
                      confection.final_product?.unity_measure
                    }</span>
                </div>
            </div>
            <div class="flex flex-col">
                <div class="self-end">
                    <img src="${bio_prod_logo}" class="w-[30px] h-[22px] mb-0.5">
                </div>
                <div class="text-center text-[5px] flex flex-col mb-1">
                    <span>Controlled and certified by</span>
                    <span>CCPA MAROC/Ma-102-BIO</span>
                    <span>Agriculture of Morocco</span>
                </div>
                <div class="text-center">
                    <span>Exporter N° </span>
                    <span>${gnCompany?.exporter_nbr ?? ''}</span>
                </div>
                <div class="text-center">
                    <span>Packhouse N° </span>
                    <span>15572</span>
                </div>
            </div>
        </div>


        <div class="flex justify-between">
            <div>Product Tracking : </div>
            <div>
                <span>Batch N° </span>
                <span>01-011522-01AB</span>
                <span>CoC </span>
                <span>${confection.lot_installment?.pallets[0]?.site?.green_gold_license ?? ''}</span>
            </div>
        </div>

        <div class="flex justify-between">
            <div>
                <span>GGN : </span>
                <span>${confection.lot_installment?.pallets[0]?.site?.global_gap_number ?? ''}</span>
            </div>
            <div>
                <span>Autorisation Sanitaire N°: </span>
                <span>MA FLC.60.36.14</span>
            </div>
        </div>

        <div class="flex justify-between my-1">
            <span>Imported by : </span>
            <span></span>
        </div>
        
        <div class="">
            <span>Exported By : </span>
            <span>${gnCompany.label}</span>
            <div class="text-[5px]">${gnCompany.address}</div>
        </div>

      </div>
    </div>`
    )
  }, '')
}
