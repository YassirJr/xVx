<template>
  <template v-for="(menuRoute, index) in menuRoutes" :key="index">
    <template v-if="menuRoute.children?.length">
      <section-card :menu-routes="menuRoute.children" />
    </template>
    <div
      v-else
      :key="menuRoute"
      class="xl:col-span-2 lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12 h-32 text-gray-500 hover:text-primary bg-white rounded-lg border hover:border-primary transition-all duration-150 overflow-hidden"
    >
      <router-link :to="{ name: menuRoute.name }">
        <div class="flex items-center justify-center h-full w-full hover:bg-primary/5 active:bg-primary/10">
          <div>
            <span class="iconify w-10 h-10 m-auto" :data-icon="`tabler:${menuRoute.meta.icon}`"></span>
            <div class="pt-2 text-center">{{ $t(menuRoute.name) }}</div>
          </div>
        </div>
      </router-link>
    </div>
  </template>
</template>
<script>
export default {
  props: {
    menuRoutes: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
