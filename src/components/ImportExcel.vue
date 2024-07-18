<template>
  <div class="flex">
    <el-upload
      action=""
      :on-change="onImportDataChange"
      :auto-upload="false"
      :show-file-list="false"
      :accept="acceptedFiles"
      :disabled="disabled"
    >
      <el-button type="primary" :disabled="disabled">
        <i-el-upload class="mr-2" />
        {{ $t('import') }}
      </el-button>
    </el-upload>
    <div v-if="modelData">
      <el-button class="ml-2" type="success" text @click="exportTemplate()">
        <i-el-download class="mr-2" />
        {{ $t('model') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { read, writeFile, utils } from 'xlsx'
import { BANK_STATEMENT_REGEX } from '@/constants'

export default {
  props: {
    disabled: {
      default: true,
      type: Boolean,
    },
    modelData: {
      default: () => {},
      type: Object,
    },
    colsNbr: {
      default: null,
      type: Number,
    },
    validationRow: {
      default: () => {},
      type: Function,
    },
  },
  emits: ['loading', 'importChange', 'errorChange'],
  data() {
    return {
      dataErrors: {},
      acceptedFiles: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ].toString(),
    }
  },
  computed: {
    ...mapGetters('employee', ['employees']),
    ...mapGetters('bank', ['banks']),

    isErrorsExist() {
      return Object.keys(this.dataErrors).length != 0
    },
  },
  created() {
    this.fetchAllEmployees({ get: ['id,uid,firstname,lastname,type_id'] })
    this.fetchBanks()
  },
  methods: {
    ...mapActions('employee', ['fetchAllEmployees']),
    ...mapActions('bank', ['fetchBanks']),

    onImportDataChange({ raw }) {
      if (this.acceptedFiles.includes(raw.type)) {
        const reader = new FileReader()

        reader.onloadend = (e) => {
          const wb = read(e.target.result, { type: 'binary', cellDates: true })
          const sheet = wb.Sheets[wb.SheetNames[0]]
          const range = utils.decode_range(sheet['!ref'])
          let data = []

          for (let row = range.s.r + 1; row <= range.e.r; row++) {
            let dataRow = []
            for (let col = range.s.c; col <= range.e.c; col++) {
              const ref = utils.encode_cell({ r: row, c: col })
              const value = sheet[ref]?.v
              dataRow.push({ ref, value })
            }
            data.push(dataRow)
          }
          this.validateData(data)
        }

        reader.readAsBinaryString(raw)
      }
    },
    validateData(data) {
      this.$emit('loading', true)
      setTimeout(() => {
        if (data[0].length < this.colsNbr) {
          this.dataErrors = { invalidLength: true }
        } else {
          const [validData, invalidData] = data.reduce(
            ([valid, invalid], currVal) => {
              const { isRowInvalid, processedRow } = this.validationRow(currVal, this.chooseValidator)

              if (isRowInvalid) {
                invalid.push(processedRow)
              } else {
                valid.push(processedRow)
              }
              return [valid, invalid]
            },
            [[], []],
          )

          if (validData.length < data.length) {
            this.dataErrors = { invalidLength: false, rows: invalidData }
          } else {
            this.dataErrors = {}
            this.$emit('importChange', validData)
          }
        }
        this.$emit('errorChange', this.dataErrors)
        this.$emit('loading', false)
      }, 150)
    },
    exportTemplate() {
      const workbook = utils.book_new()
      const worksheet = utils.json_to_sheet(this.modelData.rows)

      //add comments to excel sheet
      this.modelData.comments.forEach((comment) => {
        const ref = utils.encode_cell({ r: 0, c: comment.col })

        if (!worksheet[ref].c) worksheet[ref].c = []
        worksheet[ref].c.push({ a: 'N.B', t: comment.msg })
      })

      utils.book_append_sheet(workbook, worksheet, 'sheet')
      writeFile(workbook, `${this.$t(this.$route.name)}.xlsx`)
    },
    validateEmployee(uid) {
      return this.employees.find((el) => el.uid == uid)
    },
    validateValue(value) {
      return typeof value == 'number' ? value : false
    },
    validateCnssNbr(value) {
      return typeof value == 'number' && value?.toString().length == 9 ? value : false
    },
    validateBank(value) {
      return this.banks.some(({ id }) => id == value) ? value : false
    },
    validateBankStatement(value) {
      const pattern = BANK_STATEMENT_REGEX()
      return pattern.test(value) ? value : false
    },
    validateCardNbr(value) {
      return typeof value == 'number' ? value : false
    },
    validateStatus(value) {
      return value === 0 || value === 1 ? `${value}` : false
    },
    validateDatetime(value) {
      return this.$dayjs(value).isValid() ? this.$dayjs(value).utc() : false
    },
    chooseValidator(name) {
      switch (name) {
        case 'employee':
          return this.validateEmployee
        case 'value':
          return this.validateValue
        case 'cnss_nbr':
          return this.validateCnssNbr
        case 'bank_id':
          return this.validateBank
        case 'bank_statement':
          return this.validateBankStatement
        case 'card_nbr':
          return this.validateCardNbr
        case 'status':
          return this.validateStatus
        case 'datetime':
          return this.validateDatetime
        default:
          break
      }
    },
  },
}
</script>
