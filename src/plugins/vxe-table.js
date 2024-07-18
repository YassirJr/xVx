import i18n from '@/plugins/i18n'
import VXETable from 'vxe-table'
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
import '@/assets/styles/vxe-table.scss'
import 'xe-utils'

VXETable.setup({
  i18n: (key, args) => i18n.global.t(key, args),
})

VXETable.use(VXETablePluginExportXLSX)

export default VXETable
