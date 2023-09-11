// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    '@/assets/style/tailwind.css'
  ],
  app: {
    head: {
      charset: 'utf-16',
      title: 'pick color from image online',
      meta: [
        { name: 'description', content: 'pick color from image online' },
        { name: 'keyworld', content: 'pick color from image, pick color from image online' }
      ],
    }
  }
  // js: ['@/assets/js/picker.js']
})
