// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    '@/assets/style/tailwind.css'
  ],
  app: {
    head: {
      charset: 'utf-16',
      title: 'Pick Color From Image Online',
      meta: [
        { name: 'description', content: "Whether you're a graphic designer, web developer, artist, or just someone who loves colors, our 'Pick Color from Image' online tool is the perfect solution to simplify your color selection process." },
        { name: 'keywords', content: 'pick color from image online, hex code color picker from image, color hex picker from image, color picker from image extension, color picker from image hex color, rgba color picker from image, ral color picker from image' }
      ],
    }
  }
  // js: ['@/assets/js/picker.js']
})
