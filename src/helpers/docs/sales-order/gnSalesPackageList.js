import { dayjs, t } from '@/plugins'
import { DATE_FORMAT } from '@/constants'
import { GAN_FRUITS_COMPANIES, countries } from '@/constants'

export function getGnSalesPackageList(element) {
  const confections = element.expedition.confections
  const gnCompany = confections[0]?.company ? GAN_FRUITS_COMPANIES[1] : ''
  let tableRows = ``
  let nbrBoxesTotal = 0

  const uniqueConfections = confections.reduce((accumulator, current) => {
    const found = accumulator.find((item) => item.pallet_code === current.pallet_code)
    if (found && current.gross_weight && current.net_weight) {
      found.nbr_boxes += current.nbr_boxes
      found.gross_weight += current.gross_weight
      found.net_weight += current.net_weight
    } else {
      accumulator.push(current)
    }
    return accumulator
  }, [])

  function groupByNbrBoxes(confections) {
    return confections.reduce((grouped, confection) => {
      let caliber = confection.final_product?.product_caliber?.code

      if (!grouped[caliber]) {
        grouped[caliber] = { total: 0, count: 0 }
      }
      grouped[caliber].total += confection.nbr_boxes
      grouped[caliber].count += 1
      return grouped
    }, {})
  }

  const confectionTotals = groupByNbrBoxes(uniqueConfections)

  uniqueConfections.forEach((confection, index) => {
    let cultivation = confection?.lot_installment?.pallets[0]?.cultivation
    let varietyName = confection.final_product?.variety?.name

    tableRows += `<tr class="font-normal">
    <th class="border-x border-b border-black py-0.5">
      ${index + 1}
    </th>
    <th class="border-r text-[6px] border-b border-black py-0.5 font-normal">
      ${varietyName ?? ''} ${cultivation?.variety_field?.label ?? ''}
    </th>
    <th class="border-r border-b border-black py-0.5 font-normal">
    ${confection.tracking_nbr ?? ''}
    </th>
    <th class="border-r border-b border-black py-0.5">
    ${confection.final_product?.product_caliber?.code ?? ''}
    </th>
    <th class="border-r border-b border-black py-0.5 font-normal">
    ${confection.nbr_boxes ?? ''}
    </th>
    <th class="border-r border-b border-black py-0.5 font-normal">
      ${confection.gross_weight ?? ''}
    </th>
    <th class="border-r border-b border-black py-0.5 font-normal">
    ${confection.net_weight ?? ''}</th>
  </tr>`

    nbrBoxesTotal += confection.nbr_boxes
  })

  let secondaryTableHeads = ''
  let secondaryTableRows = ''
  let paletteTotalRows = ''
  let secondaryTablePercentage = ''

  for (const caliber in confectionTotals) {
    secondaryTableHeads += `<th class="bg-gray-100 first-of-type:border-l border-r border-t border-black py-0.5 font-bold">
    ${caliber}
  </th>`
    secondaryTableRows += `<th class="first-of-type:border-l border-r border-t border-black py-0.5 font-normal">
    ${confectionTotals[caliber].total}
  </th>`
    paletteTotalRows += `<th class="first-of-type:border-l border-r border-t border-black py-0.5 font-normal">
    ${confectionTotals[caliber].count}
  </th>`
    secondaryTablePercentage += `<th class="first-of-type:border-l border-r border-y border-black py-0.5 font-normal">
    ${((confectionTotals[caliber].total / nbrBoxesTotal) * 100).toFixed(2)}%
  </th>`
  }

  return `<div class="pdf-font w-[446.46px] h-[630px] bg-white py-4 px-6 text-[10px]">
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <img class="h-8 bg-red-600" src="${gnCompany?.logo}" />
        <div>N° facture: ${element.invoice_nbr}</div>
        <div>${t('package-list')}</div>
      </div>

      <!-- Tags -->
      <div class="flex justify-between text-[6px] mb-2">
        <div class="grid grid-cols-2 gap-x-4">
          <div class="flex flex-col gap-y-1 text-center font-bold">
            <div class="py-0.5 px-1 bg-gray-100 uppercase">${t('date')}</div>
            <div class="py-0.5 px-1 bg-gray-100 uppercase">${t('transporter')}</div>
          </div>

          <div class="flex flex-col gap-y-1 justify-between text-center">
            <div class="p-0.5 font-semibold">${dayjs(element.added_at).format(DATE_FORMAT)}</div>
            <div class="p-0.5 font-semibold">${element.expedition.vehicle?.transporter?.name ?? ''}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-4">
          <div class="flex flex-col gap-y-1  text-center font-bold">
            <div class="py-0.5 px-1 bg-gray-100 uppercase">${t('destination')}</div>
            <div class="py-0.5 px-1 bg-gray-100 uppercase">${t('registration-nbr')}</div>
          </div>

          <div class="flex flex-col gap-y-1 text-center">
            <div class="p-0.5 font-semibold">${
              countries.find((c) => c.code == element.client?.country)?.name
            }</div>
            <div class="p-0.5 font-semibold">${element.expedition.vehicle?.registration_nbr}</div>
          </div>
        </div>
      </div>
      <!-- Table -->
      <div>
        <p class="text-[6px] mb-1">
          Produit certifé Global Gap [ Pleine conformité GRASP ]
        </p>
        <table class="text-[5px] w-full mb-2 text-center">
          <thead class="text-[6px]">
            <tr>
              <th
                class="border border-black py-1 bg-gray-100 uppercase">
                N° Ordre
              </th>
              <th
                class="border-r border-y border-black py-1 bg-gray-100 uppercase">
                ${t('product')}
              </th>
              <th
                class="border-r border-y border-black py-1 bg-gray-100 uppercase">
                N° de Lot
              </th>
              <th
                class="border-r border-y border-black py-1 bg-gray-100 uppercase">
                Calibre
              </th>
              <th
                class="border-r border-y border-black py-1 bg-gray-100 uppercase">
                nbr colis
              </th>
              <th
                class="border-r border-y border-black py-1 bg-gray-100 uppercase">
                ${t('gross-weight')}
              </th>
              <th
                class="border-y border-r border-black py-1 bg-gray-100 uppercase">
                ${t('net-weight')}
              </th>
            </tr>
          </thead>

          <tbody>
            ${tableRows}
          </tbody>

          <tfoot>
            <tr>
              <th colspan="4" class="border-x border-b border-black py-1 bg-gray-100  ">
                Total
              </th>
              <th
                class="border-b border-r border-black py-1 bg-gray-100">
                ${Math.floor(nbrBoxesTotal)}
              </)th>
              <th
                class="border-b border-r border-black py-1 bg-gray-100">
                ${Math.floor(element.expedition.gross_weight)}
              </th>
              <th class="border-b border-r border-black  py-1 bg-gray-100  ">
                ${Math.floor(element.expedition.net_weight)}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Sec Table -->
      <table class="text-[5px] w-full mb-3 text-center">
        <thead>
          <tr>
          ${secondaryTableHeads}
          </tr>
        </thead>
        <tbody>
          <tr>
          ${secondaryTableRows}
          </tr>
          <tr>
          ${paletteTotalRows}
          </tr>
        </tbody>
        <tfoot>
          <tr>
            ${secondaryTablePercentage}
          </tr>
        </tfoot>
      </table>
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
