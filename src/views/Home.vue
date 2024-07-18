<template>
  <div>
    <el-affix :offset="0">
      <navbar @toggle-sidebar-menu="toggleSidebarMenu()"></navbar>
    </el-affix>
    <div
      class="flex w-full"
      :class="{
        'h-[calc(100vh-3.5rem)]': $route.name !== 'dashboard',
        'overflow-hidden': loading || $route.name !== 'dashboard',
      }"
    >
      <sidebar-menu
        v-if="$route.name !== 'dashboard'"
        class="bg-white"
        :menu-closed="menuClosed"
      ></sidebar-menu>
      <div class="flex-1 overflow-hidden">
        <div
          class="h-full bg-gray-100 overflow-auto"
          :class="{ 'rounded-tl-3xl p-5': $route.name !== 'dashboard' }"
        >
          <div
            v-loading="loading"
            element-loading-background="rgba(255, 255, 255, 0.75)"
            :class="{ 'rounded-xl overflow-hidden': loading }"
          >
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import SidebarMenu from '@/components/SidebarMenu'

export default {
  components: { Navbar, SidebarMenu },
  beforeRouteUpdate() {
    this.loading = true
  },
  data() {
    return {
      menuClosed: false,
      loading: false,
    }
  },
  watch: {
    $route() {
      this.loading = false
    },
  },
  beforeMount() {
    this.menuClosed = localStorage.getItem('m-status') == 'true'
  },
  methods: {
    toggleSidebarMenu() {
      localStorage.setItem('m-status', !this.menuClosed)
      this.menuClosed = !this.menuClosed
    },
  },
}
</script>
