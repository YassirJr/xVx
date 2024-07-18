import dayjs from 'dayjs'
import store from '@/store'
import { i18n } from '@/plugins'

export function getEmployeePayrollCheck(employeePayroll, company, logoCard, orientation, payClosure) {
  const { employee, mission, sections, payroll_data } = employeePayroll
  const natures = store.getters['payrollSection/natures'].map(({ value }) => value)
  const isPortrait = orientation == 'portrait'
  const paddingHeight = isPortrait ? 'py-1' : 'pt-0.5'
  const filteredSection = sections.filter(
    ({ id, payroll_slip, code, nature }) =>
      payroll_slip &&
      code !== 6000 &&
      (nature == natures[0] || nature == natures[1]) &&
      payroll_data[`section_${id}`] != 0,
  )
  const netSalarySection = sections.find(({ code }) => code == 6000)

  const startDate = dayjs(payClosure.start_date)
  const endDate = dayjs(payClosure.end_date)
  const period =
    endDate.diff(startDate, 'days') > 15
      ? `${dayjs()
          .month(payClosure.month - 1)
          .format('MMMM')} ${endDate.format('YYYY')}`
      : `${startDate.format('DD MM YYYY')} ${i18n.global.t('to')} ${endDate.format('DD MM YYYY')}`

  let payrollTable = `
    <div class="col-span-1 border-r border-black pl-0.5 ${paddingHeight}" >#</div>
    <div class="col-span-2 border-r border-black pl-0.5 ${paddingHeight}">Total Jours Travaillés</div>
    <div class="col-span-1 border-r border-black pl-0.5 ${paddingHeight}">${employee?.nbr_days ?? 0}</div>
    <div class="col-span-1 border-r border-black pl-0.5 ${paddingHeight}"></div>
    <div class="col-span-1 border-r border-black pl-0.5 ${paddingHeight}"></div>
    <div class="col-span-1 pl-0.5 ${paddingHeight}"></div>
  `

  filteredSection.forEach(({ id, code, label, nature, base_id, rate_id }) => {
    let baseValue = ''
    let rateValue = ''

    if (base_id) {
      let sectionBaseValue = payroll_data[`section_${id}_base_value`]
      baseValue = sectionBaseValue ? `${sectionBaseValue} %` : payroll_data[`section_${id}_base`] ?? ''

      if (typeof baseValue === 'number' && baseValue > 0) baseValue = baseValue.toFixed(2)
    }

    if (rate_id) {
      let sectionRateValue = payroll_data[`section_${id}_rate_value`]
      rateValue = sectionRateValue ? `${sectionRateValue} %` : payroll_data[`section_${id}_rate`] ?? ''

      if (typeof rateValue === 'number' && rateValue > 0) rateValue = rateValue.toFixed(2)
    }

    payrollTable += `<div class="col-span-1 border-r border-black pl-0.5 ${paddingHeight}" >
    ${code}
  </div>
  <div class="col-span-2 border-r border-black pl-0.5 ${paddingHeight}" >
    ${label}
  </div>
  <div class="col-span-1 border-r border-black pl-0.5 ${paddingHeight}" >
    ${baseValue}
  </div>
  <div class="col-span-1 border-r border-black pl-0.5 ${paddingHeight}" >
    ${rateValue}
  </div>
  <div class="col-span-1 border-r border-black pl-0.5 ${paddingHeight}" >
    ${nature == natures[0] ? payroll_data[`section_${id}`] : ''}
  </div>
  <div class="col-span-1 pl-0.5 ${paddingHeight}" >
    ${nature == natures[1] ? payroll_data[`section_${id}`] : ''}
  </div>`
  })

  let payrollInfo = `<div class="h-full p-1 bg-white pdf-font">
    <div class="flex justify-between">
      <div>
        <div>
          <img class="w-20" src="${logoCard}" />
          <div class="font-bold mt-1 text-[5px]">
            <div>
              <span>IF: ${company.tax_identification}</span> |
              <span>CNSS: ${employee.type.cnss_affiliation}</span> |
              <span>RC : ${company.trade_registry}</span>
            </div>
            <div>${company.address}</div>
          </div>
        </div>
      </div>
      <div class="w-40">
        <div class="font-bold flex flex-col items-end">
          <div class="tracking-widest">BULLETIN DE PAIE</div>
          <div>Période : De ${period}</div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 bg-gray-100 p-1 my-2 rounded">
      <div class="col-span-1">N° ${employee.uid ?? ''}</div>
      <div class="col-span-1">${employee.firstname + ' ' + employee.lastname}</div>
      <div class="col-span-1 tracking-widest">${mission.label ?? ''}</div>
      <div class="col-span-1">Adresse : ${employee.address}</div>
      <div class="col-span-1">CIN : ${employee.cin}</div>
      <div class="col-span-1">CNSS : ${employee.cnss_nbr ?? ''}</div>
      <div class="col-span-1">Date d’entrée : ${employee.hiring_date}</div>
    </div>
    <div class="border border-black">
      <div
        class="grid grid-cols-7 border-b border-black w-full bg-gray-100 h-8"
      >
        <div
          class="col-span-1 border-r border-black flex justify-center items-center"
        >
          Code
        </div>
        <div
          class="col-span-2 border-r border-black flex justify-center items-center"
        >
          Libellé
        </div>
        <div
          class="col-span-1 border-r border-black flex justify-center items-center"
        >
          Base
        </div>
        <div
          class="col-span-1 border-r border-black flex justify-center items-center"
        >
          Taux
        </div>
        <div
          class="col-span-1 border-r border-black flex justify-center items-center"
        >
          Gains
        </div>
        <div class="col-span-1 flex justify-center items-center">
          Retenus
        </div>
      </div>
      <div class="grid grid-cols-7 w-full">${payrollTable}</div>
    </div>
    <div class="h-4 border border-black mt-2 grid grid-cols-7">
      <div
        class="grow flex justify-center items-center border-r border-black col-span-6 bg-gray-100 font-bold"
      >
        Net à Payer
      </div>
      <div class="col-span-1 flex justify-center items-center pl-[1px]">
        ${payroll_data[`section_${netSalarySection.id}`] ?? ''}
      </div>
    </div>
  </div>`

  return payrollInfo
}
