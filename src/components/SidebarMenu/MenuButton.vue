<template>
  <div :class="{ 'ml-2 mt-1': !menuClosed }">
    <router-link v-if="!menuRoute.children?.length" :to="{ name: menuRoute.name }">
      <el-tooltip :disabled="!menuClosed" :content="$t(menuRoute.meta.label)" placement="right">
        <div
          class="flex rounded-lg items-center text-gray-600 cursor-pointer my-1.5 overflow-hidden p-2.5 text-sm"
          :class="[
            { 'justify-center': menuClosed },
            menuRoute.name == $route.name ? 'text-primary bg-primary/10' : 'hover:bg-gray-100',
          ]"
        >
          <span>
            <i class="iconify w-5 h-5" :data-icon="`tabler:${menuRoute.meta.icon}`"></i>
          </span>
          <div v-if="!menuClosed" class="pl-2 text-md truncate">
            {{ $t(menuRoute.meta.label) }}
          </div>
        </div>
      </el-tooltip>
    </router-link>
    <div v-else>
      <el-tooltip :disabled="!menuClosed" :content="$t(menuRoute.label)" placement="right">
        <div
          class="flex rounded-lg items-center cursor-pointer p-2.5 text-sm mt-1.5"
          :class="[
            { 'justify-center': menuClosed },
            openedRoute ? 'text-primary bg-primary/10' : 'hover:bg-gray-100',
          ]"
          @click="toggleOpen()"
        >
          <span
            v-if="menuRoute.meta?.icon"
            class="iconify w-5 h-5"
            :data-icon="`tabler:${menuRoute.meta.icon}`"
          ></span>
          <div v-if="!menuClosed" class="pl-2 text-md flex-1 truncate">
            {{ $t(menuRoute.label) }}
          </div>
          <template v-if="!menuClosed">
            <i-el-arrow-down v-if="openedRoute" class="w-4" />
            <i-el-arrow-right v-else class="w-4" />
          </template>
        </div>
      </el-tooltip>
      <el-collapse-transition>
        <div v-show="openedRoute">
          <menu-button
            v-for="(childRoute, index) in menuRoute.children"
            :key="index"
            :menu-route="childRoute"
            :menu-closed="menuClosed"
            :opened-routes="openedRoutes"
            @open="setOpen"
          ></menu-button>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    menuRoute: {
      type: Object,
      default: () => {},
    },
    menuClosed: Boolean,
    openedRoutes: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['open'],
  computed: {
    ...mapGetters('auth', ['user']),
    openedRoute() {
      return this.openedRoutes.some(
        ({ menuRoute, open }) => JSON.stringify(menuRoute) == JSON.stringify(this.menuRoute) && open,
      )
    },
  },
  watch: {
    '$route.name'() {
      this.emitActiveRoute()
    },
  },
  mounted() {
    this.emitActiveRoute()
  },
  methods: {
    emitActiveRoute() {
      if (this.menuRoute.name === this.$route.name) {
        this.$emit('open', {
          state: true,
          routes: [],
        })
      }
    },
    setOpen({ state, routes }) {
      this.$emit('open', {
        state,
        routes: [...routes, { menuRoute: this.menuRoute, active: state, open: true }],
      })
    },
    toggleOpen() {
      let routeExist = this.openedRoutes.filter(
        ({ menuRoute }) => JSON.stringify(menuRoute) == JSON.stringify(this.menuRoute),
      )
      let routes = routeExist[0]?.open
        ? this.openedRoutes.map((route) => {
            if (JSON.stringify(route.menuRoute) === JSON.stringify(this.menuRoute)) {
              return {
                ...route,
                open: false,
              }
            }
            return route
          })
        : [
            ...this.openedRoutes.map((route) => {
              if (JSON.stringify(route.menuRoute) == JSON.stringify(this.menuRoute)) {
                return {
                  ...route,
                  open: true,
                }
              } else if (!route.active) {
                return {
                  ...route,
                  open: false,
                }
              }
              return route
            }),
            routeExist[0] === undefined && {
              menuRoute: this.menuRoute,
              active: false,
              open: true,
            },
          ]
      routes = routes.filter((route) => route.active || route.open)
      this.$emit('open', { state: false, routes })
    },
  },
}
</script>
