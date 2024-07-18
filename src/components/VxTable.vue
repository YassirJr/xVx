<template>
  <vxe-grid
    ref="vx-table"
    v-bind="
      showChildrenTable
        ? { ...$attrs, data: ajax }
        : { ...$attrs, ...gridOptions, proxyConfig: { ...gridOptions.proxyConfig, ajax } }
    "
    :columns="getColumns"
    :show-overflow="true"
    :loading-config="{ icon: 'vxe-icon-indicator roll text-4xl !block -mb-5', text: ' ' }"
    :expand-config="expandConfig"
    :row-config="rowConfig"
    @checkbox-change="checkboxChangeEvent"
    @checkbox-all="checkboxChangeEvent"
  >
    <template #toolbar_buttons>
      <slot name="toolbar"></slot>
    </template>
    <template #toolbar_tools>
      <slot name="custom_tools"></slot>
    </template>
    <template #actions="{ row }">
      <slot name="more_actions" v-bind="row"></slot>
      <template v-if="!handleHideActions(row)">
        <el-button v-if="!hideEdit" v-can="editPermission" plain type="warning" @click="$emit('edit', row)">
          <i-el-edit />
        </el-button>
        <el-popconfirm :title="$t('are-you-sure-to-delete-this')" @confirm="$emit('delete', row)">
          <template #reference>
            <el-button v-can="deletePermission" plain type="danger"><i-el-delete /></el-button>
          </template>
        </el-popconfirm>
      </template>
    </template>
    <template #drag>
      <i class="iconify w-6 h-6 mx-auto cursor-move" data-icon="tabler:menu-2"></i>
    </template>
    <template #children="{ row }">
      <div class="p-3 w-full">
        <slot name="children" v-bind="row"></slot>
      </div>
    </template>
  </vxe-grid>
</template>

<script>
import { csvToArray } from '@/helpers'
import Sortable from 'sortablejs'
import { mapGetters } from 'vuex'

export default {
  name: 'VxTable',
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    editPermission: {
      type: String,
      default: () => null,
    },
    deletePermission: {
      type: String,
      default: () => null,
    },
    ajax: {
      type: Object,
      default: () => {},
    },
    hideEdit: {
      type: Boolean,
      default: false,
    },
    hideActions: {
      type: [Array, Boolean],
      default: false,
    },
    customPaginationSize: {
      type: Array,
      default: () => [],
    },
    showChildrenTable: {
      type: Boolean,
      default: false,
    },
    expandConfig: {
      type: Object,
      default: () => ({
        trigger: 'row',
        lazy: true,
        accordion: true,
        reserve: true,
        expandAll: false,
        expandRowKeys: [],
      }),
    },
    rowConfig: {
      type: Object,
      default: () => ({
        keyField: `${Math.random()}-${Math.random()}`,
        useKey: `${Math.random()}-${Math.random()}`,
      }),
    },
  },
  emits: ['edit', 'delete', 'checkboxChange', 'orderChange'],
  data() {
    return {
      search: null,
    }
  },
  computed: {
    ...mapGetters('auth', ['user']),

    pageSizes() {
      return [...new Set([10, 50, 100, 500, 1000, 5000, 10000, ...this.customPaginationSize])].sort(
        (a, b) => a - b,
      )
    },
    gridOptions() {
      return {
        border: true,
        round: true,
        stripe: true,
        maxHeight: window.innerHeight - 136,
        toolbarConfig: {
          slots: {
            buttons: 'toolbar_buttons',
            tools: 'toolbar_tools',
          },
          refresh: true,
          // import: true,
          export: true,
          print: true,
          zoom: true,
          custom: true,
        },
        rowConfig: {
          keyField: 'id',
          isHover: true,
        },
        columnConfig: {
          resizable: true,
          useKey: `${Math.random()}-${Math.random()}`,
        },
        checkboxConfig: {
          checkField: true,
          reserve: true,
        },
        pagerConfig: {
          pageSize: 10,
          pageSizes: this.pageSizes,
        },
        sortConfig: {
          trigger: 'cell',
          remote: true,
          multiple: true,
        },
        filterConfig: {
          remote: true,
        },
        exportConfig: {
          types: ['xlsx', 'csv', 'html', 'xml', 'txt'],
        },
        printConfig: {},
        proxyConfig: {
          seq: true,
          sort: true,
          filter: true,
          props: {
            result: 'result',
            total: 'page.total',
          },
        },
        scrollX: {
          enabled: true,
          gt: 100,
        },
        scrollY: {
          enabled: true,
          gt: 200,
        },
      }
    },
    permissions() {
      return this.user?.permissions.map(({ name }) => name)
    },
    getColumns() {
      let columns = this.columns

      if (
        this.$slots.more_actions === undefined &&
        !this.permissions.includes(this.editPermission) &&
        !this.permissions.includes(this.deletePermission)
      ) {
        columns = this.columns.filter((el) => el.title != this.$t('actions'))
      }

      return columns.map((el) => ({
        ...el,
        minWidth: el?.width ?? 150,
        fixed: el.title == this.$t('actions') ? 'right' : null,
        align: el.title == this.$t('actions') ? 'center' : null,
        showHeaderOverflow: 'tooltip',
      }))
    },
    vxTable() {
      return this.$refs['vx-table']
    },
  },
  mounted() {
    this.initSortable()
  },
  methods: {
    refresh() {
      this.$nextTick(() => {
        this.vxTable.commitProxy('query')
      })
    },
    checkboxChangeEvent(e) {
      this.$emit('checkboxChange', e)
    },
    initSortable() {
      this.$nextTick(() => {
        Sortable.create(this.vxTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
          handle: '.drag-col',
          onEnd: async (x) => {
            const { tableData } = await this.vxTable.getTableData()
            const currRow = tableData.splice(x.oldIndex, 1)[0]
            tableData.splice(x.newIndex, 0, currRow)

            await this.vxTable.loadData([])
            await this.vxTable.loadData(tableData)

            this.$emit('orderChange', { ...x, data: tableData.map((el, i) => ({ ...el, order: i })) })
          },
        })
      })
    },
    // TODO: check usage of this
    async getTableContent() {
      let columns = []
      const { content } = await this.vxTable.exportData({
        download: false,
        onlyContent: true,
        type: 'csv',
        columnFilterMethod({ $columnIndex, column }) {
          columns.push({ index: $columnIndex, title: column.title, field: column.field })

          return { $columnIndex, column }
        },
      })
      return { content: csvToArray(content, columns), columns }
    },
    handleHideActions(row) {
      if (Array.isArray(this.hideActions)) {
        return this.hideActions.includes(row.id)
      }
      return this.hideActions
    },
  },
}
</script>
