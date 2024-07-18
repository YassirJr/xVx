import dayjs from 'dayjs'
import { DATE_FORMAT } from '@/constants'
import { t } from '@/plugins'
import { useCompanyStore } from '@/stores/company'

const companyStore = useCompanyStore()

export function getPackageList(data, company = companyStore.companies[0]) {
  let tableRows = ``
  let totalQuantity = 0
  let totalNetWeight = 0
  let totalGrossWeight = 0

  data.confections.forEach((element) => {
    tableRows += `<tr class="[&>*]:p-2 [&>*]:border-r [&>*]:border-black border-b border-x border-black "">
    <td class="border-r px-2 py-2">${element.final_product.name ?? ''}</td>
    <td class="border-r px-2 py-2">${element.final_product?.packhouse_unity?.label ?? ''}</td>
    <td class="border-r px-2 py-2">${element.nbr_boxes ?? ''}</td>
    <td class="border-r px-2 py-2">${element.net_weight ?? ''}</td>
    <td class="border-r px-2 py-2">${element.gross_weight ?? ''}</td>
  </tr>`

    totalQuantity += element.nbr_boxes
    totalNetWeight += element.net_weight
    totalGrossWeight += element.gross_weight
  })

  return `<div class="pdf-font w-[591.4175px]">
    <div class="flex flex-col h-[406.46px] w-full text-[10px] ">
      <div class="text-center text-xl" > ${t('package-list')} </div>
      <div class="flex flex-col gap-1">
        <span class="">${company.name}</span>
        <div class="flex ">
          <span class="w-20">Colisage du :</span>
          <span >${dayjs(data.added_at).format(DATE_FORMAT)}</span>
        </div>
        <div class="flex ">
          <span class="w-20">Matricule :</span>
          <span >${data.vehicle.registration_nbr}</span>
        </div>
      </div>
      <table class="mt-4 text-center w-full [&>*]:border-black text-[8px]" >
        <thead class="uppercase border bg-gray-100">
          <tr class="[&>*]:border-black [&>*]:border-r [&>*]:p-1">
            <th scope="col">${t('products')}</th>
            <th scope="col">${t('packaging-type')}</th>
            <th scope="col">${t('box')}</th>
            <th scope="col">${t('net-weight')}</th>
            <th scope="col">${t('gross-weight')}</th>
          </tr>
        </thead>
        <tbody class="border-b border-x">
            ${tableRows}
        </tbody>
        <tfoot class="uppercase">
          <tr class="[&>*]:border-black [&>*]:p-1">
            <th scope="col" class="text-left flex items-center">Total palettes : <span class="mx-auto font-black">${
              data.nbr_pallets
            }</span></th>
            <th scope="col" class="text-left border-r"></th>
            <th scope="col" class="border-r border-b ">${totalQuantity.toFixed(2)}</th>
            <th scope="col" class="border-r border-b ">${totalNetWeight.toFixed(2)}</th>
            <th scope="col" class="border-r border-b ">${totalGrossWeight.toFixed(2)}</th>
          </tr>
        </tfoot>
      </table>
    </div>
</div>`
}
