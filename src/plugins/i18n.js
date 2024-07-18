import languages from '@/lang'
import dayjs from '@/plugins/dayjs'
import { createI18n } from 'vue-i18n'

const locales = [
  {
    label: 'English',
    key: 'en',
  },
  {
    label: 'Français',
    key: 'fr',
  },
]

const locale = import.meta.env.VITE_APP_LANG ?? locales[1].key

dayjs.locale(locale)

const i18n = createI18n({
  locale,
  fallbackLocale: locales[0].key,
  messages: languages,
})

export const {
  global: { t },
} = i18n
export default i18n
