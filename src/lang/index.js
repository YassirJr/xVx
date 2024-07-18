// En
import en from './en.json'
import vxeEn from './vxe/en.json'

// Fr
import fr from './fr.json'
import vxeFr from './vxe/fr.json'

const languages = {
  en: {
    ...en,
    ...vxeEn,
  },
  fr: {
    ...fr,
    ...vxeFr,
  },
}

export default languages
