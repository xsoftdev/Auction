// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxt/ui', 'nuxt-swiper', '@nuxtjs/color-mode', '@pinia/nuxt'],
  nitro: {
    plugins: ["~/server/index.ts"]
  },
  colorMode: {
    preference: 'light',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storage: 'localStorage', 
    storageKey: 'theme'
  },
  runtimeConfig: {
    public: {
      dbConnection: process.env.URI,
      jwt: process.env.SECRET
    }
  }
})