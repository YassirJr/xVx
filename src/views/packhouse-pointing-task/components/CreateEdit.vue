<template>
  <el-dialog
    draggable
    :title="$t(pointing?.id ? 'edit-packhouse-pointing-tasks' : 'create-new-packhouse-pointing-tasks')"
    :model-value="$dialog.visible('create_edit_packhouse_pointing_task')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="75%"
    top="5vh"
    @close="$dialog.close('create_edit_packhouse_pointing_task')"
  >
    <div v-loading="loading">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="top"
        :validate-on-rule-change="false"
        @keypress.enter="save()"
      >
        <div class="grid grid-cols-2 gap-x-5">
          <div class="col-span-1">
            <el-form-item :label="$t('added-at')" prop="added_at">
              <el-date-picker
                v-model="form.added_at"
                class="!w-full"
                type="datetime"
                format="DD-MM-YYYY HH:mm"
                :disabled-date="disabledDate"
                :default-value="defaultDate"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('station')" prop="site_id">
              <el-select-v2
                v-model="form.site_id"
                class="w-full"
                clearable
                filterable
                :options="stations.map((el) => ({ ...el, label: el.name }))"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1 grid grid-cols-2 gap-x-5">
            <el-form-item :label="$t('transport')" prop="vehicle_id">
              <el-select-v2
                v-model="form.vehicle_id"
                class="w-full"
                clearable
                filterable
                :options="vehicles.map((el) => ({ ...el, label: el.registration_nbr }))"
                value-key="id"
              ></el-select-v2>
            </el-form-item>

            <el-form-item :label="$t('line')" prop="packhouse_line_id">
              <el-select-v2
                v-model="form.packhouse_line_id"
                class="w-full"
                clearable
                filterable
                :reserve-keyword="false"
                :options="packhouseLines.map((el) => ({ ...el, label: el.label }))"
                value-key="id"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-1">
            <el-form-item :label="$t('reason')" prop="reason_id">
              <el-select v-model="form.reason_id" clearable filterable class="w-full">
                <el-option
                  v-for="(reason, index) in reasons"
                  :key="index"
                  :label="reason.reason"
                  :value="reason.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-span-2 -mt-4">
            <el-divider></el-divider>
          </div>
          <div class="col-span-1"></div>
          <div class="col-span-1">
            <el-form-item v-if="!pointing?.id" :label="$t('employee')">
              <el-select-v2
                v-model="form.employee_id"
                class="!w-full"
                clearable
                filterable
                :reserve-keyword="false"
                :options="filteredEmployees"
                value-key="id"
                @change="addEmployee()"
              ></el-select-v2>
            </el-form-item>
          </div>
          <div class="col-span-2">
            <vxe-table
              ref="xTable"
              class="w-full"
              :data="form.employees"
              :loading="tableLoading"
              :row-config="{ keyField: 'id' }"
              show-footer
              :footer-method="footerMethod"
              border
              round
              max-height="450"
            >
              <vxe-column
                field="uid"
                :title="$t('code')"
                :class-name="isRowInvalid"
                min-width="80"
              ></vxe-column>
              <vxe-column
                field="fullname"
                :title="$t('fullname')"
                :class-name="isRowInvalid"
                min-width="200"
              ></vxe-column>
              <vxe-column
                field="packhouseTask"
                :title="$t('task')"
                :class-name="isRowInvalid"
                min-width="150"
              >
                <template #default="{ rowIndex }">
                  <el-select-v2
                    v-model="form.employees[rowIndex].packhouse_task_id"
                    class="w-full"
                    clearable
                    filterable
                    :reserve-keyword="false"
                    :options="packhouseTasks.map((el) => ({ ...el, label: `${el.name} (${el.code})` }))"
                    value-key="id"
                    @change="onTaskChanged(rowIndex)"
                  ></el-select-v2>
                </template>
              </vxe-column>
              <vxe-column
                field="lot_installment"
                :title="$t('lot-installment-nbr')"
                :class-name="isRowInvalid"
                min-width="150"
              >
                <template #default="{ rowIndex }">
                  <el-select-v2
                    v-model="form.employees[rowIndex].lot_installment_id"
                    :disabled="!form.employees[rowIndex].is_packhouse_task_direct"
                    class="w-full"
                    clearable
                    filterable
                    :reserve-keyword="false"
                    :options="filteredLotInstallments"
                    value-key="id"
                  ></el-select-v2>
                </template>
              </vxe-column>
              <vxe-column field="unity" :title="$t('unity')" :class-name="isRowInvalid" min-width="150">
                <template #default="{ rowIndex }">
                  <el-select
                    v-if="!form.employees[rowIndex].accept_hours_only"
                    v-model="form.employees[rowIndex].final_product_id"
                    clearable
                    filterable
                    class="w-full"
                  >
                    <el-option
                      v-for="(product, index) in products"
                      :key="index"
                      :label="product.name"
                      :value="product.id"
                    ></el-option>
                  </el-select>
                  <div v-else>
                    {{ $t('hour') }}
                  </div>
                </template>
              </vxe-column>
              <vxe-column field="number" :title="$t('number')" :class-name="isRowInvalid" min-width="150">
                <template #default="{ rowIndex }">
                  <el-input-number
                    v-model="form.employees[rowIndex].number"
                    class="!w-full"
                    :step="1"
                    :min="1"
                    value-on-clear="min"
                  ></el-input-number>
                </template>
              </vxe-column>
              <vxe-column
                v-if="!pointing?.id"
                field="actions"
                :title="$t('actions')"
                :class-name="isRowInvalid"
                min-width="100"
                align="center"
                fixed="right"
              >
                <template #default="{ rowIndex }">
                  <div class="flex items-center justify-center">
                    <el-tooltip :content="$t('duplicate')">
                      <el-button plain type="info" size="small" @click="duplicateEmployee(rowIndex)">
                        <i-el-document-copy />
                      </el-button>
                    </el-tooltip>
                    <el-popconfirm
                      v-if="form.employees.length > 1"
                      :title="$t('are-you-sure-to-delete-this')"
                      @confirm="deleteEmployee(rowIndex)"
                    >
                      <template #reference>
                        <div class="ml-1">
                          <el-tooltip :content="$t('delete')">
                            <el-button plain type="danger" size="small">
                              <i-el-delete />
                            </el-button>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-popconfirm>
                  </div>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div>
        <el-button
          plain
          :type="pointing?.id ? 'warning' : 'primary'"
          :loading="loading"
          :disabled="isPointingInvalid || loading"
          @click="save()"
        >
          {{ $t('save') }}
        </el-button>
        <el-button
          plain
          type="info"
          :loading="loading"
          :disabled="loading"
          @click="$dialog.close('create_edit_packhouse_pointing_task')"
        >
          {{ $t('cancel') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { sum } from '@/helpers'

const initForm = {
  added_at: null,
  site_id: null,
  vehicle_id: null,
  reason_id: null,
  packhouse_line_id: null,
  employee_id: null,
  employee_type_id: null,
  payClosure: {},
  employees: [],
}

export default {
  props: {
    pointing: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['reload'],
  data() {
    return {
      loading: false,
      tableLoading: false,
      form: initForm,
      rules: {
        added_at: [
          {
            required: true,
            message: this.$t('please-select-date-and-time'),
            trigger: 'blur',
          },
        ],
        site_id: [
          {
            required: true,
            message: this.$t('please-select-site'),
            trigger: 'blur',
          },
        ],
        reason_id: [
          {
            required: true,
            message: this.$t('please-select-reason'),
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters('site', ['sites', 'groups']),
    ...mapGetters('pointingReason', ['reasons']),
    ...mapGetters('employee', ['employees']),
    ...mapGetters('packhouseTask', ['packhouseTasks']),
    ...mapGetters('packhouseLine', ['packhouseLines']),
    ...mapGetters('cultivation', ['cultivations']),
    ...mapGetters('product', ['products']),
    ...mapGetters('vehicle', ['vehicles']),
    ...mapGetters('lotInstallment', ['lotInstallments']),

    isPointingInvalid() {
      const employees = this.form.employees

      return Boolean(
        !employees.length ||
          employees.filter(
            ({
              packhouse_task_id,
              is_packhouse_task_direct,
              accept_hours_only,
              lot_installment_id,
              final_product_id,
            }) => {
              return (
                !packhouse_task_id ||
                (is_packhouse_task_direct && !lot_installment_id) ||
                (!accept_hours_only && !final_product_id)
              )
            },
          ).length,
      )
    },
    stations() {
      return this.sites.filter(({ group }) => group == this.groups[0].value)
    },
    filteredEmployees() {
      return this.employees
        .filter(({ type_id }) => type_id == this.form.employee_type_id)
        .map((el) => ({ ...el, label: `${el.firstname} ${el.lastname} (${el.uid})` }))
    },
    filteredLotInstallments() {
      return this.lotInstallments.filter(({ status }) => status).map((el) => ({ ...el, label: el.code }))
    },
    defaultDate() {
      return this.$dayjs(this.form.payClosure.start_date).toDate()
    },
  },
  watch: {
    pointing(newVal) {
      if (newVal?.id) {
        const {
          id,
          added_at,
          site_id,
          vehicle_id,
          reason_id,
          employee_id,
          employee,
          packhouse_task_id,
          packhouse_line_id,
          lot_installment_id,
          final_product_id,
          payClosure,
          number,
        } = newVal
        const employeeData = {
          employee_id,
          uid: employee.uid,
          fullname: `${employee.firstname} ${employee.lastname}`,
          packhouse_task_id,
          lot_installment_id,
          is_packhouse_task_direct: lot_installment_id == null ? false : true,
          final_product_id,
          accept_hours_only: !final_product_id,
          number,
        }
        this.form = Object.assign(
          {},
          {
            id,
            added_at: this.$dayjs(added_at).toString(),
            site_id,
            vehicle_id,
            reason_id,
            packhouse_line_id,
            employee_id: null,
            payClosure,
            employee_type_id: payClosure.employee_type_id,
            employees: [employeeData],
          },
        )
      } else {
        this.form = {
          ...initForm,
          employees: [],
          payClosure: newVal.payClosure,
          employee_type_id: newVal.payClosure.employee_type_id,
        }
      }
    },
    'form.employees': {
      deep: true,
      handler() {
        if (this.$refs['xTable']) {
          this.$refs['xTable'].updateFooter()
        }
      },
    },
  },
  methods: {
    ...mapActions('packhousePointingTask', ['newPackhousePointingTask', 'updatePackhousePointingTask']),

    addEmployee() {
      const employee = this.filteredEmployees.find(({ id }) => id == this.form.employee_id)

      this.form.employee_id = null

      if (employee) {
        const { id, uid, firstname, lastname } = employee

        const newEmployee = Object.assign(
          {},
          {
            id: `${id}_${Math.random()}`,
            employee_id: id,
            uid,
            fullname: `${firstname} ${lastname}`,
          },
        )

        this.tableLoading = true
        this.form.employees.unshift(newEmployee)
      }

      this.reloadTable()
    },
    duplicateEmployee(index) {
      const employee = Object.assign({}, this.form.employees[index])

      employee.id = `${employee.employee_id}_${Math.random()}`
      this.tableLoading = true
      this.form.employees.unshift(employee)
      this.reloadTable()
    },
    deleteEmployee(index) {
      this.tableLoading = true
      this.form.employees = this.form.employees.filter((_, i) => i != index)
      this.reloadTable()
    },
    onTaskChanged(index) {
      const { packhouse_task_id } = this.form.employees[index]
      const packhouseTask = this.packhouseTasks.find(({ id }) => id == packhouse_task_id)

      this.form.employees[index].accept_hours_only = packhouseTask?.accept_hours_only
      this.form.employees[index].is_packhouse_task_direct = packhouseTask?.is_direct
      this.form.employees[index].number = packhouseTask?.accept_hours_only ? 8 : 1
      this.form.employees[index].lot_installment_id = null
      this.form.employees[index].final_product_id = null
    },
    reloadTable() {
      setTimeout(() => {
        this.$refs['xTable'].loadData(this.form.employees)
        this.tableLoading = false
      }, 250)
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true

          if (this.form?.id) {
            const { id, added_at, site_id, packhouse_line_id, vehicle_id, reason_id, payClosure } = this.form
            const {
              employee_id,
              packhouse_task_id,
              lot_installment_id,
              final_product_id,
              number,
              accept_hours_only,
              is_packhouse_task_direct,
            } = this.form.employees[0]
            let data = {
              id,
              added_at: this.$dayjs(added_at).format(),
              site_id,
              vehicle_id,
              reason_id,
              packhouse_line_id,
              pay_closure_id: payClosure.id,
              employee_id,
              packhouse_task_id,
              lot_installment_id,
              final_product_id,
              number,
            }

            if (accept_hours_only) {
              data.final_product_id = null
            }
            if (!is_packhouse_task_direct) {
              data.lot_installment_id = null
            }

            this.updatePackhousePointingTask(data)
              .then(() => this.reset())
              .finally(() => (this.loading = false))
          } else {
            const { added_at, site_id, vehicle_id, packhouse_line_id, reason_id, payClosure, employees } =
              this.form
            let form = employees.map((employee) => {
              const {
                employee_id,
                packhouse_task_id,
                lot_installment_id,
                final_product_id,
                number,
                accept_hours_only,
                is_packhouse_task_direct,
              } = employee
              let data = {
                is_nature: false,
                added_at: this.$dayjs(added_at).format(),
                site_id,
                vehicle_id,
                reason_id,
                packhouse_line_id,
                pay_closure_id: payClosure.id,
                employee_id,
                packhouse_task_id,
                lot_installment_id,
                final_product_id,
                number,
              }
              if (accept_hours_only) {
                delete data.final_product_id
              }
              if (!is_packhouse_task_direct) {
                delete data.lot_installment_id
              }
              return data
            })
            this.newPackhousePointingTask(form)
              .then(() => this.reset())
              .finally(() => (this.loading = false))
          }
        }
      })
    },
    reset() {
      this.$dialog.close('create_edit_packhouse_pointing_task')
      this.loading = false
      this.form = initForm
      this.$emit('reload')
    },
    isRowInvalid({ row }) {
      const {
        packhouse_task_id,
        accept_hours_only,
        is_packhouse_task_direct,
        lot_installment_id,
        final_product_id,
      } = row
      return !packhouse_task_id ||
        (is_packhouse_task_direct && !lot_installment_id) ||
        (!accept_hours_only && !final_product_id)
        ? 'bg-red-50'
        : null
    },
    footerMethod({ columns, data }) {
      if (data?.length > 1) {
        return [
          columns.map((column) => {
            switch (column.field) {
              case 'uid':
                return this.$t('total')
              case 'number':
                return sum(data.map(({ number }) => number))
              default:
                return ''
            }
          }),
        ]
      }
    },
    disabledDate(time) {
      let start_date = +this.$dayjs(this.form.payClosure.start_date)
      let end_date = +this.$dayjs(this.form.payClosure.end_date)
      return time.getTime() > end_date || start_date > time.getTime()
    },
  },
}
</script>
