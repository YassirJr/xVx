import {
  DATE_FORMAT,
  TIME_FORMAT,
  DATE_TIME_FORMAT,
  DATE_TIME_ZONE_FORMAT,
  DATE_FORMAT_API,
} from './dateFormats'
import countries_en from './countries/en'
import countries_fr from './countries/fr'
import i18n from '@/plugins/i18n'
import { isQFS } from '@/helpers'
import { GAN_FRUITS_COMPANIES, GAN_FRUITS_COMPANIES_LIST } from './ganFruitsCompanies'

const language = i18n.global.locale

export const currencies = ['mad', 'eur', 'cfa']
export const countries = language == 'fr' ? countries_fr : countries_en

export const BANK_STATEMENT_REGEX = () => {
  return isQFS ? /^[a-zA-Z0-9]{24}$/ : /^[0-9]{24}/g
}

export {
  DATE_FORMAT,
  TIME_FORMAT,
  DATE_TIME_FORMAT,
  DATE_TIME_ZONE_FORMAT,
  DATE_FORMAT_API,
  GAN_FRUITS_COMPANIES,
  GAN_FRUITS_COMPANIES_LIST,
}
