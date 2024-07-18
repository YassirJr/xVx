import { getCompanyLogo } from '@/helpers'
import dayjs from 'dayjs'

export function getEmployeeAptitude(employee, lastIndex) {
  const { firstname, lastname, uid, birth_date, hiring_date, mission } = employee

  return `<div class="pdf-font w-[446.46px] ${
    lastIndex ? 'h-[630px]' : 'h-[631.4175px]'
  } p-4 text-xs tracking-widest">
    <div class="w-full h-9 border border-black flex">
      <div
        class="w-24 border-r border-black flex justify-center items-center"
      >
        <img class="h-8 object-contain" src="${getCompanyLogo()}"/>
      </div>
      <div class="grow flex justify-center items-center">
        Fiche d’aptitude
      </div>
      <div class="w-24 border-l border-black text-center leading-[11px]">
        <div class="text-[9px]">F-MHF-07</div>
        <div class="text-[7px]">Version : 01</div>
        <div class="text-[7px]">${dayjs().format('DD/MM/YYYY')}</div>
      </div>
    </div>
    <div class="py-2 border-b-2 border-black">
      <div class="font-bold underline mb-4">Salarie :</div>
      <div class="flex">
        <div class="pr-1">Matricule:</div>
        <div class="relative">
          <div class="text-center absolute w-full font-bold">${uid}</div>
          <div class="text-gray-300">
            ...................................................................
          </div>
        </div>
      </div>
      <div class="flex">
        <div class="pr-1">Nom & Prénom:</div>
        <div class="relative">
          <div class="text-center absolute w-full font-bold">${firstname} ${lastname}</div>
          <div class="text-gray-300">
            ...................................................................
          </div>
        </div>
      </div>
      <div class="flex">
        <div class="pr-1">Date de naissance:</div>
        <div class="relative">
          <div class="text-center absolute w-full font-bold">${birth_date}</div>
          <div class="text-gray-300">
            ........................................................
          </div>
        </div>
      </div>
      <div class="flex">
        <div class="pr-1">Poste de travail:</div>
        <div class="relative">
          <div class="text-center absolute w-full font-bold">
          ${mission?.label ?? ''}
          </div>
          <div class="text-gray-300">
            ..............................................................
          </div>
        </div>
      </div>
      <div class="flex">
        <div class="pr-1">Date d'ambauche:</div>
        <div class="relative">
          <div class="text-center absolute w-full font-bold">${hiring_date}</div>
          <div class="text-gray-300">
            .....................................................
          </div>
        </div>
      </div>
    </div>
    <div class="py-2 border-b-2 border-black">
      <div class="font-bold underline mb-4">Nature de l’examen</div>
      <div class="grid grid-cols-3">
        <div class="col-span-1 flex h-5">
          <div class="w-5 h-4 mr-4 border border-black"></div>
          <div>Embauche</div>
        </div>
        <div class="col-span-1 flex h-5">
          <div class="w-5 h-4 mr-4 border border-black"></div>
          <div>Réintégration</div>
        </div>
        <div class="col-span-1 flex h-5">
          <div class="w-5 h-4 mr-4 border border-black"></div>
          <div>C.D.D</div>
        </div>
        <div class="col-span-3 flex h-5">
          <div class="w-5 h-4 mr-4 border border-black"></div>
          <div>Visite systématique</div>
        </div>
        <div class="col-span-3 flex h-5">
          <div class="w-5 h-4 mr-4 border border-black"></div>
          <div>Surveillance médicale spéciale</div>
        </div>
        <div class="col-span-3 flex h-5">
          <div class="w-5 h-4 mr-4 border border-black"></div>
          <div>Visite de reprise</div>
        </div>
        <div class="col-span-3 flex h-5">
          <div class="w-5 h-4 mr-4 border border-black"></div>
          <div>Visite spontanée</div>
        </div>
        <div class="col-span-3 flex h-5">
          <div class="w-5 h-4 mr-4 border border-black"></div>
          <div>Autre</div>
        </div>
      </div>
    </div>
    <div class="py-2 border-b-2 border-black">
      <div class="font-bold underline mb-4">Conclusion</div>
      <div class="flex h-5">
        <div class="w-5 h-4 mr-4 border border-black"></div>
        <div>
          Doit faire l’examen suivant :
          <span class="text-gray-300">........................................</span>
        </div>
      </div>
      <div class="flex h-5">
        <div class="w-5 h-4 mr-4 border border-black"></div>
        <div>APTE à son poste de travail.</div>
      </div>
      <div class="flex h-5">
        <div class="w-5 h-4 mr-4 border border-black"></div>
        <div>
          INAPTE temporairement : Reclassement :
          <span class="text-gray-300">.................</span>
        </div>
      </div>
      <div class="flex h-5">
        <div class="w-5 h-4 mr-4 border border-black"></div>
        <div>
          INAPTE définitivement : Reclassement :
          <span class="text-gray-300">.................</span>
        </div>
      </div>
    </div>
    <div>
      <div class="py-2 flex">
        <div class="font-bold underline mb-4 w-24">A REVOIR :</div>
        <div class="flex h-5 w-36">
          <div class="w-5 h-4 mr-4 border border-black"></div>
          <div>Tous les ans</div>
        </div>
        <div class="flex h-5 col-span-1">
          <div class="w-5 h-4 mr-4 border border-black"></div>
          <div>Tous les six mois</div>
        </div>
      </div>
      <div class="flex">
        <div class="pr-1">Fait le :</div>
        <div class="relative">
          <div class="text-center absolute w-full font-bold">${hiring_date}</div>
          <div class="text-gray-300">
            ......................................
          </div>
        </div>
      </div>
      <div class="text-center">Cachet et visa du médecin de travail</div>
    </div>
  </div>`
}
