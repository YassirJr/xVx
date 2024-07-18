<template>
  <div>
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<script>
import en from 'element-plus/dist/locale/en'
import fr from 'element-plus/dist/locale/fr'

export default {
  computed: {
    locale() {
      const locals = { en, fr }

      return locals[this.$i18n.locale]
    },
  },
}
</script>
