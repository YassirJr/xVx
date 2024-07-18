<template>
  <div class="h-full pt-2">
    <div class="h-full overflow-y-auto p-5">
      <template v-for="(menuRoute, index) in allowedRoutes" :key="index">
        <template v-if="menuRoute.children?.length">
          <div class="mb-4">
            <div class="pl-2 pb-2 text-lg font-bold text-gray-600 flex items-center">
              <span class="inline-block mr-1.5 w-2 h-2 bg-gray-600 rounded-full"></span>
              {{ $t(menuRoute.label) }}
            </div>
            <div class="grid grid-cols-12 gap-3">
              <section-card :menu-routes="menuRoute.children" />
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
import { routes } from '@/router/router.js'
import { getAllowedRoutes } from '@/helpers/allowedRoutes'
import SectionCard from '@/components/SectionCard'

export default {
  components: { SectionCard },
  computed: {
    allowedRoutes() {
      return getAllowedRoutes(routes.filter(({ name }) => name === 'home')[0].children)
    },
  },
}
</script>
