import { getEmployeeCardSenegal } from './employeeCardSenegal'
import { getEmployeePointingBadge } from './employeePointingBadge'
import { getEmployeeCard } from './employeeCard'
import { getEmployeeContract } from './employeeContract'
import { getEmployeeAptitude } from './employeeAptitude'
import { getEmployeePayrollCheck } from './employeePayrollCheck'
import { getSeasonalContractSenegal } from './seasonalContractSenegal'
import { getCddSenegal } from './cddSenegal'
import { getDmtSenegal } from './dmtSenegal'
import { getPayslipSenegal } from './payrollSenegal'
import { isQFS } from '@/helpers'
import { getEmployeePointingCard } from './employeePointingCard'

export function getEmployeeHtmlDoc(data) {
  const { employees, company, docType, logo, profileImg, orientation, payClosure } = data
  let element = ``
  let document

  for (let i = 0; i < employees.length; i++) {
    let lastIndex = i === employees.length - 1
    let lastRow = lastIndex || i === employees.length - 2

    if (docType === 'card-senegal') {
      element += getEmployeeCardSenegal(employees[i], company, profileImg, lastRow)
    } else if (docType === 'pointing-badge') {
      element += getEmployeePointingBadge(employees[i], profileImg, lastRow)
    } else if (docType === 'card' || docType === 'card-permanent') {
      element += getEmployeeCard(employees[i], company, profileImg, docType, lastRow)
    } else if (docType === 'pointing-card') {
      element += getEmployeePointingCard(employees[i], profileImg, lastRow)
    } else if (docType === 'aptitude-file') {
      element += getEmployeeAptitude(employees[i], lastIndex)
    } else if (docType === 'contract') {
      element += getEmployeeContract(employees[i], company, lastIndex)
    } else if (docType === 'payroll-check') {
      if (isQFS) {
        let payslipTemplate = getPayslipSenegal(employees[i], company, payClosure)

        if (orientation === 'portrait') {
          element += `<div class="pdf-font w-[426px] m-[10px]">
            <div class="${lastIndex ? 'h-[610px]' : 'h-[621.4175px]'}">
              ${payslipTemplate}
            </div>
          </div>`
        } else if (orientation === 'landscape') {
          element += `<div class="pdf-font col-span-1 ${
            lastIndex ? 'h-[440px]' : 'h-[446.46px]'
          } ">${payslipTemplate}</div><div class="col-span-1"></div>`
        }
      } else {
        let payrollCheck = getEmployeePayrollCheck(employees[i], company, logo, orientation, payClosure)

        if (orientation === 'portrait') {
          element += `<div class="p-2 text-[8px] w-[446.46px]
          ${lastIndex ? 'h-[620px]' : 'h-[631.4175px]'}">${payrollCheck}</div>`
        } else if (orientation === 'landscape') {
          element += `<div class="col-span-1 text-[7px]
          ${lastIndex || i === employees.length - 2 ? 'h-[430px]' : 'h-[446.46px]'}">
            ${payrollCheck}
          </div>`
        } else if (orientation === 'landscape-duplicated') {
          element += `<div class="w-[631.4175px] text-[7px] grid grid-cols-2
          ${lastIndex ? 'h-[430px]' : 'h-[446.46px]'}">
          <div class="col-span-1 ${lastIndex ? 'h-[430px]' : 'h-[446.46px]'}">${payrollCheck}</div>
          <div class="col-span-1 ${lastIndex ? 'h-[430px]' : 'h-[446.46px]'}">${payrollCheck}</div></div>`
        }
      }
    } else if (docType === 'seasonal-contract-senegal') {
      element += getSeasonalContractSenegal(employees[i], company, lastIndex)
    } else if (docType === 'cdd-senegal') {
      element += getCddSenegal(employees[i], company, lastIndex)
    } else if (docType === 'dmt-senegal') {
      element += getDmtSenegal(employees[i], company, lastIndex)
    }
  }

  switch (docType) {
    case 'card-senegal':
      element = `<div class="pdf-font w-[446.46px] m-auto grid grid-cols-2 gap-x-[50px] px-4">${element}</div>`
      document = { element, options: { margin: [26.4175, 0, 25, 0] }, init: { unit: 'px' } }
      break
    case 'pointing-badge':
      element = `<div class="pdf-font w-[446.46px] m-auto grid grid-cols-2 gap-x-[50px] px-4">${element}</div>`
      document = { element, options: { margin: [26.4175, 0, 25, 0] }, init: { unit: 'px' } }
      break
    case 'card':
      element = `<div class="pdf-font w-[446.46px] m-auto grid grid-cols-2 gap-x-[50px] px-4">${element}</div>`
      document = { element, options: { margin: [26.4175, 0, 25, 0] }, init: { unit: 'px' } }
      break
    case 'pointing-card':
      element = `<div class="pdf-font w-[446.46px] m-auto grid grid-cols-2 gap-x-[50px] px-4">${element}</div>`
      document = { element, options: { margin: [26.4175, 0, 25, 0] }, init: { unit: 'px' } }
      break
    case 'card-permanent':
      element = `<div class="pdf-font w-[446.46px] m-auto grid grid-cols-2 gap-x-[50px] px-4">${element}</div>`
      document = { element, options: { margin: [26.4175, 0, 25, 0] }, init: { unit: 'px' } }
      break
    case 'contract':
      document = { element, options: { margin: 20 }, init: { unit: 'px' } }
      break
    case 'aptitude-file':
      document = { element, options: {}, init: { unit: 'px' } }
      break
    case 'payroll-check':
      if (orientation === 'portrait') {
        element = `<div class="pdf-font w-[446px] h-fit text-[7px] grid-cols-1">${element}</div>`
      } else if (orientation === 'landscape') {
        element = `<div class="pdf-font w-[631.4175px] grid grid-cols-2">${element}</div>`
      }
      document = { element, options: {}, init: { unit: 'px', orientation } }
      break
    case 'seasonal-contract-senegal':
      document = { element, options: { margin: 20 }, init: { unit: 'px' } }
      break
    case 'cdd-senegal':
      document = { element, options: { margin: 20 }, init: { unit: 'px' } }
      break
    case 'dmt-senegal':
      document = { element, options: { margin: 20 }, init: { unit: 'px' } }
      break
    default:
      break
  }

  return { ...document, name: docType }
}
