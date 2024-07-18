import dayjs from 'dayjs'
import store from '@/store'
import { t } from '@/plugins'
import { DATE_FORMAT } from '@/constants/index'

export function getPayslipSenegal(employee, company, payClosure) {
  const payrollSections = employee.payroll_sections
  const payrollData = employee.payroll_data
  const natures = store.getters['payrollSection/natures'].map(({ value }) => value)

  const employeeDetails = employee.employee
  let filteredSections = employee.sections.filter(
    ({ id, payroll_slip, code, nature }) =>
      payroll_slip &&
      code !== 6000 &&
      (nature == natures[0] || nature == natures[1]) &&
      payrollData[`section_${id}`] != 0,
  )

  filteredSections.forEach((sec) => {
    if (sec.nature == 'withheld') {
      sec.withheld = payrollData[`section_${sec.id}`]
    } else {
      sec.gain = payrollData[`section_${sec.id}`]
    }

    sec.payrollSection = payrollSections[`section_${sec.id}`]

    sec.base = ''
    sec.rate = ''

    if (sec.base_id) {
      let sectionBaseValue = payrollData[`section_${sec.id}_base_value`]
      sec.base = sectionBaseValue ? `${sectionBaseValue} %` : payrollData[`section_${sec.id}_base`] ?? ''

      if (typeof baseValue === 'number' && sec.base > 0) {
        sec.base = sec.base.toFixed(2)
      }
    }

    if (sec.rate_id) {
      let sectionRateValue = payrollData[`section_${sec.id}_rate_value`]
      sec.rate = sectionRateValue ? `${sectionRateValue} %` : payrollData[`section_${sec.id}_rate`] ?? ''

      if (typeof sec.rate === 'number' && sec.rate > 0) {
        sec.rate = sec.rate.toFixed(2)
      }
    }
  })

  const netSalary = employee.sections.find(({ code }) => code == 6000)
  netSalary.gain = payrollData[`section_${netSalary.id}`]

  let tabelRows = ''

  filteredSections.forEach((sec) => {
    tabelRows += `<tr>
    <td class="border-r border-black pl-1 py-0.5">${sec.code ?? ''}</td>
    <td class="border-r border-black pl-1 py-0.5">${sec.label ?? ''}</td>
    <td class="border-r border-black pl-1 py-0.5">${sec.base ?? ''}</td>
    <td class="border-r border-black pl-1 py-0.5">${sec.rate ?? ''}</td>
    <td class="border-r border-black pl-1 py-0.5">${sec.gain ?? ''}</td>
    <td class="pl-1">${sec.withheld ?? ''}</td>
  </tr>`
  })

  const isMarried = employee.family_status == 'married' ? 0.5 : 0
  const nb = (1 + isMarried + employee.nbr_children * 0.5).toFixed(1)

  const startDate = dayjs(payClosure.start_date)
  const endDate = dayjs(payClosure.end_date)
  const period =
    endDate.diff(startDate, 'days') > 15
      ? `${dayjs()
          .month(payClosure.month - 1)
          .format('MMMM')} ${endDate.format('YYYY')}`
      : `${startDate.format('DD MM YYYY')} ${t('to')} ${endDate.format('DD MM YYYY')}`

  return `<div class="pdf-font h-full p-1">
  <div class="flex flex-col text-[7px]">
    <div class="grid grid-cols-2 gap-2">
      <!-- Header Section -->
      <div
        class="border border-black rounded-lg py-1 font-bold col-span-2 flex justify-center col-span-2"
      >
        ${t('payroll-slip')} ${period}
      </div>
      <!-- End Header Section -->

      <!-- Company Info Section -->
      <div class="border border-black rounded-lg p-2 font-bold">
        <div
          class="flex items-center justify-center text-[6px] uppercase mb-1"
        >
          ${company.name}
        </div>
        <ul class="flex flex-col gap-y-[4px] text-[5px] list-style-none">
          <li class="flex justify-between">
            <span>N° RCCM</span><span></span>
          </li>
          <li class="flex justify-between">
            <span>N° NINEA</span><span></span>
          </li>
          <li class="flex justify-between">
            <span>N° IPRES</span><span>${employeeDetails?.type?.cnss_affiliation}</span>
          </li>
        </ul>
      </div>
      <!-- End Company Info Section -->

      <!-- Employee Info Section -->
      <div class="border border-black rounded-lg p-2 text-[5px]">
        <div
          class="flex items-center justify-center text-[6px] font-bold uppercase mb-1"
        >
          ${employeeDetails.firstname + ' ' + employeeDetails.lastname} (${employeeDetails.cin})
        </div>
        <div
          class="flex justify-between mb-1"
        >
        <span class="font-bold">Function</span
        ><span class="text-right">${employee.mission.label}</span>
        </div>
        
        <div class="grid grid-cols-3 gap-x-3">
          <ul class="col-span-2 flex flex-col gap-y-[2px] list-style-none">
            <li class="flex justify-between">
              <span class="font-bold">Matricule</span><span>${employeeDetails.uid}</span>
            </li>
            <li class="flex justify-between">
              <span class="font-bold">Genre</span><span>${t(employeeDetails.gender) ?? ''}</span>
            </li>
            <li class="flex justify-between">
              <span class="font-bold">N° SECU</span><span>${employeeDetails.cnss_nbr ?? ''}</span>
            </li>
            <li class="flex justify-between">
              <span class="font-bold">Date Embauche</span
              ><span>${employeeDetails.hiring_date}</span>
            </li>
            <li class="flex justify-between">
              <span class="font-bold">Sit. Famille</span
              ><span>${t(employee.family_status) ?? ''}</span>
            </li>
            <li class="flex justify-between">
              <span class="font-bold">Date Naissance</span>
              <span>${dayjs(employeeDetails.birth_date).format(DATE_FORMAT) ?? ''}</span>
            </li>
            <li class="flex justify-between">
              <span class="font-bold">Cat</span><span>${t(employeeDetails.social_category) ?? ''}</span>
            </li>
            <li class="flex justify-between">
                <span class="font-bold">Nb. Parts TRIMF</span><span>1.0</span>
            </li>
          </ul>

          <ul class="flex flex-col gap-y-[2px] list-style-none">
            <li class="flex justify-between">
              <span class="font-bold">UEMOA</span><span>21</span>
            </li>
            <li class="flex justify-between">
              <span class="font-bold">Region</span><span>05</span>
            </li>
            <li class="flex justify-between">
              <span class="font-bold">Typ</span><span>${employeeDetails?.contract_type ?? ''}</span>
            </li>
            <li class="flex justify-between">
              <span class="font-bold">Enf</span><span>${employee.nbr_children}</span>
            </li>
            <li class="flex justify-between">
              <span class="font-bold">Nb</span><span>${nb}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- End Employee Info Section -->
    </div>

    <!-- Table -->
    <table class="border border-black col-span-2 text-[6px] h-fit mt-2">
      <thead>
        <tr class="font-bold border-b border-black">
          <td class="border-r border-black text-center">Code</td>
          <td class="border-r border-black text-center w-[40%]">libellé</td>
          <td class="border-r border-black text-center">Base</td>
          <td class="border-r border-black text-center">Taux</td>
          <td class="border-r border-black text-center">Gains</td>
          <td class="text-center">Retenue</td>
        </tr>
      </thead>
      <tbody class="text-[5px] uppercase">
        ${tabelRows}
      </tbody>
    </table>
    <!-- End Table -->

    <!-- Signiture Section -->
    <div class="border border-black rounded-lg font-bold col-span-2 mt-2">
      <div class="px-2 py-0.5 flex justify-between text-[6px]">
        <span class="">NET A PAYER</span> <span>${netSalary.gain}</span>
      </div>
      <div
        class="border-y border-black w-full text-center mb-1 text-[5px] py-[2px]"
      >
        Attention: Ce bulletin doit être conservé sans limitation
      </div>

      <div class="px-2 pb-8 flex justify-between text-[5px]">
        <span>Signature employé</span>
        <span>Signature employeur</span>
      </div>

      <div class="px-3 pb-1 flex justify-end text-[5px]">
        <span class="pr-0.5">N° feuille</span><span> 1</span>
      </div>
    </div>
    <!-- End Signiture Section -->
  </div>
</div>`
}
