import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],
  nitro: {
    externals: {
      external: ['sanitize-html']
    }
  },
  vite: {
    optimizeDeps: {
      rolldownOptions: {
        external: ['sanitize-html']
      }
    }
  }
})
