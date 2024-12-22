// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
    }
  },

  modules: ['@nuxtjs/tailwindcss'],
})