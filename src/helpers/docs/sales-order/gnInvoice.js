import { dayjs, t } from '@/plugins'
import { DATE_FORMAT } from '@/constants'
import { GAN_FRUITS_COMPANIES, countries } from '@/constants'
import { useSalesOrderStore } from '@/stores/salesOrder'
import { toWords } from '@/plugins/numToWords'

const salesOrderStore = useSalesOrderStore()

export const getGnInvoice = (element) => {
  const expedition = element?.expedition
  const confection = expedition?.confections[0]
  const gnCompany = confection?.company ? GAN_FRUITS_COMPANIES[confection?.company] : ''

  let tableRows = ''
  let totalPalettes = 0
  let totalBoxes = 0
  let totalGrossWeight = 0
  let totalNetWeight = 0
  let totalAmount = 0
  let incoterm =
    salesOrderStore.incoterms?.find((incoterm) => incoterm.value == element?.incoterm)?.label ?? ''

  element.final_products.forEach((product) => {
    tableRows += `<tr class="font-normal text-[6px]">
      <th class="border-x border-b border-black py-0.5 font-normal">
        <div>${product.variety?.name}</div>
        <div class="font-bold">Calibre: ${product.product_caliber?.code}</div>
      </th>
      <th class="border-r border-b border-black py-0.5 font-normal">
        ${product.packhouse_unity?.label}
      </th>
      <th class="border-r border-b border-black py-0.5 font-normal">
        ${product.pallet_nbr}
      </th>
      <th class="border-r border-b border-black py-0.5 font-normal">
        ${product.quantity}
      </th>
      <th class="border-r border-b border-black py-0.5 font-normal">
        ${product.gross_weight}
      </th>
      <th class="border-r border-b border-black py-0.5 font-normal">
        ${product.net_weight}
      </th>
      <th class="border-r border-b border-black py-0.5 font-normal">
        ${product.unit_price}      
      </th>
      <th 
        class="border-r border-b border-black py-0.5 font-normal">
        ${product.total}
      </th>
    </tr>`

    totalPalettes += product.pallet_nbr
    totalBoxes += product.quantity
    totalGrossWeight += product.gross_weight
    totalNetWeight += product.net_weight
    totalAmount += product.total
  })

  return `<div class="pdf-font w-[446.46px] h-[631.4175px] bg-white py-6 px-8 text-[7px]">
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8 text-[10px]">
        <div><img class="w-20" src="${gnCompany?.logo}" /></div>
        <div>Facture</div>
      </div>

      <!-- Tags -->
      <div class="flex justify-between mb-4 font-bold">
        <div class="text-center w-[50%] uppercase">
          <div>
            <div>
              <div
                class="py-0.5 px-2 bg-gray-100 w-full grid grid-cols-2 gap-x-4">
                <span>N° facture</span>
                <span>date</span>
              </div>
              <div class="py-1 px-2 w-full grid grid-cols-2 gap-x-4">
                <span>${element.invoice_nbr}</span>
                <span>${dayjs(element.added_at).format(DATE_FORMAT)}</span>
              </div>
            </div>
            <div>
              <div
                class="py-0.5 px-2 bg-gray-100 w-full grid grid-cols-2 gap-x-4">
                <span>N° Matricule</span>
                <span>transporteur</span>
              </div>
              <div class="py-1 px-2 w-full grid grid-cols-2 gap-x-4">
                <span>${element.expedition?.vehicle?.registration_nbr}</span>
                <span>${element.expedition?.vehicle?.transporter?.name}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center w-[35%] uppercase">
          <div class="py-0.5 px-2 bg-gray-100 mb-2">
            Facture A
          </div>
          <div>${element.client?.name}</div>
          <div class="p-0.5 font-semibold">
            ${element.client?.address}
          </div>
          <div class="p-0.5 font-semibold">
            ${element.client?.city ?? ''}
          </div>
          <div class="p-0.5 font-semibold capitalize">
          ${countries.find((c) => c.code == element.client?.country)?.name ?? ''}
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="mb-4">
        <table class="w-full text-center">
          <thead class="text-[5px]">
            <tr>
              <th
                class="border border-black p-1 bg-gray-100 uppercase">
                Designation
              </th>
              <th
                class="border-r border-y border-black p-1 bg-gray-100 uppercase">
                Emballage
              </th>
              <th
                class="border-r border-y border-black p-1 bg-gray-100 uppercase">
                Nbr pallettes
              </th>
              <th
                class="border-r border-y border-black p-1 bg-gray-100 uppercase">
                Nbr colis
              </th>
              <th
                class="border-r border-y border-black p-1 bg-gray-100 uppercase">
                Poids Brut (kg)
              </th>
              <th
                class="border-r border-y border-black p-1 bg-gray-100 uppercase">
                Poids Net (kg)
              </th>
              <th
                class="border-r border-y border-black p-1 bg-gray-100 uppercase">
                prix unit €
              </th>
              <th
                class="border-r border-y border-black p-1 bg-gray-100 uppercase">
                montant €
              </th>
            </tr>
          </thead>

          <tbody class="w-full">
            ${tableRows}
          </tbody>

          <tfoot>
            <tr>
              <th colspan="2" class="border-x border-b border-black py-1 bg-gray-100  ">
                Total
              </th>
              <th
                class="border-r border-b border-black py-1 bg-gray-100  ">
                ${totalPalettes}
              </th>
              <th
                class="border-r border-b border-black py-1 bg-gray-100  ">
                ${totalBoxes}
              </th>
              <th
                class="border-r border-b border-black py-1 bg-gray-100  ">
                ${Math.floor(totalGrossWeight)}
              </th>
              <th
                class="border-r border-b border-black py-1 bg-gray-100  ">
                ${Math.floor(totalNetWeight)}
              </th>
              <th class="border-r border-b border-black py-1 bg-gray-100  "></th>
              <th 
                class="border-r border-b border-black py-1 bg-gray-100  ">
                ${totalAmount.toFixed(2)}
              </th>
            </tr>
          </tfoot>
        </table>
        <p class="text-[7px] mt-2">
          Arretée la présente facture a la somme de : <strong>${toWords.convert(totalAmount)} ${t(
            element?.client?.currency,
          )}</strong>
        </p>
      </div>

      <!-- Invoice Info -->
      <div class="text-[7px]">
        <div class="font-bold mb-2">
          Produit certifé Global Gap [ Pleine conformité GRASP ]
        </div>
        <div class="flex items-center justify-end uppercase">
          <div>
            <div class="flex gap-x-8 justify-between">
              <span>nbr pallettes :</span>
              <span class="font-bold">${totalPalettes}</span>
            </div>           
            <div class="flex gap-x-8 justify-between">
              <span>Poid brut (kg) :</span>
              <span class="font-bold">${Math.floor(totalGrossWeight)}</span>
            </div>
            <div class="flex gap-x-8 justify-between">
            <span>Poid net (kg) :</span>
            <span class="font-bold justify-between">${Math.floor(totalNetWeight)}</span>
          </div>
          </div>
        </div>
        <div class="font-bold mt-1 uppercase">${incoterm ? `Incoterm: ${t(incoterm)}` : ''} </div>
        <div class="mt-2 uppercase w-[45%] text-[6px]">
          <div class="font-bold">Referance bancaires</div>
          <div>Crédit xVxcole Du Maroc</div>
          <p class="mt-0.5">
            Agance: Centre d'affaires agro business, larache
          </p>
          <div>RIB : ${gnCompany?.rib}</div>
          <div>SWIFT : CNCAMAMR</div>
        </div>
      </div>

      <!-- Footer info -->
      <div class="grid grid-cols-3 gap-x-8 text-[6px] mt-auto">
        <div>
          <div class="font-bold">${gnCompany?.label ?? ''}</div>
          <div>${gnCompany?.address ?? ''}</div>
        </div>

        <div class="text-center">
          <div>${
            gnCompany?.email ? `Email | <span class="tracking-tight">${gnCompany?.email}</span>` : ''
          }</div>
          <div>Tel | ${gnCompany?.phone_nbr}</div>
        </div>

        <div class="text-end">
          <div>IF: ${gnCompany.if}</div>
          <div>ICE: ${gnCompany.ice}</div>
          <div>RC: ${gnCompany.rc}</div>
          <div>TP: ${gnCompany.tp}</div>
        </div>
      </div>
    </div>
  </div>`
}
