<template>
  <div v-loading="loading" class="bg-white p-5 rounded-xl">
    <vx-table ref="vxtable" :columns="columns" :ajax="ajax">
      <template #toolbar>
        <div class="flex justify-start items-center">
          <period-type
            :add-processing="true"
            :add-date-picker="true"
            process-permission="processed-transport-process"
            @pay-closure-change="payClosureChange"
            @launch-processing="launchProcessing"
          />
        </div>
      </template>
    </vx-table>
  </div>
</template>

<script setup>
import PeriodType from '@/components/PeriodType'
import { InputFilter, SelectFilter, useQuery } from '@/helpers'
import { t, dayjs } from '@/plugins'
import { DATE_FORMAT } from '@/constants'
import { ref, computed, onMounted } from 'vue'
import { useSiteStore } from '@/stores/site'
import { usePointingTransporterStore } from '@/stores/pointingTransporter'
import { useVehicleStore } from '@/stores/vehicle'

const payClosure = ref({
  id: null,
  status: false,
  start_date: null,
  end_date: null,
})
const loading = ref(false)
const vxtable = ref(null)

const pointingTransporterStore = usePointingTransporterStore()
const siteStore = useSiteStore()
const vehicleStore = useVehicleStore()

onMounted(() => {
  siteStore.fetchAllSites()
})

const ajax = computed(() => {
  return {
    query: (params) => {
      if (!payClosure.value.id) {
        return { page: { total: 0 }, result: [] }
      }

      const query = useQuery(params)

      query.filter['pay_closure_id'] = payClosure.value.id
      query.filter['added_at'] = query.filter.added_at ?? payClosure.value.added_at

      return new Promise((resolve) => {
        pointingTransporterStore.fetchProcessed(query).then(({ data, meta }) => {
          resolve({
            page: {
              total: meta.total,
            },
            result: data?.map((el) => ({
              ...el,
              leader_uid: el.leader.uid,
              leader_fullname: `${el.leader.firstname} ${el.leader.lastname}`,
              itinerary_name: `${el.leader.departure.label}-${el.site.name}`,
              itinerary_code: `${el.leader.departure.code}-${el.site.id}`,
            })),
          })
        })
      })
    },
  }
})

const columns = computed(() => {
  return [
    {
      field: 'added_at',
      title: t('date'),
      sortable: true,
      formatter: ({ row }) => dayjs(row.added_at).format(DATE_FORMAT),
      ...InputFilter({
        type: 'date',
        clearable: true,
        payClosure: payClosure.value,
        data: payClosure.value.start_date,
      }),
    },
    {
      field: 'leader.uid',
      title: t('leader-code'),
      formatter: ({ row }) => row.leader_uid,
      ...InputFilter(),
    },
    {
      field: 'leader_fullname',
      title: t('leader'),
    },
    {
      field: 'vehicle.registration_nbr',
      title: t('vehicle'),
      ...InputFilter(),
    },
    {
      field: 'vehicle.transporter.name',
      title: t('transporter'),
    },
    {
      field: 'itinerary_name',
      title: t('itinerary'),
    },
    {
      field: 'site.name',
      title: t('site'),
      ...SelectFilter({ filters: siteStore.sites?.map((el) => ({ label: el.name, value: el.name })) ?? [] }),
    },
    {
      field: 'vehicle.type.name',
      title: t('vehicle-type'),
      ...InputFilter(),
    },
    {
      field: 'leader.departure.code',
      title: t('departure-code'),
    },
    {
      field: 'leader.departure.label',
      title: t('departure'),
      ...InputFilter(),
    },
    {
      field: 'nbr_staff',
      title: t('nbr-eff'),
    },
    {
      field: 'itinerary_code',
      title: t('itinerary-code'),
    },
    {
      field: 'computed_data.distance',
      title: t('distance'),
    },
    {
      field: 'computed_data.place_rate',
      title: t('price-per-place'),
    },
    {
      field: 'computed_data.trip_rate',
      title: t('trip-rate'),
    },
    {
      field: 'computed_data.nbr_place_min',
      title: t('nbr-place-min'),
    },
    {
      field: 'computed_data.nbr_place_max',
      title: t('nbr-place-max'),
    },
    {
      field: 'avg',
      title: t('avg'),
    },
    {
      field: 'calc_mode',
      title: t('calc-mode'),
      formatter: ({ cellValue }) =>
        (cellValue = t(vehicleStore.calcModes.find(({ value }) => value == cellValue).label)),
    },
    {
      field: 'amount',
      title: t('mount'),
    },
  ]
})

const payClosureChange = (val) => {
  payClosure.value = val
  vxtable.value.refresh()
}

const launchProcessing = ({ added_at, status, id }) => {
  loading.value = true
  payClosure.value = {
    ...payClosure.value,
    id,
    status,
    added_at,
  }

  pointingTransporterStore.process({ pay_closure_id: id, added_at }).finally(() => {
    loading.value = false
    vxtable.value.refresh()
  })
}
</script>
