import { getCompanyLogo } from '@/helpers'
import JsBarcode from 'jsbarcode'

export function getEmployeeCard(employee, company, profileImg, docType, lastRow) {
  const { firstname, lastname, uid, base_salary, birth_date, cin, cnss_nbr, hiring_date, type, mission } =
    employee

  const img = document.createElement('img')

  JsBarcode(img, uid, { displayValue: false, margin: 0, format: 'CODE128B' })

  return `<div class="${
    lastRow ? 'h-[111px]' : 'h-[112px]'
  } border border-black border-dashed	col-span-1 mb-[4px] relative text-[6px] overflow-hidden p-1">
    <div class="grid grid-cols-4 gap-0 z-10 relative">
      <div class="col-span-2 text-start tracking-widest text-[5px]" style="font-weight: 700"
      >CARTE DE TRAVAIL ${docType === 'card' ? 'SAISONNIER' : ''}</div>
      <div class="col-span-2 flex justify-end">
        <img class="h-4 object-contain" src="${getCompanyLogo()}" />
      </div>
      <div class="col-span-4 text-end text-[4px]">${company.address ?? ''}</div>
      <div class="col-span-3 pb-[4px]">
        <div class="flex item-center">
          <div class="bg-center ml-1 border border-black">
            <img class="h-6 w-6" src="${profileImg}" />
          </div>
          <div class="ml-2 mt-2 flex-grow tracking-widest" style="font-weight: 700">${firstname} ${lastname}</div>
        </div>
      </div>
      <div class="col-span-1 text-end">
        <div class="text-[4px] text-end">
          <div>CNSS:${type.cnss_affiliation ?? ''}</div>
          <div>ASSURANCE: ${company?.work_accident_insurance}</div>
        </div>
      </div>
  
      <div class="col-span-2 text-[4px] tracking-wide">
        <div class="text-[5px] tracking-widest" style="font-weight: 700">${mission?.label ?? ''}</div>
        <div>D.Entrée : Voir Contrat</div>
        <div>D.Anciennté : ${hiring_date ?? ''}</div>
        <div>CIN : ${cin ?? ''}</div>
        <div>CNSS : ${cnss_nbr ?? ''}</div>
        <div>Ne le : ${birth_date ?? ''}</div>
        ${docType === 'card' ? `<div>Salaire de base : ${base_salary ?? ''} dhs</div>` : ''}
      </div>
      <div class="col-span-2 mt-2">
        <div class="w-16">
          <img class="h-6 w-full" src="${img.src}" />
          <div class="text-center text-[7px] mt-2" style="font-weight: 700">${uid ?? ''}</div>
        </div>
      </div>
      </div>
    <div class="absolute top-0 left-0 h-[27%] w-full z-0"></div>
  </div>`
}
