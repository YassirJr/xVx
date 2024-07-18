import { i18n } from '@/plugins'
import dayjs from 'dayjs'
import store from '@/store'

const socialCategories = store.getters['employee/socialCategories']

export function getSeasonalContractSenegal(employee, company, lastIndex) {
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
    departure,
    base_salary,
    social_category,
  } = employee
  const minSalary = socialCategories.find(({ value }) => value == social_category)?.minSalary
  const sursalaire = base_salary - minSalary

  return `<div class="times-roman w-[406.46px] bg-white text-[9px]"><div class="h-[591.4175px] p-2">
  <h1 class="text-center font-bold">Contrat de Travail Saisonnier</h1>
  <p class="mb-2">Entre les soussignés,</p>
  <p>
    <span class="font-bold">La société ${company.name}</span>
    , dont le siège se trouve à ${company.address} représentée aux fins des présentés par Monsieur
    Geraldres Karel Maria Van Oers, en qualité de Gérant
  </p>
  <p>Ci- après dénommé l’« Employeur »</p>
  <p class="mb-2">D’une part,</p>
  <p>Et</p>
  <div class="grid grid-cols-2">
    <p class="col-span-1">Monsieur :</p>
    <p class="col-span-1">${lastname} ${firstname}</p>
    <p class="col-span-1">Né le :</p>
    <p class="col-span-1">${birth_date} à ${place_of_birth}</p>
    <p class="col-span-1">Nationalité :</p>
    <p class="col-span-1">Sénégalaise</p>
    <p class="col-span-1">Résidence habituelle :</p>
    <p class="col-span-1">${address}</p>
    <p class="col-span-1">Situation matrimoniale :</p>
    <p class="col-span-1">${i18n.global.t(family_status)}</p>
  </div>
  <p>Ci- après dénommé l’« Employé »</p>
  <p>D’autre part,</p>
  <p class="mb-2">Il a été convenu ce qui suit :</p>
  <p>
    Monsieur
    <span class="font-bold">${lastname} ${firstname}</span>
    est engagé par La société ${company.name} dans les conditions précisées ci-après :
  </p>
  <h2 class="mt-2 font-bold">Article - 1 : Textes de référence</h2>
  <p>Le présent Contrat est régi par les textes suivants :</p>
  <ul class="list-disc">
    <li>Loi 97-17 du 1er décembre 1997 portant sur le Code du travail du Sénégal ;</li>
    <li>
      Le décret 70-180 du 20 février 1970 fixant les conditions particulières d’emploi du travailleur
      journalier et du travailleur saisonnier ;
    </li>
    <li>Ensemble des textes règlementant les professions agricoles et assimilées</li>
    <li>La convention collective nationale ; interprofessionnelle du 30 décembre 2019 ;</li>
    <li>Le règlement intérieur de la Société.</li>
  </ul>
  <h2 class="mt-2 font-bold">Article - 2 : Nature et durée du Contrat</h2>
  <p>
    Par le présent Contrat de travail saisonnier, l’Employeur embauche L’Employé pour une durée déterminée
    allant du ${contract_date} au ${end_contract_date}
  </p>
  <h2 class="mt-2 font-bold">Article - 3 : Fonctions et classification professionnelle</h2>
  <p>
    L’Employé exercera les fonctions ${
      mission.label
    }. Il est classé à la catégorie ${social_category} de la Classification
    des emplois des professions agricoles.
  </p>
  <h2 class="mt-2 font-bold">Article - 4 : Lieu de Travail et Mobilité</h2>
  <p>
    L’Employé exécutera ses fonctions à ${company.name}, dans la Région de ${
      departure.label
    }. L’employé accepte par avance
    d’être déplacé temporairement ou muté dans un autre établissement de l’entreprise. Dans ce cas
    l’employeur devra informer le travailleur et lui fournir les moyens nécessaires et garantir les
    conditions de séjour décent au travailleur, en nature et en compensation.
  </p>
</div><div class="${lastIndex ? 'h-[590px]' : 'h-[591.4175px]'}  p-2">
<h2 class="mt-2 font-bold">Article - 5: Horaires de travail et rémunération</h2>
<p>
  La durée hebdomadaire de travail est de quarante-huit (48) heures. L'employé prendra une pause
  journalière, qui sera rémunérée comme temps de travail et bénéficie d'un repos hebdomadaire de 24
  heures consécutives.
</p>
<p>En contrepartie de ses services, l’Employé percevra un salaire mensuel réparti comme suit :</p>
<div class="grid grid-cols-2 font-bold pl-4 py-2">
  <div class="col-span-1">Salaire de base :</div>
  <div class="col-span-1">${minSalary} F CFA</div>
  <div class="col-span-1">Sursalaire :</div>
  <div class="col-span-1">${sursalaire} F CFA</div>
  <div class="col-span-1">Salaire brut mensuel :</div>
  <div class="col-span-1">378 Frs CFA</div>
</div>
<p>
  Pour des nécessités de service, l’employé pourrait être amené à effectuer des heures supplémentaires.
  Dans cette éventualité, les heures effectuées seront rémunérées conformément aux dispositions
  réglementaires en vigueur.
</p>
<h2 class="mt-2 font-bold">Article - 6: Congés payés</h2>
<p>
  La durée des congés payés de l’employé, l’allocation de congé ou l’indemnité compensatrice de congé en
  tenant lieu, seront respectées et acquittées conformément aux dispositions réglementaires en vigueur
  au Sénégal.
</p>
<h2 class="mt-2 font-bold">Article - 7: Prévoyance Retraite- Maladie – Sécurité Sociale</h2>
<p>
  Par les soins de l’employeur, l’Employé sera affilié auprès des Institutions en charge des régimes de
  retraite, de couverture médicale, de prestations familiales, d’accident de travail et des maladies
  professionnelles.
</p>
<h2 class="mt-2 font-bold">Article - 8: Exclusivité</h2>
<p>
  Il est fait obligation à l’Employé de consacrer son temps à son activité auprès de la Société et de
  respecter les instructions de la direction. En particulier, il s'interdit toute activité de nature à
  concurrencer la Société ou de s’intéresser à des sociétés susceptibles de la concurrencer.
</p>
<p>
  Il lui est formellement interdit de percevoir toute autre forme de rétribution autre que la
  rémunération qui lui est payée par la Société.
</p>
<h2 class="mt-2 font-bold">Article - 9: Confidentialité</h2>
<p>
  L’Employé s’engage à ne révéler même après son départ, aucune information ou donnée acquise dans le
  cadre de l’exécution de son activité professionnelle.
</p>
<h2 class="mt-2 font-bold">Article - 10: Respect des règles</h2>
<p>
  L’Employé s’engage à respecter les règles de gestion, les procédures, la politique et le règlement
  intérieur de l‘entreprise.
</p>
<h2 class="mt-2 font-bold">Article - 11: Règlement des différends et Litiges</h2>
<p>
  Pour tout litige découlant de l’exécution, de contestation ou de l’interprétation du présent Contrat,
  les parties s’engagent à régler leur différend à l’amiable, avant toute saisine de l’instance
  judiciaire compétente en la matière.
</p>
<p class="text-end">Fait en quatre (4) exemplaires, ${company.address}, le ${dayjs(
    hiring_date,
    'DD-MM-YYYY',
  ).format('DD MMMM YYYY')}</p>
<div class="flex justify-between px-2 pt-2">
  <div>
    <div class="font-bold underline">L’Employé</div>
    <div>Lu et accepté</div>
  </div>
  <div class="font-bold underline">L’Inspecteur du Travail</div>
  <div class="font-bold underline">L’Employeur</div>
</div>
</div></div>`
}
