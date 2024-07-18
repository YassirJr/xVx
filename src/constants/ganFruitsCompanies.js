import { isGanFruits } from '@/helpers'
import logo1 from '@/assets/images/gn-logos/1.webp'
import logo2 from '@/assets/images/gn-logos/2.webp'
import logo3 from '@/assets/images/gn-logos/3.webp'
import logo4 from '@/assets/images/gn-logos/4.webp'

export const GAN_FRUITS_COMPANIES = isGanFruits
  ? {
      1: {
        id: 1,
        label: 'ADOLAM SARL AU',
        address: 'CITE BADR SECTEUR B NR 189 SOUK EL ARBAA MAROC',
        logo: logo1,
        email: '',
        phone_nbr: '',
        exporter_nbr: '9708',
        if: '37608596',
        ice: '002301238000021',
        rc: '26363',
        tp: '21900548',
        rib: '225735068101206651011378',
      },
      2: {
        id: 2,
        label: 'GAN FRUITS SARL',
        address: '22 BOULEVARD ABDELMOUMEN RES SHEHRAZADE 3 PALMIERS<br/>CASABLANCA - MAROC -',
        logo: logo2,
        email: 'ganfruits@gmail.com',
        phone_nbr: '+(212) 6 61 05 25 25',
        exporter_nbr: '8300',
        if: '24881599',
        ice: '001977449000005',
        rc: '385439',
        tp: '34775461',
        rib: '225735068101205651011218',
      },
      3: {
        id: 3,
        label: 'GLOBAL FARMING MOROCCO SARL',
        address: 'Siège Social Souk El Larbaa<br/>Hay Badr E89 1er étage - Maroc',
        logo: logo3,
        email: 'gabriel@globalfarming.ma',
        phone_nbr: '+(212) 6 61 13 52 59',
        exporter_nbr: '106049',
        if: '50298762',
        ice: '002756078000026',
        rc: '27229',
        tp: '21980163',
        rib: '225735068101344651011439',
      },
      4: {
        id: 4,
        label: 'VITAL FROZEN',
        address: 'CITE BADR SECTEUR B NR 189 SOUK EL ARBAA MAROC',
        logo: logo4,
        email: '',
        phone_nbr: '',
        exporter_nbr: '105450',
        if: '50185840',
        ice: '002796061000095',
        rc: '27115',
        tp: '21901548',
        rib: '225735068101376651011418',
      },
    }
  : {}

export const GAN_FRUITS_COMPANIES_LIST = Object.values(GAN_FRUITS_COMPANIES)
