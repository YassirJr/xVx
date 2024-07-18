import { i18n } from '@/plugins'

export function getDmtSenegal(employee, company, lastIndex) {
  const {
    firstname,
    lastname,
    birth_date,
    place_of_birth,
    family_status,
    address,
    hiring_date,
    contract_date,
    end_contract_date,
    mission,
    social_category,
    gender,
    nbr_children,
    cin,
    base_salary,
  } = employee

  return ` <div class="times-roman w-[406.46px] bg-white text-[7px]">
    <div class="h-[591.4175px] p-0.5">
    <div class="grid grid-cols-5">
      <div class="col-span-4 p-2">
        <h3 class="text-center">DECLARATION DE MOUVEMENT DU TRAVAILLEUR</h3>
        <div class="grid grid-cols-5">
          <div class="col-span-1"></div>
          <div class="col-span-2 flex">
            <div class="min-w-max">N°</div>
            <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
          </div>
          <div class="col-span-2 flex">
            <div class="min-w-max">du</div>
            <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
          </div>
        </div>
        <h3 class="text-center">REFERENCES</h3>
        <p>
          Article 222 (Alinéas 2, 3, 4, 5) du Code du Travail (loi n° 97-17 du 1er déc. 1997) Arrêté
          ministériel n° 7301 du 17 mai 1963 déterminant les modalités des déclarations de mouvement de
          travailleurs (J.O. 22 juin 1963, p 285)
        </p>
      </div>
      <div class="col-span-1 border-l border-b border-black mb-2 p-2">
        Cachet et raison sociale de l'employeur
      </div>
    </div>
    <div class="grid grid-cols-2 border border-black">
      <div class="col-span-1 p-2">N° d'immatriculation du travailleur au fichier central</div>
      <div class="col-span-1 pr-1">
        <div class="border-b border-l border-r border-black">
          <div class="grid grid-flow-col auto-cols-fr h-1.5">
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-transparent"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-transparent"></div>
            <div class="col-span-1 border-r border-transparent"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-transparent"></div>
            <div class="col-span-1 border-r border-transparent"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-transparent"></div>
            <div class="col-span-1 border-r border-transparent"></div>
            <div class="col-span-1 border-r border-transparent"></div>
            <div class="col-span-1 border-r border-transparent"></div>
            <div class="col-span-1 border-r border-transparent"></div>
            <div class="col-span-1 border-r border-transparent"></div>
          </div>
          <div class="grid grid-flow-col auto-cols-fr h-4">
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-black"></div>
            <div class="col-span-1 border-r border-transparent"></div>
          </div>
        </div>
        <div class="grid grid-flow-col auto-cols-fr h-4 pt-1">
          <div class="col-span-1 text-center">A</div>
          <div class="col-span-2 text-center">B</div>
          <div class="col-span-1"></div>
          <div class="col-span-2 text-center">C</div>
          <div class="col-span-1"></div>
          <div class="col-span-1 text-center">D</div>
          <div class="col-span-1"></div>
          <div class="col-span-1 text-center">E</div>
          <div class="col-span-1"></div>
          <div class="col-span-4 text-center">F</div>
          <div class="col-span-1 border-r border-transparent"></div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2">
      <div class="col-span-1">
        <h4 class="font-bold pb-1">OBJET DE LA PRESENTE DECLARATION</h4>
        <div class="grid grid-cols-2">
          <div class="col-span-1">- Embauchage</div>
          <div class="col-span-1">- Licenciement</div>
          <div class="col-span-2">- Expiration normale du contrat</div>
          <div class="col-span-1">- Démission</div>
          <div class="col-span-1">- Mutation</div>
          <div class="col-span-2">- Changement de catégorie professionnelle</div>
          <div class="col-span-2">- Modification du contrat de travail</div>
          <div class="col-span-2">- Changement de situation de famille</div>
          <div class="col-span-2">- Changement de résidence habituelle</div>
          <div class="col-span-1">- Changement d'emploi</div>
          <div class="col-span-1">- Décès</div>
        </div>
      </div>
      <div class="col-span-1">
        <p>
          (Rayer les mentions inutiles et encadrer la mention valable à compléter éventuellement dans le
          blanc ci-dessous)
        </p>
        <div class="py-2 mb-1 border border-black text-center font-bold">IMMATRICULATION</div>
        <p>
          Si le travailleur n'a pas encore été immatriculé, la mention "Immatriculation" devra être portée
          dans le blanc ci-dessus
        </p>
      </div>
    </div>
    <div>
      <h3 class="font-bold">CONCERNANT LE TRAVAILLEUR</h3>
      <div class="grid grid-cols-5">
        <div class="col-span-2 pr-1 flex">
          <div class="min-w-max">Nom :</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">${lastname}</span>
        </div>
        <div class="col-span-2 pr-1 flex">
          <div class="min-w-max">Prénoms :</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">${firstname}</span>
        </div>
        <div class="col-span-1 pr-1 flex">
          <div class="min-w-max">Sexe :</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">
            ${i18n.global.t(gender)}
          </span>
        </div>
        <div class="col-span-1 pr-1 flex">
          <div class="min-w-max">Né le</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">${birth_date}</span>
        </div>
        <div class="col-span-1 pr-1 flex">
          <div class="min-w-max">à</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">${place_of_birth}</span>
        </div>
        <div class="col-span-1 pr-1 flex">
          <div class="min-w-max">Pays</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">SENEGAL</span>
        </div>
        <div class="col-span-2 pr-1 flex">
          <div class="min-w-max">Nationalité</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">SENEGALAISE</span>
        </div>
        <div class="col-span-2 pr-1 flex">
          <div class="min-w-max">Fils de (père)</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-2 pr-1 flex">
          <div class="min-w-max">et de (mère)</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-1 pr-1 flex">
          <div class="min-w-max">Groupe ethnique :</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-5 pr-1 flex">
          <div class="min-w-max">Adresse (très précise):</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">${address}</span>
        </div>
        <div class="col-span-2 pr-1 flex">
          <div class="min-w-max">Carte d'identité n°</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">${cin}</span>
        </div>
        <div class="col-span-2 pr-1 flex">
          <div class="min-w-max">délivrée à</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-1 pr-1 flex">
          <div class="min-w-max">le</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-5 pr-1 flex">
          <div class="min-w-max">Par</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-3 pr-1 flex">
          <div class="min-w-max">N° d'immatriculation à la C.C.P.E. - A.T.</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-2 pr-1 flex">
          <div class="min-w-max">N° d'immatriculation à l'A.G.R.O.M.</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-5 pr-1 flex">
          <div class="min-w-max">Situation de famille ( marié - divorcé - veuf )</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">
            ${i18n.global.t(family_status)}
          </span>
        </div>
        <div class="col-span-5 pr-1 flex">
          <div class="min-w-max">Nom de l'époux :</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-2 pr-1 flex">
          <div class="min-w-max">Nombre d'enfants à charge :</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">${nbr_children}</span>
        </div>
        <div class="col-span-3 pr-1 flex">
          <div class="min-w-max">Noms des enfants à charge :</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-5 pr-1 flex">
          <span class="pl-1 font-bold w-full border-b border-black border-dotted h-2.5"></span>
        </div>
        <div class="col-span-5 pr-1 flex">
          <div class="min-w-max">Date d'entrée dans l'établissement :</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">${hiring_date}</span>
        </div>
        <div class="col-span-5 pr-1 flex">
          <div class="min-w-max">
            N° et date de la déclaration d'embauche effectuée lors de l'engagement :
          </div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-2 pr-1 flex">
          <div class="min-w-max">Profession :</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">${mission.label}</span>
        </div>
        <div class="col-span-3 pr-1 flex">
          <div class="min-w-max">Emploi dans l'établissement :</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">${mission.label}</span>
        </div>
        <div class="col-span-3 pr-1 flex">
          <div class="min-w-max">Convention collective:</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-2 pr-1 flex">
          <div class="min-w-max">Catégorie:</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">${social_category}</span>
        </div>
        <div class="col-span-5 pr-1 flex">
          <div class="min-w-max">Eventuellement date du contrat :</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">${contract_date}</span>
        </div>
        <div class="col-span-5 pr-1 flex">
          <div class="min-w-max">
            N° et date du visa d'approbation par l'inspecteur du travail et de la sécurité sociale :
          </div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-3 pr-1 flex">
          <div class="min-w-max">N° et date du visa d'enregistrement à la section locale de :</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-2 pr-1 flex">
          <div class="min-w-max">du service de la main d'œuvre</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
        <div class="col-span-5 pr-1 flex">
          <span class="pl-1 font-bold w-full border-b border-black border-dotted h-2.5"></span>
        </div>
        <div class="col-span-5 pr-1 flex">
          <div class="min-w-max">Raison sociale et adresse précise de l'établissement de l'employeur :</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted">${company.name}</span>
        </div>
        <div class="col-span-5 pr-1 flex">
          <span class="pl-1 font-bold w-full border-b border-black border-dotted h-2.5"></span>
        </div>
        <div class="col-span-5 pr-1 flex">
          <div class="min-w-max">Activité de l'établissement :</div>
          <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 border border-black my-1 px-2 py-1">
      <div class="col-span-2">Durée du contrat :</div>
      <div class="col-span-1 flex">
        <div class="min-w-max">-à durée déterminée du</div>
        <span class="pl-1 font-bold w-full border-b border-black border-dotted">${contract_date}</span>
      </div>
      <div class="col-span-1 flex">
        <div class="min-w-max">AU</div>
        <span class="pl-1 font-bold w-full border-b border-black border-dotted">
          ${end_contract_date || ''}
        </span>
      </div>
      <div class="col-span-2">- ou à durée indéterminée</div>
      <div class="col-span-1">(Rayer la mention inutile et encadrer la mention correcte)</div>
      <div class="col-span-1 flex">
        <div class="min-w-max">Chantier de</div>
        <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
      </div>
    </div>
    <div class="grid grid-cols-2">
      <div class="col-span-2 flex">
        <div class="min-w-max">Nom et adresse du précedent employeur</div>
        <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
      </div>
      <div class="col-span-2">Si le travailleur bénéficie de l'article 107 du Code de Travail :</div>
      <div class="col-span-1 flex">
        <div class="min-w-max">-Lieu de résidence habituelle du travailleur :</div>
        <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
      </div>
      <div class="col-span-1 flex">
        <div class="min-w-max">Date d'entrée au Sénégal :</div>
        <span class="pl-1 font-bold w-full border-b border-black border-dotted"></span>
      </div>
    </div></div>
    <div class="${lastIndex ? 'h-[590px]' : 'h-[591.4175px]'} p-0.5">
      <h3 class="font-bold">STATUT MILITAIRE</h3>
      <h3 class="ml-32 pb-4">(Rayer les mentions inutiles)</h3>
      <div>- Classe de recrutement :</div>
      <div>- L'intéressé a-t-il effecué son service militaire ?</div>
      <div>- Armée d'appartenance : terre - air - mer :</div>
      <div>- Grade dans la réserve : Officer - Sous-officer - Troupe :</div>
      <h3 class="font-bold mt-4">DISPOSITIONS PARTICULIERES CONCERNANT L'ENGAGEMENT :</h3>
      <h3 class="ml-32 pb-4">(auquelles les partie ont expressément souscrit)</h3>
      <p class="pb-4">
        1) - Le salaire du travailleur sera celui fixé pour la
        <span class="font-bold">${social_category}</span>
        de catégorie de la Convention Collective des :
        <span class="font-bold text-white">xVxCOLE</span>
        en fonction d'un horaire de travail hebdomadaire de
      </p>
      <div>48 heures</div>
      <div>42 heures</div>
      <div>44 heures</div>
      <div>56 heures</div>
      <div class="my-2">
        Salaire de base:
        <span class="font-bold">${base_salary} FCFA</span>
      </div>
      <p class="h-14">2)</p>
      <p class="h-14">3)</p>
      <p class="h-14">4)</p>
      <p class="h-14">5)</p>
      <div class="flex justify-between mb-2">
        <div>
          <div>Signature du travailleur</div>
          (précédée de la mention manuscrite "pour accord")
        </div>
        <div>Signature de l'employeur</div>
      </div>
      <div>
        <h3 class="font-bold">P.S. - N.B. :</h3>
        <p>
          1) La déclaration de mouvement du travailleur est à établir en trois exemplaires dûment signés par
          l'employeur et le travailleur. Un exemplaire est temis au travailleur. Le second est consevé par
          l'employeur. Le troisième est déposé : dans l'intérieur de la section locale du Service de la
          Main-d'œuvre à l'inspection du Travail et de la Sécurité Sociale du ressort à DAKAR au Bureau
          central du Service de la Main-d'oeuvre
        </p>
        <p>
          2) L'employeur doit OBLIGATOIREMENT délivrer une ampliation de la déclaration du mouvement du
          travailleur
        </p>
        <p>3) Sont provisoirement exemptes de la déclaration de mouvement</p>
        <div>- Les travailleurs journaliers effectivement payés tous les jours</div>
        <div>- Les manœuvres ordinaires dans toutes les branches d'activité</div>
      </div>
    </div>
</div>`
}
