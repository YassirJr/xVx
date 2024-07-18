<template>
  <el-select v-model="periodType.employee_type_id" class="mr-2" clearable filterable @change="typeChanged()">
    <el-option v-for="(type, i) in types" :key="i" :label="type.name" :value="type.id"></el-option>
  </el-select>
  <el-select
    v-if="!hidePeriod"
    v-model="periodType.pay_closure_id"
    class="mr-2"
    clearable
    filterable
    :disabled="!Boolean(periodType.employee_type_id)"
  >
    <el-option
      v-for="(payClosure, i) in payClosures"
      :key="i"
      class="relative"
      :label="getLabelDateHelper(payClosure)"
      :value="payClosure.id"
    >
      <div>
        {{ getLabelDateHelper(payClosure) }}
        <span
          class="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full"
          :class="payClosure.status ? 'bg-green-400' : 'bg-red-400'"
        ></span>
      </div>
    </el-option>
  </el-select>
  <template v-if="isPayClosureActive">
    <div v-if="addDateSelect">
      <el-select v-model="select_date">
        <el-option
          v-for="chunk in dateChunks"
          :key="chunk.value"
          :label="chunk.label"
          :value="chunk.value"
        ></el-option>
      </el-select>
    </div>
    <div v-else-if="addDatePicker">
      <el-date-picker
        v-model="added_at"
        format="DD-MM-YYYY"
        :disabled-date="disabledDate"
        :default-value="defaultDate"
      />
    </div>
  </template>
  <div v-if="addProcessing && isProcessingActive" class="ml-3">
    <el-button v-can="processPermission" plain type="success" @click="launchProcessing()">
      {{ $t('launch-processing') }}
    </el-button>
  </div>
</template>
<script>
import { labelDate, isQFS, dateToChunks } from '@/helpers'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    addDatePicker: {
      type: Boolean,
      default: () => false,
    },
    addDateSelect: {
      type: Boolean,
      default: () => false,
    },
    addProcessing: {
      type: Boolean,
      default: () => false,
    },
    hidePeriod: {
      type: Boolean,
      default: () => false,
    },
    processPermission: {
      type: String,
      default: () => null,
    },
  },
  emits: ['payClosureChange', 'launchProcessing', 'employeeTypeChange'],
  data() {
    return {
      isQFS: isQFS,
      select_date: null,
      added_at: null,
      isPayClosureActive: false,
      selectedPayClosure: {},
      periodType: {
        employee_type_id: null,
        pay_closure_id: null,
      },
    }
  },
  computed: {
    ...mapGetters('employeeTypes', ['types']),
    ...mapGetters('payClosure', ['payClosures']),

    isProcessingActive() {
      if (this.addDatePicker) {
        return this.isPayClosureActive && this.added_at
      } else if (this.addDateSelect) {
        return this.isPayClosureActive && this.select_date !== null
      } else {
        return this.isPayClosureActive
      }
    },
    defaultDate() {
      return this.$dayjs(this.selectedPayClosure?.start_date).toDate()
    },
    dateChunks() {
      const payClosure = this.payClosures.find(({ id }) => id == this.periodType.pay_closure_id)
      const { start_date, end_date } = payClosure

      return dateToChunks({ start_date, end_date }).map(({ start_date, end_date }, i) => ({
        label: `S${i + 1} | ${start_date} > ${end_date}`,
        value: i,
      }))
    },
  },
  watch: {
    'periodType.employee_type_id'() {
      this.periodType.pay_closure_id = null
      this.isPayClosureActive = false
    },
    'periodType.pay_closure_id'(newVal) {
      this.added_at = null
      if (newVal) {
        this.selectedPayClosure = this.payClosures.find(({ id }) => id == this.periodType.pay_closure_id)
        this.isPayClosureActive = this.selectedPayClosure.status
      } else {
        this.selectedPayClosure = { status: false, id: null }
        this.isPayClosureActive = false
      }
      this.$emit('payClosureChange', this.selectedPayClosure)
    },
  },
  created() {
    this.fetchEmployeeTypes({ list: true })
  },
  methods: {
    ...mapActions('payClosure', ['fetchPayClosures']),
    ...mapActions('employeeTypes', ['fetchEmployeeTypes']),

    typeChanged() {
      const employee_type_id = this.periodType.employee_type_id
      if (employee_type_id)
        this.fetchPayClosures({ list: true, employee_type_id }).then((payClosures) => {
          this.$emit('employeeTypeChange', { payClosures, employee_type_id })
        })
    },
    disabledDate(time) {
      let start_date = this.$dayjs(this.selectedPayClosure.start_date)
      let end_date = this.$dayjs(this.selectedPayClosure.end_date)

      return !this.$dayjs(time).isBetween(start_date, end_date, 'day', '[]')
    },
    getLabelDateHelper(payClosure) {
      return labelDate(payClosure)
    },
    launchProcessing() {
      this.$emit('launchProcessing', {
        added_at: this.addDatePicker
          ? this.$dayjs(this.added_at).format()
          : this.$dayjs(this.selectedPayClosure.added_at).format(),
        id: this.selectedPayClosure.id,
        status: this.selectedPayClosure.status,
        week_index: this.select_date,
      })
    },
  },
}
</script>
