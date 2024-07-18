import { dayjs } from '@/plugins'
import { TIME_FORMAT, DATE_FORMAT } from '@/constants'
import { useReceptionStore } from '@/stores/reception'
import logo5 from '@/assets/images/gn-logos/5.webp'

const receptionStore = useReceptionStore()

export function getGnReceptionReceipt(reception, lastIndex, internal = receptionStore.type.internal) {
  let tbody = ''

  const groupedPallets = reception.pallets
    .filter(({ type }) => type == internal)
    .reduce((result, obj) => {
      const key = obj.delivery_nbr + '-' + obj.cultivation.code

      if (!result[key]) {
        result[key] = {
          delivery_nbr: obj.delivery_nbr,
          site_name: obj.site.name,
          global_gap_number: obj.site.global_gap_number,
          variety_name: obj.unity.variety.name,
          variety_field: obj.cultivation?.variety_field?.label ?? '',
          cultivation_code: obj.cultivation.code,
          total_nbr_boxes: 0,
          total_gross_weight: 0,
          total_net_weight: 0,
        }
      }

      result[key].total_nbr_boxes += obj.nbr_boxes
      result[key].total_gross_weight += obj.gross_weight
      result[key].total_net_weight += obj.net_weight

      return result
    }, {})

  Object.values(groupedPallets).map(
    (pallet) =>
      (tbody += `
      <tr class="border-b border-x [&>*]:py-1 [&>*]:border-black [&>*]:border-r">
        <td scope="row" class="border-l">${pallet.delivery_nbr ?? '-'}</td>
        <td>${reception.code}A</td>
        <td>${pallet?.global_gap_number ?? ''}</td>
        <td>${pallet.site_name}</td>
        <td>${pallet.variety_name}</td>
        <td>${pallet.variety_field}</td>
        <td>${pallet.total_nbr_boxes}</td>
        <td>${pallet.total_gross_weight.toFixed(2)}</td>
        <td>${pallet.total_net_weight.toFixed(2)}</td>
        <td>${(pallet.total_net_weight / pallet.total_nbr_boxes).toFixed(2)}</td>
      </tr>`),
  )

  return `
  <div class="${lastIndex ? 'h-[419px]' : 'h-[420px]'} w-[298px]">
    <div class="grid grid-cols-2 text-[5px] p-3 font-medium">
      <div class="col-span-2 grid grid-cols-2">
        <div class="col-span-1">
        <img src="${logo5}" class="w-[40%]"/>
        </div>
        <div class="span-col-1 whitespace-nowrap font-bold align-text-top text-[7px] w-full">
          <span class="flex justify-end  font-bold w-full mr-2">BON DE RÉCEPTION <span class="inline-block mx-1">N° :</span>${
            reception.code
          }</span>
        </div>
      </div>
    <div class="col-span-1 self-end [&>*]:flex [&>*]:justify-between [&>*]:p-1 pr-4 mt-4">
      <div class="grid grid-cols-2 w-full ">
        <span class="whitespace-nowrap font-bold col-span-1 w-2/5">Date Réception : </span>
        <span class="col-span-1 w-3/5">${dayjs(reception.added_at)
          .format(DATE_FORMAT)
          .replaceAll('-', ' - ')}</span>
      </div>
      <div class="grid grid-cols-2 w-full ">
        <span class="whitespace-nowrap font-bold col-span-1 w-2/5">Heure Départ : </span>
        <span class=" col-span-1 w-3/5">${dayjs(reception.depart_hour)
          .format(TIME_FORMAT)
          .substring(0, 5)
          .replaceAll(':', ' : ')}</span>
      </div>
      <div class="grid grid-cols-2 w-full">
        <span class="whitespace-nowrap font-bold col-span-1 w-2/5">Heure Arrivée : </span>
        <span class=" col-span-1 w-3/5">${dayjs(reception.arrival_hour)
          .format(TIME_FORMAT)
          .substring(0, 5)
          .replaceAll(':', ' : ')}</span>
      </div>
    </div>
    <div class="col-span-1 [&>*]:p-1 mt-4">
      <div class="grid grid-cols-[.5fr,1fr] gap-y-4">
        <span class="whitespace-nowrap font-bold mr-3 col-span-1">Station :</span><span class="col-span-1">${
          reception.site.name
        }</span>
      </div>
      <div class="grid grid-cols-[.5fr,1fr] gap-y-4">
        <span class="whitespace-nowrap font-bold mr-3 col-span-1">Matricule :</span><span class="col-span-1">
          ${reception.vehicle.registration_nbr}
        </span>
      </div>
      <div class="grid grid-cols-[.5fr,1fr] gap-y-4">
        <span class="whitespace-nowrap font-bold mr-3 col-span-1">Transporteur :</span><span class="col-span-1">
          ${reception.vehicle.transporter.name}
        </span>
      </div>
    </div>
    <div class="col-span-2">
      <table class="text-center w-full mt-2 text-[3px]">
        <thead class="uppercase border border-black text-bold  bg-gray-50">
          <tr class="[&>*]:border-black [&>*]:py-1 [&>*]:border-r">
            <th scope="col">NB BL</th>
            <th scope="col">N° de Lot</th>
           <th scope="col">GGN</th>
            <th scope="col">Ferme</th>
            <th scope="col">Produit</th>
            <th scope="col">Variété</th>
            <th scope="col">Nbr caisse</th>
            <th scope="col">Poids brut</th>
            <th scope="col">Poids net</th>
            <th scope="col">Moyen/caisse</th>
          </tr>
        </thead>
        <tbody class=" [&>*]:border-black">
          ${tbody}
        </tbody>
      </table>
      <div class="py-4">
        <span class="flex items-center gap-2 pb-2"><span class="whitespace-nowrap" >Commentaire:</span><hr class="w-full border-dotted border-gray-400"/></span>
        <div class="grid grid-cols-2">
          <span class="col-span-1">visa Responsable Qualité : </span>
          <span class="col-span-1">visa Réception : </span>
        </div>
      </div>
    </div>
  </div>
</div>`
}
