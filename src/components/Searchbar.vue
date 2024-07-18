<template>
  <div>
    <el-button class="w-72 rounded-2xl bg-slate-50 hover:border-primary" plain @click="toggleDialog()">
      <i-el-search />
      <span class="ml-2 text-sm">{{ $t('search') }}</span>
    </el-button>
    <el-dialog
      :title="$t('search')"
      :model-value="isVisible"
      top="6vh"
      @keydown="onRouteChange"
      @open="onDialogOpen()"
      @close="isVisible = false"
    >
      <el-input ref="inputRef" v-model="searchValue" size="large" clearable />
      <div v-if="searchValue" ref="searchRef" class="mt-5 max-h-[63vh] overflow-y-auto">
        <div v-for="(route, index) in filteredRoutes" :key="index" @click="toggleDialog()">
          <router-link :to="{ name: route.item.name }">
            <div
              ref="routeRef"
              class="mb-1 p-2"
              :class="{ 'bg-primary/5 text-primary': index === selectedRoute }"
              @mouseenter="selectedRoute = index"
            >
              <h5
                v-if="route.item.group"
                class="text-xs text-gray-400"
                :class="{ 'text-primary/60': index === selectedRoute }"
              >
                {{ $t(route.item.group) }}
              </h5>
              <h3 class="text-lg">{{ $t(route.item.name) }}</h3>
            </div>
          </router-link>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { getAllowedRoutes } from '@/helpers/allowedRoutes'
import { routes } from '@/router/router'
import Fuse from 'fuse.js'
import { useRouter } from 'vue-router'
import { t } from '@/plugins'

const isVisible = ref(false)
const searchValue = ref(null)
const routeList = ref([])
const filteredRoutes = ref([])
const selectedRoute = ref(0)
const inputRef = ref(null)
const routeRef = ref(null)
const searchRef = ref(null)

const router = useRouter()

const allowedRoutes = computed(() => {
  return getAllowedRoutes(routes[0].children)
})

watch(searchValue, () => {
  handleSearch()
  selectedRoute.value = 0
})

onMounted(() => getAllRoutes())

const toggleDialog = () => {
  isVisible.value = !isVisible.value
  searchValue.value = null
}

const getAllRoutes = (routes = allowedRoutes.value, parent = null) => {
  routes.forEach((route) => {
    if (route.children?.length) {
      getAllRoutes(
        route.children.map((el) => ({ ...el, parentName: parent ?? route.path })),
        route.path,
      )
    } else {
      routeList.value.push({
        name: route.name,
        key: t(route.name),
        group: route.parentName,
      })
    }
  })
  return routeList.value
}

const handleSearch = () => {
  if (searchValue.value) {
    const currentRoute = router.currentRoute.value.name
    const options = {
      threshold: 0.4,
      keys: ['key'],
    }
    const fuse = new Fuse(routeList.value, options)

    filteredRoutes.value = fuse
      .search(searchValue.value, { limit: 10 })
      .filter((route) => route.item.name !== currentRoute)
  }
}

const onDialogOpen = () => {
  nextTick().then(() => inputRef.value.focus())
}

const onRouteChange = (e) => {
  if (searchValue.value && filteredRoutes.value.length) {
    const divRect = searchRef.value.getBoundingClientRect()
    const routeRect = routeRef.value[selectedRoute.value].getBoundingClientRect()

    switch (event.keyCode) {
      case 38:
        if (selectedRoute.value > 0) {
          e.preventDefault()

          const inputElement = document.querySelector('input')
          const searchLength = searchValue.value.length

          inputElement.setSelectionRange(searchLength, searchLength)

          const isVisibleInView = routeRect.top - routeRect.height > divRect.top

          selectedRoute.value--
          if (!isVisibleInView) {
            searchRef.value.scrollTop -= routeRect.height
          }
        }
        break
      case 40:
        if (selectedRoute.value < filteredRoutes.value.length - 1) {
          const isVisibleInView = routeRect.bottom + routeRect.height <= divRect.bottom

          selectedRoute.value++
          if (!isVisibleInView) {
            searchRef.value.scrollTop += routeRect.height
          }
        }
        break
      case 13:
        if (routeRef.value[selectedRoute.value]) {
          e.preventDefault()

          const route = filteredRoutes.value[selectedRoute.value].item
          router.push({ name: route.name })
          toggleDialog()
        }
        break
    }
  }
}
</script>
