import { dayjs } from '@/plugins'
import { TIME_FORMAT, DATE_FORMAT } from '@/constants'
import { useReceptionStore } from '@/stores/reception'

const receptionStore = useReceptionStore()

export function getGnDeliveryReceipt(receptions, internal = receptionStore.type.internal) {
  let tbody = ''
  let html = ''

  receptions.forEach((reception, index, array) => {
    let pallets = reception.pallets
    let lastIndex = index === array.length - 1

    const groupedPallets = pallets
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

    let firstDilivery = Object.values(groupedPallets)[0]

    Object.values(groupedPallets).map(
      (pallet) =>
        (tbody += `
        <tr class="text-[5px]">
          <td class="border-x border-b border-black py-0.5 text-center">${pallet.variety_name}</td>
          <td class="border-r border-b border-black py-0.5 text-center">${pallet.variety_field}</td>
          <td class="border-r border-b border-black py-0.5 text-center">${pallet.cultivation_code}</td>
          <td class="border-r border-b border-black py-0.5 text-center">9:00</td>
          <td class="border-r border-b border-black py-0.5 text-center">Caisse en plastique</td>
          <td class="border-r border-b border-black py-0.5 text-center">${pallet.total_nbr_boxes}</td>
          <td class="border-r border-b border-black py-0.5 text-center">${pallet.total_gross_weight}</td>
          <td class="border-r border-b border-black py-0.5 text-center">${reception?.code ?? ''}</td>
          <td class="border-r border-b border-black py-0.5 text-center">Oui</td>
        </tr>`),
    )

    html += `
  <div class="pdf-font ${lastIndex ? 'h-[419px]' : 'h-[420px]'} w-[298px] text-[5px] p-3">
  <div class="grid grid-cols-[1fr_.5fr] border border-black w-full">
    <div
      class="flex items-center justify-center text-[7px] font-bold uppercase border-r border-black">
      BON DE LIVRAISON 
    </div>
    <div class="px-1 py-0.5">
      <div>Réf:SMQ Enr-32</div>
      <div>MAJ: ${dayjs(reception.added_at).format(DATE_FORMAT)}</div>
      <div>V02</div>
    </div>
  </div>
  <div class="grid grid-cols-3 gap-x-4 my-1">
    <div class="flex justify-between items-center">
      <span>Ferme: </span>
      <span>${firstDilivery?.site_name ?? '---'}</span>
    </div>
    <div class="flex justify-between items-center">
      <span>N°: </span>
      <span>${firstDilivery?.delivery_nbr ?? '---'}</span>
    </div>
    <div class="flex justify-between items-center">
      <span>Date de recolte: </span>
      <span>${dayjs(reception.arrival_hour).format(DATE_FORMAT)}</span>
    </div>
  </div>
  <table class="w-full">
  <thead class="uppercase border border-black text-bold  bg-gray-50 text-[4px]">
          <tr class="[&>*]:border-black [&>*]:py-1 [&>*]:border-r">
            <th scope="col" class="bg-gray-100 border-y border-l">Produit</th>
            <th scope="col" class="bg-gray-100 border-y">Variété</th>
            <th scope="col" class="bg-gray-100 border-y">N° parcelle</th>
            <th scope="col" class="bg-gray-100 border-y">H de Récolte</th>
            <th scope="col" class="bg-gray-100 border-y">Emballage</th>
            <th scope="col" class="bg-gray-100 border-y">Nbr caisses</th>
            <th scope="col" class="bg-gray-100 border-y">Quantité (Kg)</th>
            <th scope="col" class="bg-gray-100 border-y">N° voyage</th>
            <th scope="col" class="bg-gray-100 border-y">GGN</th>
          </tr>
        </thead>
  <tbody>
    ${tbody}
  <tbody>
  </table>

  <div class="my-1">
    Produit certifié Global Gap -GGN°: ${firstDilivery?.global_gap_number ?? '---'}
  </div>
  <div class="my-1">
    Dernier Traitement Phytosanitaire( DAR le plus Long)
  </div>

  <table>
      <thead class="bg-gray-50 text-[4px]">
        <tr>
          <th class="border-x border-t border-black bg-gray-50 px-1">DATE</th>
          <th class="border-r border-t border-black bg-gray-50 px-1">NOM COMMERCIAL</th>
          <th class="border-r border-t border-black bg-gray-50 px-1">MATIERE ACTIVE</th>
          <th class="border-r border-t border-black bg-gray-50 px-1">DOSE</th>
          <th class="border-r border-t border-black bg-gray-50 px-1">DAR</th>
          <th class="border-r border-t border-black bg-gray-50 px-1">PARCELLES</th>
          <th class="border-r border-t border-black bg-gray-50 px-1">HEURE FIN TRAITEMENT</th>
          <th class="border-r border-t border-black bg-gray-50 px-1">HEURE DEBUT RECOLTE</th>
          <th class="border-r border-t border-black bg-gray-50 px-1">DAR C/NC</th>
        </tr>
      </thead>

      <tbody>
        <tr class="border-t border-black py-1">
          <th class="border-x border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
        </tr>
        <tr class="border-t border-black py-1">
          <th class="border-x border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
        </tr>
        <tr class="border-y border-black py-1">
          <th class="border-x border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
          <th class="border-r border-black px-1">&nbsp;</th>
        </tr>
      </tbody>
    </table>
    
    <div class="grid grid-cols-[.5fr_1fr_.5fr] w-full mt-4">
    <div></div>
    <div class="border-t border-x border-black px-1 py-0.5">AGENT DE RECEPTION</div>
    <div></div>
    </div>
    <div class="grid grid-cols-[.5fr_1fr_.5fr] border border-black w-full mt-auto">
    <div class="text-center px-1 py-0.5">visa producteur</div>
    <div class="uppercase border-x border-black px-1 py-0.5">
      <div>HEURE D'ARRIVEE: ${dayjs(reception.arrival_hour).format(TIME_FORMAT)}</div>
      <div>VEHICULE N°: ${reception.vehicle.registration_nbr}</div>
      <div>CHAUFFEUR: ${reception.vehicle.transporter.name}</div>
      <div>ETAT CAMION:</div>
    </div>
    <div class="text-center px-1 py-0.5">
      visa station
    </div>
  </div>
  </div>`
  })
  return html
}
