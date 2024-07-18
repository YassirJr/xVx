import dayjs from 'dayjs'
import { DATE_FORMAT } from '@/constants'
import { t } from '@/plugins'

export function getInvoice(element, company) {
  let tabelRows = ''
  const products = element.final_products
  const client = element.client
  const vehicle = element.expedition?.vehicle

  tabelRows = ``
  let total_quantity = 0
  let total_netWheight = 0
  let total_gross_wheight = 0
  let total_amount = 0
  let total_pallets = 0
  products.forEach((product) => {
    tabelRows += `<tr>
    <td class="border-r border-black pl-1 py-0.5">${product.name ?? ''}</td>
    <td class="border-r border-black pl-1 py-0.5">${product.packhouse_unity?.label ?? ''}</td>
    <td class="border-r border-black pl-1 py-0.5">${product.quantity ?? ''}</td>
    <td class="border-r border-black pl-1 py-0.5">${product.net_weight ?? ''}</td>
    <td class="border-r border-black pl-1 py-0.5">${product.gross_weight ?? ''}</td>
    <td class="border-r border-black pl-1 py-0.5">${product.unit_price ?? ''}</td>
    <td class="border-r border-black pl-1 py-0.5">${t(client.currency) ?? ''}</td>
    <td class="pl-1">${product.total ?? ''}</td>
  </tr>`
    total_quantity += product.quantity
    total_netWheight += product.net_weight
    total_gross_wheight += product.gross_weight
    total_amount += product.total
    total_pallets += product.pallet_nbr
  })

  const template = `<div class="amiri-bold w-[406.26px] text-[8px] py-3">
  <div class="relative h-[591.4175px] w-full flex flex-col gap-2">
  <div class="w-2/5 flex flex-col justify-between">
    <span class="font-bold">${company.name}</span>
    <span >${company.address}</span>
  </div>
  <div class="w-1/5 flex flex-col self-center justify-between">
    <span class="font-bold">${client.name}</span>
    <span>Markt 5</span>
    <span>${client.address}</span>
  </div>
  <div class="flex flex-col justify-between">
    <div class="flex">
      <span class="w-20">Facture N°</span>
      <span class="font-bold">${element.invoice_nbr}</span>
    </div>
    <div class="flex">
      <span class="w-20">Date</span>
      <span class="font-bold">${dayjs(element.added_at).format(DATE_FORMAT).replaceAll('-', '/')}</span>
    </div>
    <div class="flex mt-2">
      <span class="w-20">Truck number</span>
      <span class="font-bold">${vehicle?.registration_nbr ?? ''}</span>
    </div>
    <div class="flex">
      <span class="w-20">Transporteur</span>
      <span class="font-bold">${vehicle?.transporter?.name ?? ''}</span>
    </div>
  </div>
  <table class="w-full mt-4 text-center text-[7px] [&>*]:border-black">
    <thead class="uppercase border bg-gray-100">
        <tr class="[&>*]:border-black [&>*]:border-r [&>*]:p-1">
          <th scope="col">${t('products')}</th>
          <th scope="col">${t('packaging-type')}</th>
          <th scope="col">${t('box')}</th>
          <th scope="col">${t('net-weight')}</th>
          <th scope="col">${t('gross-weight')}</th>
          <th scope="col">${t('price')}</th>
          <th scope="col">${t('currency')}</th>
          <th scope="col">${t('amount')}</th>
        </tr>
    </thead>
    <tbody class="border-x border-b">${tabelRows}</tbody>
    <tfoot class="uppercase">
      <tr class="[&>*]:border-black [&>*]:p-1">
        <th scope="col" class="text-left">Total palettes : ${total_pallets}</th>
        <th scope="col" class="text-left border-r"></th>
        <th scope="col" class="border-r border-b ">${total_quantity}</th>
        <th scope="col" class="border-r border-b ">${total_netWheight.toFixed(2)}</th>
        <th scope="col" class="border-r border-b ">${total_gross_wheight.toFixed(2)}</th>
        <th scope="col" class="border-r border-b "></th>
        <th scope="col" class="border-r border-b "></th>
        <th scope="col" class="border-r border-b ">${total_amount.toFixed(2)}</th>
      </tr>
    </tfoot>
  </table>
  <div class="text-center mt-auto">
    ${company?.name ?? ''} au capital de : 2 6000 000,00 - RC:${company?.trade_registry} - ${t(
      'license-number',
    )} : ${company?.license_number ?? ''} </br>
    ICE : 000285761000027 Compte bancaire 007010 0001845000002653 96 Tél:(212) 05 28 23 55 83
  </div>
</div>
</div>`

  return template
}
