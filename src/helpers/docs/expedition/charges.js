import dayjs from 'dayjs'
import { DATE_FORMAT } from '@/constants'

export function getCharges(data) {
  const confections = data.confections
  let tabelRows = ``
  let index = 1

  const uniqueConfections = confections
    .filter((v, i, a) => a.findIndex((t) => t.pallet_code === v.pallet_code) === i)
    .sort((a, b) => a.pallet_code - b.pallet_code)

  uniqueConfections.forEach((element) => {
    tabelRows += `<tr class="border-b border-x [&>*]:border-black">
    <td class="border-r px-2 py-2">${index}</td>
    <td class="border-r px-2 py-2">${element.pallet_code ?? ''}</td>
    <td class="border-r px-2 py-2">${element.final_product?.variety?.name ?? ''}</td>
    <td class="border-r px-2 py-2">${element.temperature ?? ''}</td>
    <td class="border-r px-2 py-2"> </td>
  </tr>`
    index++
  })

  return ` <div class="pdf-font w-[406.46px] text-[8px]">
      <div class="h-[591.4175px] p-2 flex flex-col">
        <div class="grid grid-cols-2 gap-2">
            <span class="w-full">Date : ${dayjs(data.added_at).format(DATE_FORMAT)}</span>
            <span class="w-full">Matricule : ${data.vehicle.registration_nbr}</span>
            <span class="w-full">Heure début chargement : ${confections[0].shipped_at ?? ''}</span>
            <span class="w-full">Heure fin chargement : ${confections.slice(-1).shipped_at ?? ''}</span>
        </div>
        <div class="mt-8">
          <table class="w-full text-center text-[6px] [&>*]:border-black">
            <thead class="uppercase border-t border-x border-black bg-gray-100">
              <tr class=" [&>*]:border-black">
                <th scope="col" class="px-2 border-r py-1">
                  Order Pallette
                </th>
                <th scope="col" class="px-2 border-r py-1">
                  N° de Pallette
                </th>
                <th scope="col" class="px-2 border-r py-1">
                  Variété
                </th>
                <th scope="col" class="px-2 border-r py-1">
                  Température Départ
                </th>
                <th scope="col" class="px-2 py-1">
                  Température Arrivée
                </th>
              </tr>
            </thead>
            <tbody class="border [&>*]:border-black"">
              ${tabelRows}
            </tbody>
          </table>
        </div>
        <div class="grid grid-cols-2 gap-8 mt-8">
            <span class="w-full font-bold">Visa Responsable charge :</span>
            <span class="w-full font-bold">Visa Chauffeure :</span>
        </div>
      </div>
    </div>
  `
}
