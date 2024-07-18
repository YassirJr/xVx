import { GAN_FRUITS_COMPANIES } from '@/constants'

export function getBoxTicket80_80({ confection, company }) {
  const nbr_boxes = 1

  const gnCompany = confection?.company ? GAN_FRUITS_COMPANIES[confection.company] : company

  return [...new Array(nbr_boxes)].reduce((accum) => {
    return (
      accum +
      `    <div class="w-[302px] h-[302px] p-1 bg-white tracking-tight">
      <div class="border border-black h-full w-full grid grid-rows-2">
        <!-- Row 1 -->
        <div class="grid grid-cols-2 border-b border-black">
          <!-- Row 1 / Col 1 -->
          <div class="border-r border-black flex flex-col justify-end">
            <div
              class="text-[6.5px] font-semibold grid grid-cols-2 px-1.5 pb-0.5">
              <div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
              </div>

              <div class="flex flex-col items-end">
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
              </div>
            </div>
          </div>
          <!-- Row 1 / Col 2 -->
          <div>
            <div
              class="border-b border-black text-center text-[10px] font-bold">
              80616
            </div>
            <div class="text-[8px] text-center">origin</div>
            <div
              class="text-[6.5px] font-semibold grid grid-cols-2 px-1.5 pb-0.5">
              <div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
                <div class="flex justify-between">
                  <span>Morocco</span> <span>-</span>
                </div>
              </div>

              <div class="flex flex-col items-end">
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
                <div>Morocco</div>
              </div>
            </div>
          </div>
        </div>
        <!-- Row 2 -->
        <div class="h-full">
          <div
            class="grid grid-cols-2 text-center text-[8px] font-semibold h-full">
            <!-- column 1  -->
            <div class="flex flex-col h-full">
              <!-- Row -->
              <div
                class="grid grid-cols-[.5fr,1fr] border-b border-black font-bold">
                <div
                  class="border-r border-black flex items-center justify-center p-0.5">
                  Grower
                </div>
                <div class="border-r border-black p-0.5 text-center">
                  ${confection?.lot_installment?.pallets[0]?.site?.global_gap_number}
                </div>
              </div>
              <!-- Row -->
              <div
                class="grid grid-cols-[.5fr,1fr] border-b border-black h-[71px]">
                <div
                  class="border-r border-black flex items-center justify-center p-0.5 font-bold">
                  Packhouse
                </div>
                <div class="border-r border-black text-center">
                  <div class="font-bold p-0.5">${gnCompany?.label ?? ''}</div>
                  <p class="text-[6px] p-0.5">
                    ${gnCompany?.address ?? ''}
                  </p>
                  <div
                    class="text-[7px] font-bold border-t border-black mt-1 text-center p-0.5">
                    <span class="font-bold">COC ${
                      confection?.lot_installment?.pallets[0]?.site?.green_gold_license
                    }</span>
                  </div>
                </div>
              </div>
              <!-- Row -->
              <div class="grid grid-cols-[.5fr,1fr] border-b border-black">
                <div
                  class="border-r border-black flex items-center justify-center p-0.5 font-bold">
                  Supplier
                </div>
                <div class="border-r border-black text-center">
                  <div class="font-bold p-0.5">${gnCompany?.label ?? ''}</div>
                  <p class="text-[7px] p-0.5">COC ${
                    confection?.lot_installment?.pallets[0]?.site?.green_gold_license
                  }</p>
                </div>
              </div>
              <!-- Row -->
              <div class="grid grid-cols-[.5fr,1fr] h-full">
                <div
                  class="border-r border-black flex items-center justify-center p-0.5 font-bold">
                  Key
                </div>
                <div class="border-r border-black text-center flex">
                  <div class="px-1 grid place-content-center">0${
                    confection?.lot_installment?.pallets[0]?.site?.id
                  }</div>
                  <div
                    class="px-1 grid place-content-center grow border-x border-black">
                    ${confection?.day_index?.code}
                  </div>
                  <div class="px-1 grid place-content-center">${confection?.lot_installment?.code}</div>
                </div>
              </div>
            </div>
            <!-- column 2  -->
            <div class="h-full">
              <div class="text-center font-bold py-0.5 border-b border-black">
                Klasse/Class/Cat. ${confection?.final_product?.product_category?.label}
              </div>

              <div class="grid grid-rows-2 h-[71px]">
                <div
                  class="text-center font-bold border-b border-black text-xs py-2.5">
                  ${confection?.final_product?.net_weight} ${confection?.final_product?.unity_measure}
                </div>
                <div
                  class="text-center font-bold border-b border-black text-xs py-2.5">
                  Variety: ${confection?.lot_installment?.pallets[0]?.cultivation?.variety_field?.label ?? ''}
                </div>
              </div>

              <div class="grid grid-rows-3">
                <div class="border-b border-black py-0.5 font-bold text-[8px]">
                  Size/Caliber: ${confection?.final_product?.product_caliber?.label}
                </div>
                <div class="flex items-center justify-center py-0.5 text-[7px]">
                  Authorization sanitaire N°: MA FLF.60.36.15
                </div>
                <div
                  class="grid place-content-center border-t border-black font-bold py-0.5">
                  <span>Packer: 2125J / Exporter: ${gnCompany?.exporter_nbr ?? ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`
    )
  }, '')
}
