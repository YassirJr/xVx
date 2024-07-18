<template>
  <div
    class="overflow-y-auto transition-[width] duration-250 mt-5"
    :class="menuClosed ? 'w-[90px]' : 'w-[230px]'"
  >
    <div class="select-none pr-3 pt-1" :class="menuClosed ? 'pl-3' : 'pl-1'">
      <div v-for="menuRoute in allowedRoutes" :key="menuRoute.name">
        <div v-if="menuRoute.meta?.isGroup && menuRoute.children?.length">
          <div v-if="menuClosed" class="border-slate-200 mt-1 mx-2 border-b mb-1.5"></div>
          <div v-else class="text-slate-500 font-semibold px-2 text-sm">
            {{ $t(menuRoute.label) }}
          </div>
          <menu-button
            v-for="subRoute in menuRoute.children"
            :key="subRoute.name"
            :menu-route="subRoute"
            :menu-closed="menuClosed"
            :opened-routes="openedRoutes"
            @open="setOpen"
          ></menu-button>
        </div>
        <div v-else>
          <menu-button
            :menu-route="menuRoute"
            :menu-closed="menuClosed"
            :opened-routes="openedRoutes"
            @open="setOpen"
          ></menu-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuButton from './MenuButton'
import { routes } from '@/router/router.js'
import { getAllowedRoutes } from '@/helpers/allowedRoutes'

export default {
  components: {
    MenuButton,
  },
  props: {
    menuClosed: Boolean,
  },
  data() {
    return {
      openedRoutes: [],
    }
  },
  computed: {
    allowedRoutes() {
      return getAllowedRoutes(routes[0].children.filter(({ name }) => name !== 'profile'))
    },
  },
  methods: {
    setOpen(open) {
      this.openedRoutes = open.routes
    },
  },
}
</script>
