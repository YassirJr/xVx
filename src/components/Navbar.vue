<template>
  <nav class="_navbar flex justify-between items-center w-full bg-white h-14 pl-4 pr-20 select-none">
    <div class="flex items-center">
      <i-t-menu-2
        v-if="$route.name !== 'dashboard'"
        class="h-6 w-6 cursor-pointer text-slate-500 hover:text-primary"
        @click="$emit('toggle-sidebar-menu')"
      ></i-t-menu-2>
      <img
        class="h-7 w-auto object-contain ml-6 cursor-pointer"
        src="@/assets/images/logo.svg"
        @click="$router.push({ name: 'home' })"
      />
    </div>
    <searchbar></searchbar>
    <div class="flex items-center my-2 text-gray-700">
      <el-dropdown trigger="click">
        <div class="flex items-center">
          <avatar />
          <div class="mx-3 capitalize">{{ user.username }}</div>
          <i-tabler-chevron-down />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="$router.push({ name: 'profile' })">
              <div class="flex items-center pr-3">
                <i-el-key />
                <span class="inline-block ml-2">{{ $t('change-password') }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item class="hover:!bg-danger/5" divided @click="logout">
              <div class="flex items-center pr-3 text-danger">
                <i-el-switch-button />
                <span class="inline-block ml-2">{{ $t('logout') }}</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Avatar from '@/components/Avatar'
import Searchbar from './Searchbar'

export default {
  components: { Avatar, Searchbar },
  emits: ['toggle-sidebar-menu'],
  computed: {
    ...mapGetters('auth', ['user']),
  },
  methods: {
    ...mapActions('auth', ['logout']),
  },
}
</script>
