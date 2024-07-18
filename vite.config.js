import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import PurgeIcons from 'vite-plugin-purge-icons'
import { compression } from 'vite-plugin-compression2'
import removeConsole from 'vite-plugin-remove-console'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    server: {
      host: process.env.VITE_APP_URL,
      port: process.env.VITE_APP_PORT,
      open: true,
      strictPort: true,
    },
    plugins: [
      vue({ include: [/\.vue$/] }),
      AutoImport({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
          }),
        ],
      }),
      Components({
        resolvers: [
          ElementPlusResolver({ importStyle: 'sass' }),
          IconsResolver({ alias: { t: 'tabler', el: 'ep' } }),
        ],
      }),
      Icons({ autoInstall: true, scale: 1 }),
      PurgeIcons(),
      compression({ exclude: [/\.(br)$/, /\.(gz)$/, /\.(htaccess)$/] }),
      removeConsole(),
      mode == 'dev' && visualizer({ filename: 'report.html' }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/assets/styles/element-theme.scss" as *;`,
        },
      },
    },
    build: {
      sourcemap: false,
      minify: true,
      chunkSizeWarningLimit: 5000,
      commonjsOptions: {
        sourceMap: false,
      },
      rollupOptions: {
        output: {
          entryFileNames: 'js/app-[hash].js',
          chunkFileNames: 'js/chunk-[hash].js',
          assetFileNames: 'css/app-[hash].[ext]',
        },
      },
    },
  }
})
